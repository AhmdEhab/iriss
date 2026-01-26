import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface AudioContextType {
  isEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  playSound: (type: 'tap' | 'success' | 'error' | 'welcome' | 'celebration') => void;
  speak: (text: string, language?: 'ar' | 'en') => void;
  stopSpeaking: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.7);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      if (!newValue && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return newValue;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const playSound = useCallback((type: 'tap' | 'success' | 'error' | 'welcome' | 'celebration') => {
    if (!isEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.value = volume * 0.3;

      const frequencies: Record<string, number[]> = {
        tap: [400],
        success: [523, 659, 784],
        error: [300, 250],
        welcome: [523, 659, 784, 1047],
        celebration: [523, 659, 784, 1047, 1319]
      };

      const freqs = frequencies[type] || [440];
      let time = audioContext.currentTime;

      freqs.forEach((freq) => {
        oscillator.frequency.setValueAtTime(freq, time);
        time += 0.15;
      });

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + freqs.length * 0.15);
    } catch (error) {
      console.log('Audio playback not supported');
    }
  }, [isEnabled, volume]);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, language: 'ar' | 'en' = 'ar') => {
    if (!isEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();

    let voice = null;
    if (language === 'ar') {
      voice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Neural') || v.name.includes('Natural')))
        || voices.find(v => v.lang.startsWith('ar') && (v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('kid') || v.name.toLowerCase().includes('boy') || v.name.toLowerCase().includes('girl')))
        || voices.find(v => (v.lang.startsWith('ar') || v.lang === 'ar-SA' || v.lang === 'ar-EG') && (v.name.includes('Hoda') || v.name.includes('Salma') || v.name.includes('Google')))
        || voices.find(v => v.lang.startsWith('ar'));
    } else {
      voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google US English') || v.name.includes('Neural')))
        || voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('kid')))
        || voices.find(v => v.lang.includes('en') && (v.name.includes('Aria') || v.name.includes('Natural')))
        || voices.find(v => v.lang.includes('en') && v.name.includes('Zira'))
        || voices.find(v => v.lang.includes('en'));
    }

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.85; // Slightly slower for child clarity
    utterance.pitch = language === 'ar' ? 1.35 : 1.2;
    utterance.volume = volume;

    // Fix for stuttering: store in ref to prevent GC
    utteranceRef.current = utterance;

    // Prevent stuttering by ensuring the utterance has a reference in global scope if needed
    (window as any)._lastUtterance = utterance;

    window.speechSynthesis.speak(utterance);
  }, [isEnabled, volume]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isEnabled,
        volume,
        toggleAudio,
        setVolume,
        playSound,
        speak,
        stopSpeaking
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}