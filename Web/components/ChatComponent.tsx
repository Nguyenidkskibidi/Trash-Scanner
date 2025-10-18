import React, { useState, useRef, useEffect } from 'react';
import type { WasteInfo, ChatMessage } from '../types';
import { BackIcon } from './icons/BackIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatComponentProps {
  isOpen: boolean;
  onClose: () => void;
  item: WasteInfo | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start animate-fade-in" style={{ animationDelay: '100ms' }}>
    <div className="bg-card/80 rounded-2xl rounded-bl-none px-4 py-3 max-w-sm">
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse-dot [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse-dot [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse-dot [animation-delay:0.4s]"></div>
      </div>
    </div>
  </div>
);

export const ChatComponent: React.FC<ChatComponentProps> = ({
  isOpen,
  onClose,
  item,
  messages,
  onSendMessage,
  isSending,
  t,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsAnimatingOut(false);
    } else if (isMounted && !isOpen) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  useEffect(() => {
    if(isOpen){
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ animationDuration: '300ms' }}>
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className={`relative w-full max-w-2xl h-[90vh] max-h-[700px] bg-card/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4 ${isAnimatingOut ? 'animate-slide-out-up' : 'animate-slide-in-up'}`}>
        {/* Header */}
        <header className="flex items-center p-4 border-b border-border-color/50 flex-shrink-0">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-text-main/10 transition-colors" aria-label={t('chat.back')}>
            <BackIcon className="w-6 h-6 text-text-main" />
          </button>
          <div className="ml-4 text-center flex-grow">
            <h2 className="text-lg font-bold text-text-main font-display">{t('chat.title', { item: item?.wasteType })}</h2>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`} style={{animationDelay: `${index * 50}ms`}}>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg ${
                    msg.role === 'user'
                      ? 'bg-brand-green text-white rounded-br-none'
                      : 'bg-background text-text-main rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-color/50 flex-shrink-0 bg-background/50">
          <div className="flex items-center gap-2 bg-card rounded-full p-2 shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              className="flex-grow w-full bg-transparent text-text-main px-3 py-1 outline-none"
              disabled={isSending}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              className="flex-shrink-0 p-3 bg-brand-green text-white font-bold rounded-full transition-all duration-150 disabled:bg-text-muted/40 disabled:cursor-not-allowed transform hover:scale-110 active:scale-100"
              aria-label={t('chat.send')}
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};