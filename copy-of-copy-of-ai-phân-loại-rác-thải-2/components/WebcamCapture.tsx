import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { AnimatedFrameIcon } from './icons/AnimatedFrameIcon';
import { Tooltip } from './Tooltip';
import { SwitchCameraIcon } from './icons/SwitchCameraIcon';
import type { DeviceType } from '../types';

interface WebcamCaptureProps {
  onCapture: (imageBase64: string) => void;
  isAutoMode: boolean;
  setIsAutoMode: (value: boolean) => void;
  isAnalyzing: boolean;
  error: string | null;
  deviceType: DeviceType;
  autoScanInterval: number;
  soundEffects: boolean;
  t: (key: string, options?: { [key: string]: any }) => string;
}

const MAX_DIMENSION = 640; // Max width or height for analysis

const playCaptureSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
};

const CameraStatusIndicator: React.FC<{
    isCameraReady: boolean;
    isCameraPaused: boolean;
    isAnalyzing: boolean;
    error: string | null;
    t: (key: string) => string;
}> = ({ isCameraReady, isCameraPaused, isAnalyzing, error, t }) => {
    const getStatus = (): { color: string; text: string; pulse: boolean } => {
        if (error) return { color: 'bg-red-500', text: t('camera.status.error'), pulse: true };
        if (!isCameraReady) return { color: 'bg-yellow-500', text: t('camera.status.initializing'), pulse: true };
        if (isCameraPaused) return { color: 'bg-gray-500', text: t('camera.status.paused'), pulse: false };
        if (isAnalyzing) return { color: 'bg-blue-500', text: t('camera.status.analyzing'), pulse: true };
        return { color: 'bg-green-500', text: t('camera.status.ready'), pulse: true };
    };

    const { color, text, pulse } = getStatus();

    return (
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg z-20">
            <span className={`w-2.5 h-2.5 rounded-full ${color} ${pulse ? 'animate-pulse-dot' : ''}`} />
            <span>{text}</span>
        </div>
    );
};

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, isAutoMode, setIsAutoMode, isAnalyzing, error: appError, deviceType, autoScanInterval, soundEffects, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isCameraPaused, setIsCameraPaused] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const [autoScanMessage, setAutoScanMessage] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isAnalyzing) {
        setAnalysisStep(0);
        interval = window.setInterval(() => {
            setAnalysisStep(prev => (prev + 1) % 3); // Cycle through 3 steps
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const analysisMessages = [
    t('camera.analysis.step1'),
    t('camera.analysis.step2'),
    t('camera.analysis.step3'),
  ];

  const stopCurrentStream = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  };

  useEffect(() => {
    setIsCameraReady(false);
    stopCurrentStream();

    const enableCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: { facingMode: deviceType === 'phone' ? facingMode : 'user' },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
            setStreamError(null);
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        if (facingMode === 'environment' && deviceType === 'phone') {
            setFacingMode('user');
        } else {
            setStreamError(t('camera.error.access'));
        }
      }
    };

    enableCamera();

    return () => {
      stopCurrentStream();
    };
  }, [facingMode, deviceType, t]);

  useEffect(() => {
    if (videoRef.current && isCameraReady) {
      if (isCameraPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
      }
    }
  }, [isCameraPaused, isCameraReady]);

  useEffect(() => {
    if (isAutoMode) {
      const autoScanMessages = [t('camera.scanMsg1'), t('camera.scanMsg2'), t('camera.scanMsg3'), t('camera.scanMsg4')];
      setAutoScanMessage(autoScanMessages[Math.floor(Math.random() * autoScanMessages.length)]);
    } else if (isCameraPaused) {
      setIsCameraPaused(false);
    }
  }, [isAutoMode, isCameraPaused, t]);

  const handleSwitchCamera = () => {
    if (deviceType === 'phone') {
      setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }
  };

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current && !isAnalyzing && !isCameraPaused) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        const { videoWidth, videoHeight } = video;
        let width = videoWidth;
        let height = videoHeight;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
        if (isAutoMode && soundEffects) {
            playCaptureSound();
        }
      }
    }
  }, [onCapture, isAnalyzing, isCameraPaused, isAutoMode, soundEffects]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isAutoMode && isCameraReady && !isAnalyzing && !isCameraPaused) {
      intervalRef.current = window.setInterval(() => {
        handleCaptureClick();
      }, autoScanInterval); 
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoMode, isCameraReady, isAnalyzing, isCameraPaused, handleCaptureClick, autoScanInterval]);

  const finalError = appError || streamError;

  if (finalError && !isCameraReady) {
    return <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">{finalError}</div>;
  }

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className={`w-full max-w-2xl aspect-video bg-text-main/90 rounded-lg overflow-hidden relative shadow-lg transition-shadow duration-300 group ${isAnalyzing ? 'animate-pulse-border' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' }}
        />
        {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-10 animate-fade-in flex flex-col items-center justify-center bg-black/40">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at center, transparent 55%, rgba(4, 120, 87, 0.3)),
                        linear-gradient(to right, var(--color-primary-light) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--color-primary-light) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 2.5rem 2.5rem, 2.5rem 2.5rem',
                    opacity: 0.1,
                }}></div>
        
                <div className="absolute left-0 w-full h-2 bg-gradient-to-b from-transparent via-brand-green-light/80 to-transparent animate-scan-y shadow-scan-glow blur"></div>
        
                <div className="absolute inset-2">
                    <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-green-light/80 rounded-tl-lg"></span>
                    <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-green-light/80 rounded-tr-lg"></span>
                    <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-green-light/80 rounded-bl-lg"></span>
                    <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-green-light/80 rounded-br-lg"></span>
                </div>

                <div className="relative text-center text-white z-20">
                    <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse-dot [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse-dot [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse-dot"></div>
                    </div>
                    <p className="mt-3 text-lg font-semibold drop-shadow-md">{t('camera.status.analyzing')}</p>
                    <div className="h-5">
                      <p key={analysisStep} className="text-sm opacity-80 animate-fade-in drop-shadow-md">{analysisMessages[analysisStep]}</p>
                    </div>
                </div>
            </div>
        )}
        <CameraStatusIndicator isCameraReady={isCameraReady} isCameraPaused={isCameraPaused} isAnalyzing={isAnalyzing} error={finalError} t={t} />
        {!isCameraReady && !finalError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <p className="text-white text-lg">{t('camera.status.starting')}</p>
            </div>
        )}
        {isCameraPaused && isCameraReady && (
             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white cursor-pointer z-20 animate-fade-in" onClick={() => setIsCameraPaused(false)}>
                <div className="relative flex flex-col items-center justify-center text-center">
                    <AnimatedFrameIcon className="w-48 h-48 text-brand-green-light absolute" />
                    <div className="relative z-10 flex flex-col items-center">
                        <PlayIcon className="w-12 h-12 mb-4 opacity-90" />
                        <p className="text-lg font-semibold">{t('camera.paused.title')}</p>
                        <p className="text-sm">{t('camera.paused.subtitle')}</p>
                    </div>
                </div>
            </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6 w-full max-w-2xl flex items-center justify-center gap-2 sm:gap-4 p-2 bg-card/40 backdrop-blur-md rounded-full shadow-lg border border-white/10">
        <Tooltip text={t('camera.tooltip.capture')}>
          <button
              onClick={handleCaptureClick}
              disabled={isAnalyzing || isAutoMode || isCameraPaused}
              className="px-6 py-3 bg-background text-brand-green-dark font-bold rounded-full shadow-neumorphic active:shadow-neumorphic-inset transition-all duration-150 disabled:bg-text-muted/20 disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed hover:enabled:-translate-y-1 flex items-center gap-2"
              aria-label={t('camera.capture')}
          >
              <CameraIcon className="w-6 h-6" />
              <span>{t('camera.capture')}</span>
          </button>
        </Tooltip>
          
          <div className="flex-grow"></div>
          
          {deviceType === 'phone' && (
             <Tooltip text={t('camera.tooltip.switch')}>
                <button
                onClick={handleSwitchCamera}
                disabled={!isCameraReady || isAnalyzing}
                className="p-3 rounded-full text-text-main bg-card/20 backdrop-blur-sm border border-card/30 hover:bg-card/50 transition-colors disabled:text-text-muted disabled:bg-text-muted/20 disabled:cursor-not-allowed"
                aria-label={t('camera.switch')}
                >
                <SwitchCameraIcon className="w-5 h-5" />
                </button>
            </Tooltip>
          )}

          <Tooltip text={t('camera.tooltip.autoMode')}>
            <div className="flex items-center gap-3 p-1 rounded-full bg-text-main/5">
                <label htmlFor="auto-mode-toggle" className="font-medium text-text-main cursor-pointer select-none text-sm pl-2">
                    {t('camera.auto')}
                </label>
                <button
                    id="auto-mode-toggle"
                    role="switch"
                    aria-checked={isAutoMode}
                    onClick={() => setIsAutoMode(!isAutoMode)}
                    disabled={isCameraPaused}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isAutoMode ? 'bg-brand-green' : 'bg-text-muted/40'
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isAutoMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
          </Tooltip>

          <Tooltip text={isCameraPaused ? t('camera.tooltip.resume') : t('camera.tooltip.pause')}>
            <button
              onClick={() => setIsCameraPaused(!isCameraPaused)}
              disabled={!isCameraReady || !isAutoMode}
              className="p-3 rounded-full text-text-main bg-card/20 backdrop-blur-sm border border-card/30 hover:bg-card/50 transition-colors disabled:text-text-muted disabled:bg-text-muted/20 disabled:cursor-not-allowed"
              aria-label={isCameraPaused ? t('camera.resume') : t('camera.pause')}
            >
              {isCameraPaused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
            </button>
          </Tooltip>
      </div>
      
      <div className="h-6 mt-4 flex items-center justify-center">
        {isAutoMode ? (
            isCameraPaused ? (
                <p className="text-center text-text-muted">
                    {t('camera.autoPaused')}
                </p>
            ) : (
                <p className="text-center text-text-muted animate-pulse">
                    {autoScanMessage}
                </p>
            )
        ) : (
            <p className="text-center text-text-muted">
                {t('camera.manualMode')}
            </p>
        )}
      </div>
    </div>
  );
};