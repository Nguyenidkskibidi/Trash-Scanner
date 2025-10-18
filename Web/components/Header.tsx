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
    <header className="text-center relative">
      <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-text-main/10 transition-colors group"
          aria-label={t('header.openSettings')}
        >
          <SettingsIcon className="w-6 h-6 text-text-muted transition-transform duration-300 group-hover:rotate-45" />
        </button>
        <ThemeSwitcher setTheme={setTheme} t={t} />
      </div>
      <h1
        className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display animate-slide-in-up leading-tight sm:leading-none"
        style={{ animationDelay: '100ms' }}
      >
        <span className="text-gradient">
          {t('header.title1')}
          <br />
          {t('header.title2')}
        </span>
      </h1>
      <p
        className="mt-3 text-lg text-text-muted max-w-2xl mx-auto animate-slide-in-up"
        style={{ animationDelay: '200ms' }}
      >
        {t('header.subtitle')}
      </p>
    </header>
  );
};