import React, { useState, useRef, useEffect } from 'react';
import { PaletteIcon } from './icons/PaletteIcon';
import type { Theme } from '../types';

interface ThemeSwitcherProps {
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const themes: { name: Theme; color: string; label: string }[] = [
  { name: 'default', color: '#10B981', label: 'Default Green' },
  { name: 'ocean', color: '#2563EB', label: 'Ocean Blue' },
  { name: 'sunset', color: '#F97316', label: 'Sunset Orange' },
  { name: 'dark', color: '#1F2937', label: 'Graphite Dark' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ setTheme, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-text-main/10 transition-colors"
        aria-label={t('theme.select')}
        aria-expanded={isOpen}
      >
        <PaletteIcon className="w-6 h-6 text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-card rounded-lg shadow-2xl border border-border-color p-2 z-50 animate-fade-in">
          <p className="text-sm font-semibold text-text-main px-2 py-1">{t('theme.theme')}</p>
          <div className="flex justify-around mt-2">
            {themes.map(theme => (
              <button
                key={theme.name}
                onClick={() => {
                  setTheme(theme.name);
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-full border-2 border-border-color focus:outline-none focus:ring-2 focus:ring-brand-green"
                style={{ backgroundColor: theme.color }}
                aria-label={theme.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};