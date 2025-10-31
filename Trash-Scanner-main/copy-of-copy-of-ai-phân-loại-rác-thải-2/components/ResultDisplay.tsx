import React, { useMemo } from 'react';
import type { WasteInfo, RecyclableStatus } from '../types';
import { RecycleIcon } from './icons/RecycleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { QuestionIcon } from './icons/QuestionIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ComplimentDisplay } from './ComplimentDisplay';
import { RobotIcon } from './icons/RobotIcon';
import { FlagIcon } from './icons/FlagIcon';

interface ResultDisplayProps {
  result: WasteInfo[];
  imageUrl: string;
  onReset: () => void;
  onStartChat: (item: WasteInfo) => void;
  onReportIncorrect: (item: WasteInfo) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const StatusIndicator: React.FC<{ status: RecyclableStatus, t: (key: string) => string; }> = ({ status, t }) => {
  const statusConfig = {
    Yes: {
      Icon: RecycleIcon,
      text: t('result.recyclable'),
      style: "bg-green-100/80 dark:bg-green-500/20 text-green-800 dark:text-green-200 border-green-200/50 dark:border-green-400/30",
      iconColor: "text-green-500 dark:text-green-300",
    },
    No: {
      Icon: TrashIcon,
      text: t('result.notRecyclable'),
      style: "bg-red-100/80 dark:bg-red-500/20 text-red-800 dark:text-red-200 border-red-200/50 dark:border-red-400/30",
      iconColor: "text-red-500 dark:text-red-300",
    },
    Conditional: {
      Icon: QuestionIcon,
      text: t('result.conditional'),
      style: "bg-yellow-100/80 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 border-yellow-200/50 dark:border-yellow-400/30",
      iconColor: "text-yellow-500 dark:text-yellow-300",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.style} backdrop-blur-sm border shadow-lg transition-transform hover:scale-105`}>
      <config.Icon className={`w-5 h-5 ${config.iconColor}`} />
      <span>{config.text}</span>
    </div>
  );
};

const ResultCard: React.FC<{ item: WasteInfo; index: number; onStartChat: (item: WasteInfo) => void; onReportIncorrect: (item: WasteInfo) => void; t: (key: string, options?: { [key: string]: string | number }) => string; }> = ({ item, index, onStartChat, onReportIncorrect, t }) => (
    <div
      className="bg-card/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={t('result.imageAlt', { item: item.wasteType })}
          className="w-full h-40 object-cover rounded-md mb-4 bg-gray-200"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <h2 className="text-2xl font-bold text-brand-green-dark font-display">{item.wasteType}</h2>
      <p className="text-md text-text-muted mt-1 font-medium">{t('result.material')}: {item.material}</p>
      
      <div className="mt-4 space-y-4">
          <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">{t('result.recyclingStatus')}</h3>
              <div className="mt-1">
                  <StatusIndicator status={item.recyclable} t={t} />
              </div>
          </div>
          <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">{t('result.disposalInstructions')}</h3>
              <p className="mt-1 text-base text-text-main">{item.disposalInstructions}</p>
          </div>
          <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">{t('result.funFact')}</h3>
              <p className="mt-1 text-base text-text-main italic">"{item.funFact}"</p>
          </div>
      </div>

      <div className="mt-5 border-t border-border-color/50 pt-4 flex justify-between items-center">
        <button
          onClick={() => onReportIncorrect(item)}
          className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-red-600 font-semibold transition-colors duration-150 text-sm"
          aria-label={t('result.reportIncorrect')}
        >
          <FlagIcon className="w-4 h-4" />
          <span>{t('result.reportIncorrect')}</span>
        </button>
        <button
          onClick={() => onStartChat(item)}
          className="flex items-center gap-2 px-4 py-2 bg-background text-brand-green-dark font-semibold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-0.5 text-sm"
          aria-label={t('result.askAriaLabel', { item: item.wasteType })}
        >
          <RobotIcon className="w-5 h-5" />
          <span>{t('result.askAI')}</span>
        </button>
      </div>
    </div>
  );

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, imageUrl, onReset, onStartChat, onReportIncorrect, t }) => {
  const noResultTitles = useMemo(() => [t('result.notFound.title1'), t('result.notFound.title2'), t('result.notFound.title3'), t('result.notFound.title4')], [t]);
  const noResultSubtitles = useMemo(() => [t('result.notFound.subtitle1'), t('result.notFound.subtitle2'), t('result.notFound.subtitle3'), t('result.notFound.subtitle4')], [t]);

  const randomTitle = useMemo(() => noResultTitles[Math.floor(Math.random() * noResultTitles.length)], [noResultTitles]);
  const randomSubtitle = useMemo(() => noResultSubtitles[Math.floor(Math.random() * noResultSubtitles.length)], [noResultSubtitles]);

  const isHuman = result.length > 0 && result[0].wasteType.toLowerCase() === 'human';

  if (isHuman) {
    return <ComplimentDisplay item={result[0]} imageUrl={imageUrl} onReset={onReset} t={t} />;
  }

  if (result.length === 0) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onReset();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onReset]);

    return (
      <div className="text-center p-8 animate-fade-in flex flex-col items-center">
        <WarningIcon className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-text-main font-display">{randomTitle}</h2>
        <p className="mt-2 text-text-muted">{randomSubtitle}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center sticky top-8">
                <img src={imageUrl} alt={t('result.capturedImageAlt')} className="rounded-lg shadow-xl w-full max-w-md object-contain animate-pop-in" />
                 <button
                    onClick={onReset}
                    className="mt-6 px-8 py-3 bg-background text-brand-green-dark font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1 animate-slide-in-up"
                    style={{ animationDelay: '200ms' }}
                >
                    {t('result.continueScanning')}
                </button>
            </div>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 sm:pr-4">
                {result.map((item, index) => (
                    <ResultCard key={index} item={item} index={index} onStartChat={onStartChat} onReportIncorrect={onReportIncorrect} t={t} />
                ))}
            </div>
        </div>
    </div>
  );
};