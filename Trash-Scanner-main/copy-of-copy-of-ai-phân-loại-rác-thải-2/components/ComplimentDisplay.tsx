import React from 'react';
import type { WasteInfo } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface ComplimentDisplayProps {
  item: WasteInfo;
  imageUrl: string;
  onReset: () => void;
  t: (key: string) => string;
}

export const ComplimentDisplay: React.FC<ComplimentDisplayProps> = ({ item, imageUrl, onReset, t }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center text-center animate-fade-in p-4">
        <SparklesIcon className="w-16 h-16 text-yellow-400" />
        <h2 className="mt-4 text-3xl font-extrabold text-brand-green-dark">{t('compliment.title')}</h2>
        
        <div className="mt-8 flex flex-col lg:flex-row items-center gap-8">
            <img src={imageUrl} alt={t('compliment.imageAlt')} className="rounded-lg shadow-xl w-full max-w-sm object-contain" />
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-r-lg text-left">
                <p className="text-xl italic font-medium">"{item.disposalInstructions}"</p>
                <p className="mt-4 text-base"><strong className="font-semibold">{t('result.funFact')}:</strong> {item.funFact}</p>
            </div>
        </div>
        
        <button
            onClick={onReset}
            className="mt-8 px-8 py-3 bg-background text-brand-green-dark font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150"
        >
            {t('result.continueScanning')}
        </button>
    </div>
  );
};