import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { WarningIcon } from './icons/WarningIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { BroomIcon } from './icons/BroomIcon';

interface SearchComponentProps {
  onSearch: (query: string) => void;
  expertMode: boolean;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SEARCH_TIME_LIMIT = 15; // 15 seconds

export const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, expertMode, t }) => {
  const [query, setQuery] = useState('');
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState(SEARCH_TIME_LIMIT);
  const timerRef = useRef<number | null>(null);

  const commonWasteItems = t('search.suggestions').split(', ');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Timer logic for expert mode
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(SEARCH_TIME_LIMIT);
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setIsSuggestionsVisible(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (expertMode && value.length === 1 && !timerRef.current) {
      startTimer();
    }

    if (value.trim().length > 0) {
      const filteredSuggestions = commonWasteItems.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setActiveSuggestions(filteredSuggestions);
      setIsSuggestionsVisible(true);
    } else {
      setActiveSuggestions([]);
      setIsSuggestionsVisible(false);
      if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setTimeLeft(SEARCH_TIME_LIMIT);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsSuggestionsVisible(false);
    onSearch(suggestion);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const handleRemoveSuggestion = (suggestionToRemove: string) => {
    setActiveSuggestions(prev => prev.filter(s => s !== suggestionToRemove));
  };

  const handleClearAll = () => {
    setQuery('');
    setActiveSuggestions([]);
    setIsSuggestionsVisible(false);
    inputRef.current?.focus();
  };

  const isTimerActive = expertMode && timerRef.current != null;

  return (
    <div className="w-full max-w-lg text-center p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gradient font-display">{t('search.title')}</h2>
      <p className="mt-2 text-text-muted">{t('search.subtitle')}</p>
      
      {expertMode && (
         <div className="mt-4 p-3 bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-neumorphic flex items-start gap-3 text-sm animate-fade-in text-left">
             <div className="p-2 bg-card rounded-full shadow-neumorphic-inset flex-shrink-0 mt-1">
                <WarningIcon className="w-5 h-5 text-yellow-500 animate-glow-yellow" />
            </div>
            <div>
                <p className="font-bold text-text-main">{t('search.expertNote.title')}</p>
                <p className="text-text-muted mt-1 text-xs">{t('search.expertNote.description')}</p>
            </div>
         </div>
      )}

      <div ref={wrapperRef} className="mt-8 relative">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { if(query) setIsSuggestionsVisible(true) }}
              placeholder={t('search.placeholder')}
              className={`w-full pl-11 pr-4 py-3 bg-card border border-border-color text-text-main rounded-full focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-shadow ${isTimerActive ? 'pr-12' : ''}`}
              aria-label={t('search.ariaLabel')}
              autoComplete="off"
            />
            {isTimerActive && (
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-red-500' : 'text-text-muted'}`}>
                <ClockIcon className="w-4 h-4" />
                {timeLeft}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="flex-shrink-0 p-3 bg-background text-brand-green-dark font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 disabled:bg-text-muted/20 disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed hover:enabled:-translate-y-1"
            disabled={!query.trim()}
            aria-label={t('search.searchButton')}
          >
            <SearchIcon className="w-6 h-6" />
          </button>
        </form>
        {isTimerActive && timeLeft === 0 && (
            <p className="text-red-500 font-semibold mt-2 text-sm">{t('search.timeUp')}</p>
        )}
        {isSuggestionsVisible && activeSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border-color rounded-xl shadow-2xl z-10 max-h-60 overflow-y-auto animate-slide-in-down" style={{ animationDuration: '200ms' }}>
            <ul className="text-left divide-y divide-border-color/50 p-1">
              {activeSuggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-background rounded-lg transition-all duration-200 text-text-main group animate-slide-in-left"
                   style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                >
                  <span onClick={() => handleSuggestionClick(suggestion)} className="flex-grow">{suggestion}</span>
                  <button onClick={() => handleRemoveSuggestion(suggestion)} className="p-1 rounded-full text-text-muted hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`${t('search.clear')} ${suggestion}`}>
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
             {query.trim() && (
                 <div className="p-2 border-t border-border-color/50">
                    <button
                        onClick={handleClearAll}
                        className="w-full flex items-center justify-center gap-2 text-sm text-text-muted font-semibold p-2 rounded-lg hover:bg-background transition-colors"
                    >
                        <BroomIcon className="w-4 h-4"/>
                        {t('search.clearAll')}
                    </button>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};