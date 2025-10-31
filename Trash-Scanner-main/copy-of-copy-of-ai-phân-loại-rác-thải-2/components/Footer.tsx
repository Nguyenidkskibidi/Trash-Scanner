import React from 'react';

interface FooterProps {
  t: (key: string) => string;
}
export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full text-center py-4 mt-auto">
      <p className="text-xs text-text-muted">
        {t('footer.copyright')} | <a href="https://khoi-nguyen-space.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-main">{t('footer.contact')}</a>
      </p>
    </footer>
  );
};