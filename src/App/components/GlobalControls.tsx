import React, { useEffect } from 'react';
import { Volume2, VolumeX, Languages } from 'lucide-react';
import { motion } from 'motion/react';

import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

export function GlobalControls() {
  const { isEnabled, volume, toggleAudio, setVolume } = useAudio();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2" dir="ltr">
      {/* Audio Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
        className="size-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center text-slate-800 hover:bg-white/40 transition-all"
      >
        {isEnabled ? (
          <Volume2 className="size-5" />
        ) : (
          <VolumeX className="size-5" />
        )}
      </motion.button>

      {/* Language Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="size-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center text-slate-800 hover:bg-white/40 transition-all font-black text-xs"
      >
        {language === 'ar' ? 'EN' : 'AR'}
      </motion.button>
    </div>
  );
}

