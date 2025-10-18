import React, { useState, useCallback, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import type { QuizQuestion, Language } from '../types';
import { Loader } from './Loader';
import { GameIcon } from './icons/GameIcon';
import { WarningIcon } from './icons/WarningIcon';

type GameState = 'idle' | 'loading' | 'playing' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings: Record<Difficulty, { time: number; questions: number; }> = {
    easy: { time: 10 * 60, questions: 10 },
    medium: { time: 15 * 60, questions: 15 },
    hard: { time: 15 * 60, questions: 20 },
};

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5" /></svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const StartScreen: React.FC<{
    onStart: () => void;
    expertMode: boolean;
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    t: (key: string, options?: { [key: string]: string | number }) => string;
}> = ({ onStart, expertMode, difficulty, setDifficulty, t }) => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

    return (
        <div className="text-center w-full max-w-lg animate-fade-in">
            <div className="p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-neumorphic-inset inline-block">
              <GameIcon className="w-16 h-16 mx-auto text-brand-green animate-glow" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gradient font-display">{t('game.title')}</h2>

            {expertMode && (
                 <div className="mt-4 p-4 bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-neumorphic flex items-center gap-4 text-left animate-fade-in">
                    <div className="p-3 bg-card rounded-full shadow-neumorphic-inset flex-shrink-0">
                        <WarningIcon className="w-8 h-8 text-yellow-500 animate-glow-yellow" />
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-text-main">{t('game.expertWarning.title')}</p>
                        <p className="text-text-muted">{t('game.expertWarning.desc')}</p>
                    </div>
                </div>
            )}

            <div className="mt-4 text-left bg-background p-6 rounded-lg border border-border-color space-y-3 text-text-main">
                <h3 className="font-bold text-lg text-brand-green-dark text-center font-display">{t('game.howToPlay')}</h3>
                <p><strong>1. {t('game.rule1Title')}:</strong> {t('game.rule1Desc', { timeLimit: difficultySettings[difficulty].time / 60 })}</p>
                <p><strong>2. {t('game.rule2Title')}:</strong> {t('game.rule2Desc')}</p>
                <p><strong>3. {t('game.rule3Title')}:</strong> {t('game.rule3Desc')}</p>
            </div>

            <div className="mt-6">
                <h3 className="font-bold text-lg text-brand-green-dark font-display">{t('game.difficulty.title')}</h3>
                <div className="flex justify-center gap-3 mt-3">
                    {difficulties.map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 transform ${difficulty === d ? 'bg-brand-green text-white shadow-md' : 'bg-card text-text-main hover:bg-background hover:scale-105'}`}
                        >
                            {t(`game.difficulty.${d}`)}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-text-muted mt-2 h-10 flex items-center justify-center">
                    {t(`game.difficulty.${difficulty}Desc`)}
                </p>
            </div>

            <button
                onClick={onStart}
                className="mt-4 px-8 py-4 bg-background text-brand-green-dark font-extrabold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 transform hover:scale-105 hover:-translate-y-1"
            >
                {t('game.start')}
            </button>
        </div>
    );
};


export const GameComponent: React.FC<{ userName: string, expertMode: boolean, t: (key: string, options?: { [key: string]: string | number }) => string; language: Language; }> = ({ userName, expertMode, t, language }) => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>(expertMode ? 'hard' : 'medium');
    const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].time);
    const [isTransitioningQuestion, setIsTransitioningQuestion] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {
        let interval: number;
        if (gameState === 'loading') {
            setLoadingStep(0); // Reset on start
            interval = window.setInterval(() => {
                setLoadingStep(prev => (prev + 1) % 4); // 4 steps
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [gameState]);
    
    useEffect(() => {
        setTimeLeft(difficultySettings[difficulty].time);
    }, [difficulty]);

    useEffect(() => {
        if (gameState === 'playing') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleStartGame = useCallback(async () => {
        setGameState('loading');
        setError(null);
        try {
            const fetchedQuestions = await generateQuizQuestions(difficulty, language);
            setQuestions(fetchedQuestions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimeLeft(difficultySettings[difficulty].time);
            setGameState('playing');
        } catch (err) {
            console.error("Failed to generate quiz:", err);
            setError(t('error.quiz'));
            setGameState('idle');
        }
    }, [difficulty, language, t]);

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedAnswer(answer);
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setIsTransitioningQuestion(true);
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                setGameState('finished');
            }
            setIsTransitioningQuestion(false);
        }, 300);
    };

    const handleRestart = () => {
        setGameState('idle');
        setError(null);
        setTimeLeft(difficultySettings[difficulty].time);
    }
    
    const renderFinishedScreen = () => {
        const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
        let scoreMessage = t('game.result.feedback1');
        let scoreColor = "text-yellow-500";
        if (percentage >= 50) {
            scoreMessage = t('game.result.feedback2');
            scoreColor = "text-blue-500";
        }
        if (percentage >= 80) {
            scoreMessage = t('game.result.feedback3');
            scoreColor = "text-brand-green";
        }

        const isTimeUp = timeLeft === 0 && currentQuestionIndex < questions.length - 1;

        return (
            <div className="text-center animate-fade-in w-full max-w-md">
                <div className="bg-background p-8 rounded-xl shadow-neumorphic">
                    {isTimeUp ? (
                         <ClockIcon className="w-20 h-20 mx-auto text-red-500 animate-pop-in" />
                    ) : (
                         <TrophyIcon className={`w-20 h-20 mx-auto ${scoreColor} animate-pop-in`} />
                    )}
                    <h2 className="mt-4 text-3xl font-bold text-text-main font-display animate-slide-in-up" style={{ animationDelay: '100ms' }}>{isTimeUp ? t('game.result.timeUp') : t('game.result.completed')}</h2>
                    <p className="mt-2 text-lg text-text-muted animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                        {t('game.result.thanks', { name: userName })}
                    </p>
                    <p className={`mt-4 text-xl font-semibold ${isTimeUp ? 'text-red-600' : scoreColor} animate-slide-in-up`} style={{ animationDelay: '300ms' }}>
                        {isTimeUp ? t('game.result.timeUpMessage') : scoreMessage}
                    </p>
                    <p className="my-2 text-6xl font-extrabold text-text-main animate-pop-in" style={{ animationDelay: '400ms' }}>
                        {score} <span className="text-3xl text-text-muted">/ {questions.length}</span>
                    </p>
                </div>
                <button
                    onClick={handleRestart}
                    className="mt-8 px-10 py-4 bg-background text-brand-green-dark font-extrabold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 transform hover:scale-105 hover:-translate-y-1"
                >
                    {t('game.playAgain')}
                </button>
            </div>
        );
    };

    const renderQuestion = () => {
        const question = questions[currentQuestionIndex];
        if (!question) return null;
        
        const isLowTime = timeLeft <= 30;

        return (
            <div key={currentQuestionIndex} className={`w-full max-w-3xl ${isTransitioningQuestion ? 'animate-slide-out-up' : 'animate-slide-in-down'}`}>
                 <div className="w-full bg-text-main/10 rounded-full h-2.5 mb-2">
                    <div
                        className="bg-brand-green h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm font-semibold">
                    <p className="text-text-muted">{t('game.question')} {currentQuestionIndex + 1} / {questions.length}</p>
                    <div className={`flex items-center gap-1.5 p-1 px-2 rounded-full ${isLowTime ? 'bg-red-100 text-red-600 animate-time-pulse' : 'bg-text-main/10 text-text-main'}`}>
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <div className="text-lg font-bold text-brand-green-dark flex items-center">
                        <span>{t('game.score')}: </span>
                        <span key={score} className="inline-block animate-pop-in ml-2">{score}</span>
                    </div>
                </div>
                
                <div className="bg-background p-6 rounded-lg shadow-neumorphic-inset min-h-[350px] flex flex-col justify-center">
                    {question.imageUrl && (
                        <div className="mb-4">
                            <img src={question.imageUrl} alt={question.itemName} className="w-full max-h-48 object-contain rounded-md" />
                        </div>
                    )}
                    <h3 className={`text-xl font-bold text-text-main text-center ${question.imageUrl ? 'mt-2' : 'mb-4'}`}>
                        {question.questionText}
                    </h3>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => {
                        const isCorrect = option === question.correctAnswer;
                        const isSelected = option === selectedAnswer;
                        
                        const baseClasses = "w-full text-left p-4 rounded-lg border-2 font-semibold transition-all duration-300 flex justify-between items-center";
                        let stateClasses = '';

                        if (!isAnswered) {
                            stateClasses = 'bg-card border-border-color text-text-main transform hover:-translate-y-1 hover:border-brand-green-dark hover:bg-brand-green/10';
                        } else {
                            if (isCorrect) {
                                stateClasses = 'bg-brand-green border-brand-green-dark text-white shadow-lg z-10 animate-pop';
                            } else if (isSelected && !isCorrect) {
                                stateClasses = 'bg-red-500 border-red-700 text-white animate-shake-horizontal';
                            } else {
                                stateClasses = 'bg-text-main/5 border-transparent text-text-muted opacity-50';
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={isAnswered}
                                className={`${baseClasses} ${stateClasses}`}
                            >
                                <span>{option}</span>
                                {isAnswered && (
                                    (isCorrect) ? <CheckIcon className="w-5 h-5 text-white" /> : (isSelected && <XIcon className="w-5 h-5 text-white" />)
                                )}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-4 p-4 bg-background rounded-lg text-center animate-fade-in">
                        <p className={`font-bold text-lg ${selectedAnswer === question.correctAnswer ? 'text-brand-green-dark' : 'text-red-600'}`}>
                            {selectedAnswer === question.correctAnswer ? t('game.correct') : t('game.incorrect')}
                        </p>
                        <p className="text-sm text-text-muted mt-1">{question.explanation}</p>
                        <button
                            onClick={handleNextQuestion}
                            className="mt-6 px-8 py-3 bg-card text-brand-green-dark font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 hover:-translate-y-1"
                        >
                            {currentQuestionIndex < questions.length - 1 ? t('game.nextQuestion') : t('game.seeResults')}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button onClick={handleStartGame} className="mt-4 px-4 py-2 bg-background rounded-lg">{t('common.retry')}</button>
                </div>
            );
        }
        switch (gameState) {
            case 'playing':
                return renderQuestion();
            case 'finished':
                return renderFinishedScreen();
            case 'loading': {
                 const loadingMessages = [
                    t('loader.quiz.step1'),
                    t('loader.quiz.step2'),
                    t('loader.quiz.step3'),
                    t('loader.quiz.step4'),
                ];
                return <Loader 
                    message={t('loader.generatingQuiz')}
                    subMessage={loadingMessages[loadingStep]}
                    t={t}
                />;
            }
            case 'idle':
            default:
                return <StartScreen
                    onStart={handleStartGame}
                    expertMode={expertMode}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    t={t}
                />;
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-[550px]">
            {renderContent()}
        </div>
    );
};