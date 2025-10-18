import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { WebcamCapture } from './components/WebcamCapture';
import { SearchComponent } from './components/SearchComponent';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { GameComponent } from './components/GameComponent';
import { Footer } from './components/Footer';
import { ChatComponent } from './components/ChatComponent';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { searchWasteInfo, analyzeImage, continueChat } from './services/geminiService';
import type { WasteInfo, ChatMessage, UserProfile, AppSettings, Language, Feedback } from './types';
import { CameraIcon } from './components/icons/CameraIcon';
import { SearchIcon } from './components/icons/SearchIcon';
import { GameIcon } from './components/icons/GameIcon';
import { SetupScreen } from './components/SetupScreen';
import { useTranslation } from './hooks/useTranslation';


type ViewMode = 'camera' | 'search' | 'game';

const defaultProfile: UserProfile = {
  name: '',
  deviceType: null,
  gender: null,
  dob: '',
  salutation: null,
  setupComplete: false,
};

const defaultSettings: AppSettings = {
  theme: 'default',
  language: 'vi',
  autoScanInterval: 2000,
  expertMode: false,
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<WasteInfo[] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('camera');
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [itemToReport, setItemToReport] = useState<WasteInfo | null>(null);

  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [chattingWithItem, setChattingWithItem] = useState<WasteInfo | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const t = useTranslation(appSettings.language);

  useEffect(() => {
    try {
        const savedProfile = localStorage.getItem('user-profile');
        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        }
        const savedSettings = localStorage.getItem('app-settings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
             if (['default', 'ocean', 'sunset', 'dark'].includes(parsedSettings.theme)) {
                setAppSettings(parsedSettings);
             }
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appSettings.theme);
    document.documentElement.classList.toggle('dark', appSettings.theme === 'dark');
    document.documentElement.lang = appSettings.language;
    localStorage.setItem('app-settings', JSON.stringify(appSettings));
  }, [appSettings]);

  const handleSetupComplete = (profile: UserProfile, language: Language) => {
    const finalProfile = { ...profile, setupComplete: true };
    setUserProfile(finalProfile);
    localStorage.setItem('user-profile', JSON.stringify(finalProfile));
    setAppSettings(s => ({...s, language}));
  };

  const handleSaveSettings = (newProfile: UserProfile, newSettings: AppSettings) => {
    setUserProfile(newProfile);
    localStorage.setItem('user-profile', JSON.stringify(newProfile));
    setAppSettings(newSettings);
    setIsSettingsOpen(false);
  }

  const handleResetApp = () => {
    localStorage.clear();
    window.location.reload();
  }

  const handleCapture = useCallback(async (imageBase64: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingMessage(t('loader.analyzing'));
    setError(null);
    setAnalysisResult(null);
    setCapturedImage(`data:image/jpeg;base64,${imageBase64}`);

    try {
      const result = await analyzeImage(imageBase64, appSettings.expertMode, appSettings.language);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(t('error.analysis'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, appSettings.expertMode, appSettings.language, t]);

  const handleSearch = useCallback(async (query: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingMessage(t('loader.searching'));
    setError(null);
    setAnalysisResult(null);
    setCapturedImage(null);

    try {
      const result = await searchWasteInfo(query, appSettings.expertMode, appSettings.language);
      if (result.length === 0) {
        setAnalysisResult([]);
      } else {
        setAnalysisResult(result);
        setCapturedImage(result[0].imageUrl || null);
      }
    } catch (err) {
      console.error(err);
      setError(t('error.search'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, appSettings.expertMode, appSettings.language, t]);

  const handleReset = () => {
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setCapturedImage(null);
  };

  const viewOrder: ViewMode[] = ['camera', 'search', 'game'];

  const handleViewChange = (newMode: ViewMode) => {
    if (viewMode === newMode) return;
  
    const oldIndex = viewOrder.indexOf(viewMode);
    const newIndex = viewOrder.indexOf(newMode);
    const direction = newIndex > oldIndex ? 'left' : 'right';
  
    setAnimationClass(direction === 'left' ? 'animate-slide-out-left' : 'animate-slide-out-right');
  
    setTimeout(() => {
      handleReset();
      setViewMode(newMode);
      setAnimationClass(direction === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left');
    }, 400);
  };

  const handleOpenChat = (item: WasteInfo) => {
    setChattingWithItem(item);
    setChatMessages([
      { role: 'model', text: t('chat.greeting', { item: item.wasteType }) }
    ]);
    setIsChatVisible(true);
  };

  const handleCloseChat = () => {
    setIsChatVisible(false);
    setTimeout(() => {
      setChattingWithItem(null);
      setChatMessages([]);
    }, 300);
  };

  const handleSendChatMessage = async (message: string) => {
    if (!chattingWithItem || isChatLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const aiResponseText = await continueChat(newMessages, chattingWithItem.wasteType, appSettings.language);
      const aiMessage: ChatMessage = { role: 'model', text: aiResponseText };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMessage: ChatMessage = { role: 'model', text: t('chat.error') };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOpenFeedbackModal = (item: WasteInfo) => {
    setItemToReport(item);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setItemToReport(null);
  };

  const handleSubmitFeedback = (feedbackData: Omit<Feedback, 'timestamp' | 'reportedItem'>) => {
    if (!itemToReport) return;

    const newFeedback: Feedback = {
        ...feedbackData,
        timestamp: new Date().toISOString(),
        reportedItem: itemToReport,
    };

    try {
        const existingFeedbackStr = localStorage.getItem('user-feedback');
        const existingFeedback: Feedback[] = existingFeedbackStr ? JSON.parse(existingFeedbackStr) : [];
        existingFeedback.push(newFeedback);
        localStorage.setItem('user-feedback', JSON.stringify(existingFeedback));
        alert(t('feedback.success'));
    } catch (e) {
        console.error("Failed to save feedback to localStorage", e);
    }

    handleCloseFeedbackModal();
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message={loadingMessage} t={t} />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">{t('error.title')}</p>
          <p>{error}</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      );
    }
    if (analysisResult && capturedImage) {
      return (
        <ResultDisplay
          result={analysisResult}
          imageUrl={capturedImage}
          onReset={handleReset}
          onStartChat={handleOpenChat}
          onReportIncorrect={handleOpenFeedbackModal}
          t={t}
        />
      );
    }
    if (analysisResult && analysisResult.length === 0) {
       return (
        <ResultDisplay
          result={[]}
          imageUrl=""
          onReset={handleReset}
          onStartChat={handleOpenChat}
          onReportIncorrect={handleOpenFeedbackModal}
          t={t}
        />
      );
    }

    switch (viewMode) {
      case 'search':
        return <SearchComponent onSearch={handleSearch} expertMode={appSettings.expertMode} t={t} />;
      case 'game':
        return <GameComponent userName={userProfile.name} expertMode={appSettings.expertMode} t={t} language={appSettings.language} />;
      case 'camera':
      default:
        return (
          <WebcamCapture
            onCapture={handleCapture}
            isAutoMode={isAutoMode}
            setIsAutoMode={setIsAutoMode}
            isAnalyzing={isLoading}
            error={error}
            deviceType={userProfile.deviceType!}
            autoScanInterval={appSettings.autoScanInterval}
            t={t}
          />
        );
    }
  };

  const ViewSwitcher = () => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const containerRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLButtonElement>(null);
    const gameRef = useRef<HTMLButtonElement>(null);

    const buttonRefs = { camera: cameraRef, search: searchRef, game: gameRef };

    useEffect(() => {
        const activeButton = buttonRefs[viewMode]?.current;
        if (activeButton && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();
            setIndicatorStyle({
                width: `${buttonRect.width}px`,
                transform: `translateX(${buttonRect.left - containerRect.left}px)`,
            });
        }
    }, [viewMode]);

    return (
        <div className="flex justify-center mb-6">
            <div ref={containerRef} className="relative flex p-1 bg-text-main/10 backdrop-blur-sm rounded-full border border-white/10">
                <div
                    className="absolute top-1 h-[calc(100%-8px)] my-auto bg-card rounded-full shadow-md transition-all duration-300 ease-in-out"
                    style={{ ...indicatorStyle, top: '4px' }}
                />
                <button
                    ref={cameraRef}
                    onClick={() => handleViewChange('camera')}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 group ${viewMode === 'camera' ? 'text-brand-green-dark' : 'text-text-main hover:text-brand-green-dark'}`}
                    aria-pressed={viewMode === 'camera'}
                >
                    <CameraIcon className="w-5 h-5" isActive={viewMode === 'camera'} />
                    {t('nav.camera')}
                </button>
                <button
                    ref={searchRef}
                    onClick={() => handleViewChange('search')}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 group ${viewMode === 'search' ? 'text-brand-green-dark' : 'text-text-main hover:text-brand-green-dark'}`}
                    aria-pressed={viewMode === 'search'}
                >
                    <SearchIcon className="w-5 h-5" isActive={viewMode === 'search'} />
                    {t('nav.search')}
                </button>
                <button
                    ref={gameRef}
                    onClick={() => handleViewChange('game')}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 group ${viewMode === 'game' ? 'text-brand-green-dark' : 'text-text-main hover:text-brand-green-dark'}`}
                    aria-pressed={viewMode === 'game'}
                >
                    <GameIcon className="w-5 h-5" isActive={viewMode === 'game'} />
                    {t('nav.game')}
                </button>
            </div>
        </div>
    );
};

  if (!userProfile.setupComplete) {
    return <SetupScreen onSetupComplete={handleSetupComplete} initialLang={appSettings.language} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-0 left-0 w-full h-full animated-bg z-0"></div>
      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col flex-grow">
        <Header 
          setTheme={(theme) => setAppSettings(s => ({...s, theme}))}
          onOpenSettings={() => setIsSettingsOpen(true)}
          t={t}
        />
        <main className="mt-8">
          <ViewSwitcher />
          <div className={`bg-card/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[550px] overflow-hidden ${animationClass}`}>
            {renderContent()}
          </div>
        </main>
        <Footer t={t} />
      </div>
      <ChatComponent
        isOpen={isChatVisible}
        onClose={handleCloseChat}
        item={chattingWithItem}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        isSending={isChatLoading}
        t={t}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={userProfile}
        settings={appSettings}
        onSave={handleSaveSettings}
        onResetApp={handleResetApp}
        t={t}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        item={itemToReport}
        onSubmitFeedback={handleSubmitFeedback}
        t={t}
      />
    </div>
  );
};

export default App;