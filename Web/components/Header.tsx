import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SettingsIcon } from './icons/SettingsIcon';
import type { Theme } from '../types';

interface HeaderProps {
  setTheme: (theme: Theme) => void;
  onOpenSettings: () => void;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({ setTheme, onOpenSettings, t }) => {
  return (
    <header className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-text-main tracking-tight transition-transform duration-300 ease-in-out hover:scale-105">
          <span>{t('header.title1')}{' '}</span>
          <span className="text-brand-green">{t('header.title2')}</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-text-muted max-w-md">
          {t('header.subtitle')}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <ThemeSwitcher setTheme={setTheme} t={t} />
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-text-main/10 transition-colors group"
          aria-label={t('header.openSettings')}
        >
          <SettingsIcon className="w-6 h-6 text-text-muted transition-transform group-hover:rotate-45" />
        </button>
      </div>
    </header>
  );
};