import { useState, useEffect } from 'react';
import type { Language } from '../types';

let translations: { [key: string]: any } = {};
let loadedLang: Language | null = null;

const fetchTranslations = async (lang: Language) => {
    if (loadedLang === lang) {
        return translations;
    }
    try {
        // ✅ ĐÃ SỬA LỖI ĐƯỜNG DẪN: Dùng đường dẫn tuyệt đối /locales/
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            // Lỗi ở đây chính là lỗi 404 bạn thấy trên console
            throw new Error(`Could not load ${lang}.json`);
        }
        translations = await response.json();
        loadedLang = lang;
        return translations;
    } catch (error) {
        console.error("Failed to fetch translations:", error);
        // Mình sẽ throw lỗi ở đây để component biết dịch thuật bị lỗi
        throw new Error(`Failed to fetch translations: – ${error.message}`); 
    }
};

// Pre-fetch default language
fetchTranslations('vi');

export const useTranslation = (lang: Language) => {
    const [isLoaded, setIsLoaded] = useState(loadedLang === lang);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                await fetchTranslations(lang);
                if (active) {
                    setIsLoaded(true);
                }
            } catch (e) {
                // Xử lý lỗi fetch ở đây nếu cần, nhưng log đã có trong fetchTranslations
            }
        };
        if (loadedLang !== lang) {
            setIsLoaded(false);
            load();
        } else {
            setIsLoaded(true);
        }
        return () => {
            active = false;
        }
    }, [lang]);

    const t = (key: string, options?: { [key: string]: string | number }): string => {
        if (!isLoaded) return key;

        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; 
            }
        }
        
        let finalResult = String(result);

        if (options) {
            Object.keys(options).forEach(optKey => {
                const regex = new RegExp(`{{${optKey}}}`, 'g');
                finalResult = finalResult.replace(regex, String(options[optKey]));
            });
        }

        return finalResult;
    };

    return t;
};