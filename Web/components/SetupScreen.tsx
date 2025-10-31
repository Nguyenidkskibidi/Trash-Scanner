import React, { useState, useEffect, useCallback } from 'react';
import { ComputerIcon } from './icons/ComputerIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import type { DeviceType, UserProfile, Gender, Salutation, Language } from '../types';
// 🔥 FIX 1: XÓA DÒNG IMPORT GÂY LỖI (Không dùng hook nữa)
// import { useTranslation } from '../hooks/useTranslation'; 
// 🔥 FIX 2: IMPORT ẢNH CỜ (Nếu bạn đã chuyển sang ảnh tĩnh)
import VietnamFlag from './icons/VietnamFlagIcon.png'; 
import UKFlag from './icons/UKFlagIcon.png'; 


interface SetupScreenProps {
  onSetupComplete: (profile: UserProfile, language: Language) => void;
  initialLang: Language;
  // 🔥 FIX 3: NHẬN HÀM t() TỪ COMPONENT MẸ (APP.TSX)
  t: (key: string, options?: Record<string, string | number>) => string;
}

// ... (Các Icon Male/Female giữ nguyên) ...

const TOTAL_STEPS = 5;

// 🔥 FIX 4: NHẬN t() TỪ PROPS
export const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, initialLang, t }) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<Language>(initialLang);
  const [profile, setProfile] = useState<Partial<UserProfile>>({ name: '', dob: '' });
  const [error, setError] = useState<string | null>(null);

  // 🔥 ĐÃ XÓA: const t = useTranslation(language); 
  // ... (Phần logic còn lại giữ nguyên, vì nó đã dùng t('key') và giờ t đã là prop)
  // ... (Phần renderStep cũng đã được sửa để dùng <img> và t('key') )
  
  // ... (Sử dụng code cũ của bạn cho phần còn lại)

  const handleFinish = useCallback(() => {
    onSetupComplete(profile as UserProfile, language);
  }, [onSetupComplete, profile, language]);
// ... (Hàm nextStep, prevStep, handleDobChange giữ nguyên) ...

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
            <div className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-text-main font-display">{t('setup.language.title')}</h2>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                    <button
                        onClick={() => setLanguage('vi')}
                        className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${language === 'vi' ? 'border-brand-green' : 'border-transparent'}`}
                    >
                        {/* 💖 SỬ DỤNG ẢNH TĨNH */}
                        <img 
                            src={VietnamFlag} 
                            alt="Vietnam Flag" 
                            className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg shadow-md object-cover" 
                            style={{ aspectRatio: '3/2' }}
                        />
                        <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">{t('setup.language.vietnamese')}</span>
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${language === 'en' ? 'border-brand-green' : 'border-transparent'}`}
                    >
                         <img 
                            src={UKFlag} 
                            alt="UK Flag" 
                            className="w-16 h-8 sm:w-20 sm:h-10 rounded-lg shadow-md object-cover" 
                            style={{ aspectRatio: '2/1' }}
                        />
                        <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">{t('setup.language.english')}</span>
                    </button>
                </div>
            </div>
        );
      case 2:
        return (
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-text-main font-display">{t('setup.name.title')}</h2>
            <p className="mt-2 text-text-muted">{t('setup.name.subtitle')}</p>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => {
                setProfile(p => ({ ...p, name: e.target.value }));
                if (error) setError(null);
              }}
              placeholder={t('setup.name.placeholder')}
              className="w-full mt-6 px-4 py-3 bg-card border border-border-color text-text-main rounded-full focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-shadow text-center"
              autoFocus
            />
          </div>
        );
// ... (Phần case 3, 4, 5 giữ nguyên) ...

// ... (Phần Logic và JSX cuối giữ nguyên)
  };
    // ... (rest of the code)
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
        <div className="w-full max-w-md mb-8">
            <div className="bg-text-main/10 rounded-full h-2">
                <div 
                    className="bg-brand-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                ></div>
            </div>
            <p className="text-sm text-text-muted mt-2">{t('setup.step', { current: step, total: TOTAL_STEPS })}</p>
        </div>
      
        <div className="flex-grow flex items-center justify-center w-full">
            <div key={step} className="animate-fade-in w-full flex justify-center">
                {renderStep()}
            </div>
        </div>

        {error && <p className="text-red-500 h-6 mb-2 animate-shake-horizontal">{error}</p>}
        
        <div className="flex gap-4 mt-8">
            {step > 1 && (
                <button
                    onClick={prevStep}
                    className="px-8 py-3 bg-card text-text-main font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
                >
                    {t('common.back')}
                </button>
            )}
            {step < TOTAL_STEPS ? (
                <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-brand-green text-white font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
                >
                    {t('common.next')}
                </button>
            ) : (
                <button
                    onClick={handleFinish}
                    className="px-8 py-3 bg-brand-green text-white font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
                >
                    {t('common.finish')}
                </button>
            )}
        </div>
    </div>
  );
};