import React, { useState, useEffect } from 'react';
import type { UserProfile, AppSettings, Gender, Salutation, Theme, Language, DeviceType } from '../types';
import { BackIcon } from './icons/BackIcon';
import { ThemeSwitcher } from './ThemeSwitcher';
// 🔥 FIX 1: LOẠI BỎ IMPORT COMPONENT TSX GỐC và chỉ dùng import file ảnh PNG
// LƯU Ý: Đảm bảo file VietnamFlagIcon.png và UKFlagIcon.png tồn tại trong thư mục ./icons/
import VietnamFlag from './icons/VietnamFlagIcon.png'; 
import UKFlag from './icons/UKFlagIcon.png'; 
// Thêm các icon SVG (vì chúng vẫn là component TSX)
import { ComputerIcon } from './icons/ComputerIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  settings: AppSettings;
  onSave: (profile: UserProfile, settings: AppSettings) => void;
  onResetApp: () => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  settings,
  onSave,
  onResetApp,
  t
}) => {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentProfile(profile);
      setCurrentSettings(settings);
    }
  }, [isOpen, profile, settings]);
  
  const handleLanguageChange = (lang: Language) => {
    const wasVi = currentSettings.language === 'vi';
    const isVi = lang === 'vi';

    if(wasVi === isVi) return;

    const genderMap: { [key in Gender]?: Gender } = {
        'Nam': 'Male', 'Nữ': 'Female', 'Khác': 'Other',
        'Male': 'Nam', 'Female': 'Nữ', 'Other': 'Khác'
    };
    const salutationMap: { [key in Salutation]?: Salutation } = {
        'Anh': 'Mr', 'Chị': 'Ms', 'Bạn': 'Friend',
        'Mr': 'Anh', 'Ms': 'Chị', 'Friend': 'Bạn'
    };
    
    setCurrentSettings(s => ({ ...s, language: lang }));
    setCurrentProfile(p => ({
        ...p,
        gender: p.gender ? genderMap[p.gender] || p.gender : p.gender,
        salutation: p.salutation ? salutationMap[p.salutation] || p.salutation : p.salutation
    }));
  };

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(onClose, 300);
  };

  const handleSave = () => {
    onSave(currentProfile, currentSettings);
    handleClose();
  };
  
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    let formatted = '';

    if (numbers.length > 0) formatted = numbers.slice(0, 2);
    if (numbers.length > 2) formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    if (numbers.length > 4) formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    
    setCurrentProfile(p => ({ ...p, dob: formatted }));
  };
  
  const handleReminderToggle = async () => {
    // Toggling from OFF to ON
    if (!currentSettings.enableReminder) {
        // TẠM THỜI DÙNG alert() VÀ window.confirm() cho chức năng này
        if (!('Notification' in window)) {
            alert(t('settings.notifications.notSupported'));
            return;
        }

        if (Notification.permission === 'granted') {
            setCurrentSettings(s => ({ ...s, enableReminder: true }));
            new Notification(t('settings.notifications.enabledTitle'), {
                body: t('settings.notifications.enabledBody'),
                icon: '/vite.svg' 
            });
        } else if (Notification.permission === 'denied') {
            alert(t('settings.notifications.denied'));
        } else { // 'default' state
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setCurrentSettings(s => ({ ...s, enableReminder: true }));
                    new Notification(t('settings.notifications.enabledTitle'), {
                        body: t('settings.notifications.enabledBody'),
                        icon: '/vite.svg' 
                    });
                } else {
                    alert(t('settings.notifications.denied'));
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    } else {
        // Toggling from ON to OFF
        setCurrentSettings(s => ({ ...s, enableReminder: false }));
    }
  };

  useEffect(() => {
    if (!isOpen) {
        setIsAnimatingOut(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const genders = t('settings.genders').split(',');
  const salutations = t('settings.salutations').split(',');

  // Fix: Refactored ChoiceButton to use a standard interface and React.FC to resolve typing issues.
  interface ChoiceButtonProps {
    value: string;
    selectedValue?: string | null;
    onClick: () => void;
    children: React.ReactNode;
  }
  const ChoiceButton: React.FC<ChoiceButtonProps> = ({ value, selectedValue, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-3 bg-card rounded-lg shadow-neumorphic transition-all duration-200 text-text-main font-semibold flex items-center justify-center gap-2 ${selectedValue === value ? 'shadow-neumorphic-inset !text-brand-green-dark' : 'hover:-translate-y-0.5'}`}
    >
        {children}
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDuration: '300ms' }}>
      <div onClick={handleClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className={`relative w-full max-w-2xl h-[90vh] max-h-[700px] bg-card/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4 ${isAnimatingOut ? 'animate-pop-out' : 'animate-pop-in'}`}>
        <header className="flex items-center p-4 border-b border-border-color/50 flex-shrink-0">
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-text-main/10 transition-colors" aria-label={t('settings.close')}>
            <BackIcon className="w-6 h-6 text-text-main" />
          </button>
          <div className="ml-4 text-center flex-grow">
            <h2 className="text-lg font-bold text-text-main font-display">{t('settings.title')}</h2>
          </div>
          <div className="w-10"></div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto space-y-8">
          <section className="animate-slide-in-up" style={{ animationDelay: '50ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.personalInfo')}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="font-semibold text-text-muted text-sm">{t('setup.details.name')}</label>
                <input
                  id="name"
                  type="text"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full mt-1 px-4 py-2 bg-background border border-border-color text-text-main rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                />
              </div>
               <div>
                <label className="font-semibold text-text-muted text-sm">{t('setup.details.device')}</label>
                <div className="mt-2 flex gap-3">
                    <ChoiceButton value={'computer'} selectedValue={currentProfile.deviceType} onClick={() => setCurrentProfile(p => ({...p, deviceType: 'computer' }))}>
                        <ComputerIcon className="w-5 h-5" />
                        {t('setup.device.computer')}
                    </ChoiceButton>
                    <ChoiceButton value={'phone'} selectedValue={currentProfile.deviceType} onClick={() => setCurrentProfile(p => ({...p, deviceType: 'phone' }))}>
                        <PhoneIcon className="w-5 h-5" />
                        {t('setup.device.phone')}
                    </ChoiceButton>
                </div>
              </div>
               <div>
                <label className="font-semibold text-text-muted text-sm">{t('setup.details.gender')}</label>
                 <div className="mt-2 flex gap-3">
                    <ChoiceButton value={genders[0]} selectedValue={currentProfile.gender} onClick={() => setCurrentProfile(p => ({...p, gender: genders[0] as Gender}))}>{genders[0]}</ChoiceButton>
                    <ChoiceButton value={genders[1]} selectedValue={currentProfile.gender} onClick={() => setCurrentProfile(p => ({...p, gender: genders[1] as Gender}))}>{genders[1]}</ChoiceButton>
                    <ChoiceButton value={genders[2]} selectedValue={currentProfile.gender} onClick={() => setCurrentProfile(p => ({...p, gender: genders[2] as Gender}))}>{genders[2]}</ChoiceButton>
                </div>
              </div>
               <div>
                <label htmlFor="dob" className="font-semibold text-text-muted text-sm">{t('setup.details.dob')}</label>
                <input
                  id="dob" type="text" value={currentProfile.dob} onChange={handleDobChange}
                  placeholder={currentSettings.language === 'vi' ? 'DD/MM/YYYY' : 'DD/MM/YYYY'}
                  maxLength={10}
                  className="w-full mt-1 px-4 py-2 bg-background border border-border-color text-text-main rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                />
              </div>
               <div>
                <label className="font-semibold text-text-muted text-sm">{t('setup.details.salutation')}</label>
                 <div className="mt-2 flex gap-3">
                    <ChoiceButton value={salutations[0]} selectedValue={currentProfile.salutation} onClick={() => setCurrentProfile(p => ({...p, salutation: salutations[0] as Salutation}))}>{salutations[0]}</ChoiceButton>
                    <ChoiceButton value={salutations[1]} selectedValue={currentProfile.salutation} onClick={() => setCurrentProfile(p => ({...p, salutation: salutations[1] as Salutation}))}>{salutations[1]}</ChoiceButton>
                    <ChoiceButton value={salutations[2]} selectedValue={currentProfile.salutation} onClick={() => setCurrentProfile(p => ({...p, salutation: salutations[2] as Salutation}))}>{salutations[2]}</ChoiceButton>
                </div>
              </div>
            </div>
          </section>

          <section className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.appearance')}</h3>
            <div className="mt-4 flex items-center justify-between bg-background/50 p-3 rounded-lg">
                <label className="font-semibold text-text-main">{t('theme.theme')}</label>
                <ThemeSwitcher setTheme={(theme: Theme) => setCurrentSettings(s => ({ ...s, theme }))} t={t} />
            </div>
             <div className="mt-4 flex items-center justify-between bg-background/50 p-3 rounded-lg">
                <label className="font-semibold text-text-main">{t('settings.language')}</label>
                <div className="flex items-center gap-1"> 
                    
                    {/* Nút Vietnam (Sử dụng <img>) */}
                    <button 
                        onClick={() => handleLanguageChange('vi')} 
                        className={`p-1 rounded-md transition-all duration-200 ${
                            currentSettings.language === 'vi' 
                            ? 'bg-brand-green/30 ring-2 ring-brand-green ring-offset-2 ring-offset-card' 
                            : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                        }`}
                    >
                        <img src={VietnamFlag} alt="Vietnam Flag" className="w-8 h-6 rounded-sm shadow-sm" />
                    </button>
                    
                    {/* Nút UK (Sử dụng <img>) */}
                    <button 
                        onClick={() => handleLanguageChange('en')} 
                        className={`p-1 rounded-md transition-all duration-200 ${
                            currentSettings.language === 'en' 
                            ? 'bg-brand-green/30 ring-2 ring-brand-green ring-offset-2 ring-offset-card' 
                            : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                        }`}
                    >
                        <img src={UKFlag} alt="UK Flag" className="w-8 h-6 rounded-sm shadow-sm" />
                    </button>
                </div>
            </div>
          </section>

          <section className="animate-slide-in-up" style={{ animationDelay: '150ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.notifications.title')}</h3>
            <div className="mt-4 bg-background/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="reminder-toggle" className="font-semibold text-text-main cursor-pointer">{t('settings.notifications.enable')}</label>
                  <p className="text-sm text-text-muted mt-1">{t('settings.notifications.description')}</p>
                </div>
                <button
                  id="reminder-toggle" role="switch" aria-checked={currentSettings.enableReminder}
                  onClick={handleReminderToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${currentSettings.enableReminder ? 'bg-brand-green' : 'bg-text-muted/40'}`}
                >
                  <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentSettings.enableReminder ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {currentSettings.enableReminder && (
                <div className="animate-fade-in pt-4 border-t border-border-color/50">
                  <label htmlFor="reminder-time" className="font-semibold text-text-main">{t('settings.notifications.time')}</label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={currentSettings.reminderTime}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, reminderTime: e.target.value }))}
                    className="w-full mt-1 px-4 py-2 bg-card border border-border-color text-text-main rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.camera.title')}</h3>
            <div className="mt-4 bg-background/50 p-4 rounded-lg space-y-4">
              <div>
                <label htmlFor="scanInterval" className="font-semibold text-text-main">
                    {t('settings.camera.scanInterval')}: <span className="text-brand-green-dark font-bold">{t('settings.camera.seconds', { count: (currentSettings.autoScanInterval / 1000).toFixed(1) })}</span>
                </label>
                <input
                    id="scanInterval" type="range" min="1000" max="5000" step="500"
                    value={currentSettings.autoScanInterval}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, autoScanInterval: Number(e.target.value) }))}
                    className="w-full mt-2 h-2 bg-border-color rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border-color/50">
                <div>
                  <label htmlFor="sound-toggle" className="font-semibold text-text-main cursor-pointer">{t('settings.camera.soundEffects')}</label>
                  <p className="text-sm text-text-muted mt-1">{t('settings.camera.soundEffectsDescription')}</p>
                </div>
                <button
                    id="sound-toggle" role="switch" aria-checked={currentSettings.soundEffects}
                    onClick={() => setCurrentSettings(s => ({ ...s, soundEffects: !s.soundEffects }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${currentSettings.soundEffects ? 'bg-brand-green' : 'bg-text-muted/40'}`}
                >
                    <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentSettings.soundEffects ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

          <section className="animate-slide-in-up" style={{ animationDelay: '250ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.expertMode.title')}</h3>
            <div className="mt-4 bg-background/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="expert-mode-toggle" className="font-semibold text-text-main cursor-pointer">{t('settings.expertMode.enable')}</label>
                        <p className="text-sm text-text-muted mt-1">{t('settings.expertMode.description')}</p>
                    </div>
                    <button
                        id="expert-mode-toggle" role="switch" aria-checked={currentSettings.expertMode}
                        onClick={() => setCurrentSettings(s => ({ ...s, expertMode: !s.expertMode }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${currentSettings.expertMode ? 'bg-brand-green' : 'bg-text-muted/40'}`}
                    >
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentSettings.expertMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>
          </section>

          <section className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold text-brand-green-dark font-display">{t('settings.data.title')}</h3>
            <div className="mt-4 bg-background/50 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="font-semibold text-text-main">{t('settings.data.reset')}</p>
                    <p className="text-sm text-text-muted">{t('settings.data.resetDescription')}</p>
                </div>
                <button
                    onClick={() => { if(window.confirm(t('settings.data.confirmReset'))) onResetApp(); }}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                    {t('settings.data.resetButton')}
                </button>
            </div>
          </section>
        </div>

        <footer className="p-4 border-t border-border-color/50 flex-shrink-0 bg-background/50 flex justify-end gap-4">
            <button
                onClick={handleClose}
                className="px-6 py-2 bg-card text-text-main font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
            >
                {t('common.cancel')}
            </button>
             <button
                onClick={handleSave}
                className="px-6 py-2 bg-brand-green text-white font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
            >
                {t('common.save')}
            </button>
        </footer>
      </div>
    </div>
  );
};