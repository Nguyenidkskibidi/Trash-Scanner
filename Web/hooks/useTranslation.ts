import { useState, useEffect } from 'react';
import type { Language } from '../types';

let translations: { [key: string]: any } = {};
let loadedLang: Language | null = null;

const fetchTranslations = async (lang: Language) => {
    if (loadedLang === lang) {
        return translations;
    }
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not load ${lang}.json`);
        }
        translations = await response.json();
        loadedLang = lang;
        return translations;
    } catch (error) {
        console.error("Failed to fetch translations:", error);
        return {}; 
    }
};

// Pre-fetch default language
fetchTranslations('vi');

export const useTranslation = (lang: Language) => {
    const [isLoaded, setIsLoaded] = useState(loadedLang === lang);

    useEffect(() => {
        let active = true;
        const load = async () => {
            await fetchTranslations(lang);
            if (active) {
                setIsLoaded(true);
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