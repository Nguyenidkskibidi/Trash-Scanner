import React, { useState, useEffect, useCallback } from 'react';
import { ComputerIcon } from './icons/ComputerIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import type { DeviceType, UserProfile, Gender, Salutation, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
// Đã xoá: import { VietnamFlagIcon } from './icons/VietnamFlagIcon';
// Đã xoá: import { UKFlagIcon } from './icons/UKFlagIcon';

// --- ĐÃ XOÁ CÁC DÒNG IMPORT ẢNH PNG BỊ LỖI ĐƯỜNG DẪN MODULE ---


interface SetupScreenProps {
  onSetupComplete: (profile: UserProfile, language: Language) => void;
  initialLang: Language;
}

const MaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14m-7-7h14"/></svg>
);
const FemaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 16v6m-3-3h6"/></svg>
);
const OtherGenderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="m15 9 6-6"/><path d="M9 9 3 3"/><path d="M9 15 3 21"/><path d="m15 15 6 6"/><path d="M12 5v14"/></svg>
);

const TOTAL_STEPS = 5;

export const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, initialLang }) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<Language>(initialLang);
  const [profile, setProfile] = useState<Partial<UserProfile>>({ name: '', dob: '' });
  const [error, setError] = useState<string | null>(null);

  const t = useTranslation(language);

  const handleFinish = useCallback(() => {
    onSetupComplete(profile as UserProfile, language);
  }, [onSetupComplete, profile, language]);

  const nextStep = useCallback(() => {
    setError(null);
    if (step === 1 && !language) {
      setError("Please select a language."); // Should not happen
      return;
    }
    if (step === 2 && !profile.name?.trim()) {
        setError(t('setup.error.name'));
        return;
    }
    if (step === 3 && !profile.deviceType) {
        setError(t('setup.error.device'));
        return;
    }
     if (step === 4) {
        if (!profile.gender || !profile.dob || !profile.salutation) {
            setError(t('setup.error.info'));
            return;
        }
        if (profile.dob.length < 10) {
            setError(t('setup.error.dobFormat'));
            return;
        }

        const parts = profile.dob.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            const enteredDate = new Date(year, month - 1, day);
            const minDate = new Date(1900, 0, 1);
            const today = new Date();
            today.setHours(23, 59, 59, 999); 

            if (enteredDate.getFullYear() !== year || enteredDate.getMonth() !== month - 1 || enteredDate.getDate() !== day) {
                 setError(t('setup.error.dobInvalid'));
                 return;
            }
            if (enteredDate < minDate) {
                setError(t('setup.error.dobPast'));
                return;
            }
            if (enteredDate > today) {
                setError(t('setup.error.dobFuture'));
                return;
            }
        } else {
            setError(t('setup.error.dobFormat'));
            return;
        }
    }

    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  }, [step, profile, language, t]);
  
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (step < TOTAL_STEPS) {
          nextStep();
        } else {
          handleFinish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, nextStep, handleFinish]);
  
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    let formatted = '';

    if (numbers.length > 0) formatted = numbers.slice(0, 2);
    if (numbers.length > 2) formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    if (numbers.length > 4) formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    
    setProfile(p => ({ ...p, dob: formatted }));
    if (error) setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
            <div className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-text-main font-display">Chọn Ngôn ngữ / Select Language</h2>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                    <button
                        onClick={() => setLanguage('vi')}
                        className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${language === 'vi' ? 'border-brand-green' : 'border-transparent'}`}
                    >
                        {/* SỬ DỤNG ĐƯỜNG DẪN TUYỆT ĐỐI */}
                        <img 
                            src="/VietnamFlagIcon.png" 
                            alt="Cờ Việt Nam" 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" 
                            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src="https://placehold.co/80x80/C8102E/FFFFFF?text=VN"; }} 
                        />
                        <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">Tiếng Việt</span>
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${language === 'en' ? 'border-brand-green' : 'border-transparent'}`}
                    >
                        {/* SỬ DỤNG ĐƯỜNG DẪN TUYỆT ĐỐI */}
                        <img 
                            src="/UKFlagIcon.png" 
                            alt="English Flag" 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" 
                            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src="https://placehold.co/80x80/003C71/FFFFFF?text=UK"; }} 
                        />
                        <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">English</span>
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
      case 3:
        return (
          <div className="w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-text-main font-display">{t('setup.device.title')}</h2>
            <p className="mt-2 text-text-muted">{t('setup.device.subtitle')}</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <button
                onClick={() => setProfile(p => ({ ...p, deviceType: 'computer' }))}
                className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${profile.deviceType === 'computer' ? 'border-brand-green' : 'border-transparent'}`}
              >
                <ComputerIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-green" />
                <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">{t('setup.device.computer')}</span>
                <span className="mt-1 text-xs sm:text-sm text-text-muted">{t('setup.device.computerDesc')}</span>
              </button>
              <button
                onClick={() => setProfile(p => ({ ...p, deviceType: 'phone' }))}
                className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-neumorphic transition-all duration-200 hover:-translate-y-2 hover:shadow-xl w-48 h-48 sm:w-56 sm:h-56 border-4 ${profile.deviceType === 'phone' ? 'border-brand-green' : 'border-transparent'}`}
              >
                <PhoneIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-green" />
                <span className="mt-3 text-lg sm:text-xl font-bold text-text-main font-display">{t('setup.device.phone')}</span>
                <span className="mt-1 text-xs sm:text-sm text-text-muted">{t('setup.device.phoneDesc')}</span>
              </button>
            </div>
          </div>
        );
        case 4:
            const genders = { vi: ['Nam', 'Nữ', 'Khác'], en: ['Male', 'Female', 'Other'] };
            const salutations = { vi: ['Anh', 'Chị', 'Bạn'], en: ['Mr', 'Ms', 'Friend'] };
            // Fix: Refactored ChoiceButton to use a standard interface and React.FC to resolve typing issues.
            interface ChoiceButtonProps {
              value: string;
              selectedValue?: string | null;
              onClick: () => void;
              children: React.ReactNode;
            }
            const ChoiceButton: React.FC<ChoiceButtonProps> = ({ value, selectedValue, onClick, children }) => (
                <button
                    onClick={() => { onClick(); if (error) setError(null); }}
                    className={`flex-1 p-4 bg-card rounded-lg shadow-neumorphic transition-all duration-200 text-text-main font-semibold flex items-center justify-center gap-2 ${selectedValue === value ? 'shadow-neumorphic-inset !text-brand-green-dark' : 'hover:-translate-y-1'}`}
                >
                    {children}
                </button>
            );
            return (
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-text-main font-display">{t('setup.details.gender')}</h3>
                         <div className="mt-2 flex gap-3">
                            <ChoiceButton value={genders[language][0]} selectedValue={profile.gender} onClick={() => setProfile(p => ({...p, gender: genders[language][0] as Gender}))}><MaleIcon className="w-5 h-5" /> {genders[language][0]}</ChoiceButton>
                            <ChoiceButton value={genders[language][1]} selectedValue={profile.gender} onClick={() => setProfile(p => ({...p, gender: genders[language][1] as Gender}))}><FemaleIcon className="w-5 h-5" /> {genders[language][1]}</ChoiceButton>
                            <ChoiceButton value={genders[language][2]} selectedValue={profile.gender} onClick={() => setProfile(p => ({...p, gender: genders[language][2] as Gender}))}><OtherGenderIcon className="w-5 h-5" /> {genders[language][2]}</ChoiceButton>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-main font-display">{t('setup.details.dob')}</h3>
                        <input
                            type="text" value={profile.dob} onChange={handleDobChange}
                            placeholder={language === 'vi' ? 'DD/MM/YYYY' : 'DD/MM/YYYY'}
                            maxLength={10}
                            className="w-full mt-2 px-4 py-3 bg-card border border-border-color text-text-main rounded-full focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-shadow text-center"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-main font-display">{t('setup.details.salutation')}</h3>
                        <div className="mt-2 flex gap-3">
                            <ChoiceButton value={salutations[language][0]} selectedValue={profile.salutation} onClick={() => setProfile(p => ({...p, salutation: salutations[language][0] as Salutation}))}>{salutations[language][0]}</ChoiceButton>
                            <ChoiceButton value={salutations[language][1]} selectedValue={profile.salutation} onClick={() => setProfile(p => ({...p, salutation: salutations[language][1] as Salutation}))}>{salutations[language][1]}</ChoiceButton>
                            <ChoiceButton value={salutations[language][2]} selectedValue={profile.salutation} onClick={() => setProfile(p => ({...p, salutation: salutations[language][2] as Salutation}))}>{salutations[language][2]}</ChoiceButton>
                        </div>
                    </div>
                </div>
            );
        case 5:
            return (
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-text-main font-display">{t('setup.finish.title')}</h2>
                    <p className="mt-2 text-text-muted">{t('setup.finish.subtitle')}</p>
                    <div className="mt-6 bg-background/50 p-4 rounded-lg text-left space-y-1">
                        <p><strong>{t('setup.details.name')}:</strong> {profile.name}</p>
                        <p><strong>{t('setup.details.device')}:</strong> {profile.deviceType === 'computer' ? t('setup.device.computer') : t('setup.device.phone')}</p>
                        <p><strong>{t('setup.details.gender')}:</strong> {profile.gender}</p>
                        <p><strong>{t('setup.details.dob')}:</strong> {profile.dob}</p>
                        <p><strong>{t('setup.details.salutation')}:</strong> {profile.salutation}</p>
                    </div>
                </div>
            )
      default:
        return null;
    }
  };


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
