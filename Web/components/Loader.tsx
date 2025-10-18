import React, { useState, useEffect } from 'react';

interface LoaderProps {
  message: string;
  subMessage?: string;
  t: (key: string) => string;
}

export const Loader: React.FC<LoaderProps> = ({ message, subMessage, t }) => {
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    const tips = [
      t('tips.tip1'), t('tips.tip2'), t('tips.tip3'), t('tips.tip4'),
      t('tips.tip5'), t('tips.tip6'), t('tips.tip7'), t('tips.tip8'),
      t('tips.tip9'), t('tips.tip10'), t('tips.tip11')
    ];
    
    setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);

    const tipInterval = setInterval(() => {
      setCurrentTip(prevTip => {
        let newTip = prevTip;
        while (newTip === prevTip) {
          newTip = tips[Math.floor(Math.random() * tips.length)];
        }
        return newTip;
      });
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [t]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex items-center justify-center space-x-2 h-16">
        <div className="w-3 h-8 bg-brand-green-light rounded-full animate-pulse-bar [animation-delay:-0.3s]"></div>
        <div className="w-3 h-10 bg-brand-green rounded-full animate-pulse-bar [animation-delay:-0.15s]"></div>
        <div className="w-3 h-8 bg-brand-green-light rounded-full animate-pulse-bar"></div>
      </div>
      <p className="mt-8 text-lg font-semibold text-text-main tracking-wide">{message}</p>
      <div className="mt-2 h-5 text-sm text-text-muted">
        {subMessage && <p key={subMessage} className="animate-fade-in">{subMessage}</p>}
      </div>
      <div className="mt-4 h-10 flex items-center">
         {currentTip && (
            <p key={currentTip} className="text-sm text-text-muted animate-fade-in">
                <strong>{t('loader.tip')}:</strong> {currentTip}
            </p>
         )}
      </div>
    </div>
  );
};