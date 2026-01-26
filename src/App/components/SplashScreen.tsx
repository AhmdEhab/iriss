import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, UserPlus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function SplashScreen() {
  const { navigateTo } = useApp();
  const { speak, playSound } = useAudio();
  const { t, language } = useLanguage();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      playSound('welcome');
      speak(t.welcomeMessage, language);
    }, 1000);
    return () => clearTimeout(timer);
  }, [language, t.welcomeMessage]);

  const handleStart = (mode: 'login' | 'register') => {
    playSound('tap');
    navigateTo(mode === 'login' ? 'login' : 'registration');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden p-6">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 size-80 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 size-96 bg-orange-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="flex flex-col items-center gap-8">

          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative p-2"
          >
            <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-110" />
            <motion.img
              src="/images/iris-logo.gif"
              alt="IRIS Logo"
              style={{ mixBlendMode: 'multiply' }}
              className="w-full max-w-[380px] h-auto rounded-3xl relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Content Card */}
          {showContent && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full"
            >
              <Card className="p-8 rounded-[2.5rem] shadow-3xl border-8 border-white bg-white/90 backdrop-blur-xl text-center space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight drop-shadow-sm">
                    {t.welcomeMessage} <span className="inline-block animate-bounce">✨</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-purple-600 font-bold max-w-2xl mx-auto">
                    {language === 'ar'
                      ? 'رحلتك إلى عالم التعلم الممتع تبدأ الآن! ✨'
                      : 'Your journey to fun learning starts now! ✨'
                    }
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  {/* Login Action */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "tween", ease: "circOut", duration: 0.15 }}
                    onClick={() => handleStart('login')}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-[1.5rem] translate-y-1.5 group-hover:translate-y-2.5 transition-all duration-150" />
                    <div className="relative bg-white border-4 border-blue-500 rounded-[1.5rem] p-6 flex flex-col items-center gap-3 hover:bg-blue-50/50 transition-colors duration-150">
                      <div className="size-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                        <User className="size-8" />
                      </div>
                      <span className="text-2xl font-black text-blue-600">
                        {language === 'ar' ? 'دخول الأبطال' : 'Hero Login'}
                      </span>
                    </div>
                  </motion.button>

                  {/* Register Action */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "tween", ease: "circOut", duration: 0.15 }}
                    onClick={() => handleStart('register')}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-purple-500 rounded-[1.5rem] translate-y-1.5 group-hover:translate-y-2.5 transition-all duration-150" />
                    <div className="relative bg-white border-4 border-purple-500 rounded-[1.5rem] p-6 flex flex-col items-center gap-3 hover:bg-purple-50/50 transition-colors duration-150">
                      <div className="size-16 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                        <UserPlus className="size-8" />
                      </div>
                      <span className="text-2xl font-black text-purple-600">
                        {language === 'ar' ? 'حساب جديد' : 'New Hero'}
                      </span>
                    </div>
                  </motion.button>
                </div>

                <div className="pt-2 flex justify-center items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-xs">
                  <Sparkles className="size-4" />
                  {language === 'ar' ? 'التعلم بكل حب' : 'Learning with Love'}
                  <Sparkles className="size-4" />
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}