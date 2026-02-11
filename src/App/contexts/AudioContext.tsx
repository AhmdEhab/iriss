import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface AudioContextType {
  isEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  playSound: (type: 'tap' | 'success' | 'error' | 'welcome' | 'celebration') => void;
  speak: (text: string, language?: 'ar' | 'en') => void;
  stopSpeaking: () => void;
  playAudio: (url: string) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.7);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup speech/audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      if (!newValue) {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (audioRef.current) audioRef.current.pause();
      }
      return newValue;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
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
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text: string, language: 'ar' | 'en' = 'ar') => {
    if (!isEnabled || !window.speechSynthesis) return;

    // Stop any music playing
    if (audioRef.current) {
      // Optional: fade out or pause music when speaking? 
      // For now, let's pause it to avoid overlap cacophony
      audioRef.current.pause();
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    // Expanded regex to catch more emojis, symbols, and pictographs
    const cleanText = text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') // Basic Emojis
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags (iOS)
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();

    let voice = null;
    if (language === 'ar') {
      // Prioritize child/young voices for Arabic
      voice = voices.find(v => v.lang.startsWith('ar') && (v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('boy')))
        || voices.find(v => v.lang.startsWith('ar') && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Neural') || v.name.includes('Natural')))
        || voices.find(v => v.lang.startsWith('ar'));
    } else {
      // Prioritize child/young voices for English
      voice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('boy')))
        || voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.includes('en') && (v.name.includes('Google US English') || v.name.includes('Neural')))
        || voices.find(v => v.lang.includes('en'));
    }

    if (voice) utterance.voice = voice;
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.9; // Natural speaking rate - clear and easy to understand
    utterance.pitch = 1.3; // Pleasant child-friendly pitch - not too high, just sweet
    utterance.volume = volume;
    utteranceRef.current = utterance;
    (window as any)._lastUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isEnabled, volume]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const playAudio = useCallback((url: string) => {
    if (!isEnabled) return;

    // Stop any existing audio/speech
    stopAudio();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(e => console.error("Failed to play audio:", e));
    audioRef.current = audio;

    // Cleanup on end
    audio.onended = () => {
      audioRef.current = null;
    };
  }, [isEnabled, volume, stopAudio]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    stopAudio(); // Also stop music
  }, [stopAudio]);

  return (
    <AudioContext.Provider
      value={{
        isEnabled,
        volume,
        toggleAudio,
        setVolume,
        playSound,
        speak,
        stopSpeaking,
        playAudio,
        stopAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}