import React, { useState, useEffect } from 'react';
import type { WasteInfo, Feedback } from '../types';
import { BackIcon } from './icons/BackIcon';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WasteInfo | null;
  onSubmitFeedback: (feedback: Omit<Feedback, 'timestamp' | 'reportedItem'>) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

type FeedbackReason = 'type' | 'material' | 'recyclable' | 'instructions' | 'other';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  item,
  onSubmitFeedback,
  t
}) => {
  const [selectedReasons, setSelectedReasons] = useState<FeedbackReason[]>([]);
  const [comments, setComments] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleReasonToggle = (reason: FeedbackReason) => {
    setSelectedReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };
  
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
        onClose();
        setSelectedReasons([]);
        setComments('');
    }, 300);
  }

  const handleSubmit = () => {
    if (selectedReasons.length === 0 && !comments.trim()) {
      return;
    }
    onSubmitFeedback({
      feedbackType: selectedReasons,
      comments: comments.trim(),
    });
    handleClose();
  };
  
  useEffect(() => {
    if(isOpen) {
        setIsAnimatingOut(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const reasons: { key: FeedbackReason, label: string }[] = [
      { key: 'type', label: t('feedback.options.type') },
      { key: 'material', label: t('feedback.options.material') },
      { key: 'recyclable', label: t('feedback.options.recyclable') },
      { key: 'instructions', label: t('feedback.options.instructions') },
      { key: 'other', label: t('feedback.options.other') },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDuration: '300ms' }}>
      <div onClick={handleClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className={`relative w-full max-w-lg h-auto max-h-[90vh] bg-card/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4 ${isAnimatingOut ? 'animate-pop-out' : 'animate-pop-in'}`}>
        <header className="flex items-center p-4 border-b border-border-color/50 flex-shrink-0">
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-text-main/10 transition-colors" aria-label={t('settings.close')}>
            <BackIcon className="w-6 h-6 text-text-main" />
          </button>
          <div className="ml-4 text-center flex-grow">
            <h2 className="text-lg font-bold text-text-main font-display">{t('feedback.title')}</h2>
          </div>
          <div className="w-10"></div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <p className="font-semibold text-text-muted">{t('feedback.item', { item: item.wasteType })}</p>
            <div>
                <label className="font-bold text-text-main">{t('feedback.whatWasWrong')}</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasons.map(({key, label}) => (
                         <label key={key} className="flex items-center space-x-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-background/80">
                            <input
                                type="checkbox"
                                checked={selectedReasons.includes(key)}
                                onChange={() => handleReasonToggle(key)}
                                className="h-5 w-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                            />
                            <span className="text-text-main font-medium">{label}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div>
                <label htmlFor="comments" className="font-bold text-text-main">{t('feedback.comments')}</label>
                <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t('feedback.commentsPlaceholder')}
                    rows={4}
                    className="w-full mt-2 px-4 py-2 bg-background border border-border-color text-text-main rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                />
            </div>
        </div>

        <footer className="p-4 border-t border-border-color/50 flex-shrink-0 bg-background/50 flex justify-end gap-4">
            <button
                onClick={handleClose}
                className="px-6 py-2 bg-card text-text-main font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
            >
                {t('common.cancel')}
            </button>
             <button
                onClick={handleSubmit}
                disabled={selectedReasons.length === 0 && !comments.trim()}
                className="px-6 py-2 bg-brand-green text-white font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset disabled:bg-text-muted/40 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-1"
            >
                {t('feedback.submit')}
            </button>
        </footer>
      </div>
    </div>
  );
};