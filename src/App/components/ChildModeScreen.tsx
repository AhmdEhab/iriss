import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Lock, Award, Home, Play, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Level {
  id: string;
  name: string;
  icon: string;
  color: string;
  locked: boolean;
  progress: number;
  category: string;
}

export function ChildModeScreen() {
  const { navigateTo, childProfile, moduleProgress } = useApp();
  const { speak, playSound } = useAudio();
  const { t, language, dir } = useLanguage();

  const categories = [
    { id: 'basics', name: t.basics, icon: '🧩', color: 'from-blue-500 to-cyan-500' },
    { id: 'world', name: t.world, icon: '🌍', color: 'from-green-500 to-emerald-500' },
    { id: 'creative', name: t.creative, icon: '🎨', color: 'from-purple-500 to-pink-500' },
  ];

  const levels: Level[] = [
    // Basics
    { id: 'letters', name: t.letters, icon: '📝', color: 'from-blue-400 to-cyan-400', locked: false, progress: moduleProgress['letters'] || 0, category: 'basics' },
    { id: 'numbers', name: t.numbers, icon: '🔢', color: 'from-purple-400 to-pink-400', locked: false, progress: moduleProgress['numbers'] || 0, category: 'basics' },
    { id: 'shapes', name: t.shapes, icon: '🔺', color: 'from-yellow-400 to-amber-500', locked: false, progress: moduleProgress['shapes'] || 0, category: 'basics' },
    { id: 'colors', name: t.colors, icon: '🎨', color: 'from-orange-400 to-yellow-400', locked: false, progress: moduleProgress['colors'] || 0, category: 'basics' },

    // World
    { id: 'animals', name: t.animals, icon: '🦁', color: 'from-green-400 to-emerald-400', locked: false, progress: moduleProgress['animals'] || 0, category: 'world' },
    { id: 'fruits', name: t.fruits, icon: '🍎', color: 'from-orange-400 to-red-500', locked: false, progress: moduleProgress['fruits'] || 0, category: 'world' },
    { id: 'body-parts', name: t.bodyParts, icon: '🧒', color: 'from-blue-300 to-indigo-400', locked: false, progress: moduleProgress['body-parts'] || 0, category: 'world' },
    { id: 'life-skills', name: t.lifeSkills, icon: '🏠', color: 'from-pink-400 to-rose-400', locked: false, progress: moduleProgress['life-skills'] || 0, category: 'world' },
    { id: 'vehicles', name: t.vehicles, icon: '🚀', color: 'from-blue-400 to-indigo-500', locked: false, progress: moduleProgress['vehicles'] || 0, category: 'world' },

    // Creative
    { id: 'stories', name: t.stories, icon: '📚', color: 'from-indigo-400 to-purple-400', locked: false, progress: moduleProgress['stories'] || 0, category: 'creative' },
    { id: 'drawing', name: t.drawing, icon: '🎨', color: 'from-pink-400 to-orange-400', locked: false, progress: moduleProgress['drawing'] || 0, category: 'creative' },
    { id: 'emotions', name: t.emotions, icon: '😊', color: 'from-yellow-400 to-pink-500', locked: false, progress: moduleProgress['emotions'] || 0, category: 'creative' },
    { id: 'songs', name: t.songs, icon: '🎵', color: 'from-cyan-400 to-blue-500', locked: false, progress: moduleProgress['songs'] || 0, category: 'creative' },
    { id: 'games-hub', name: t.gamesHub, icon: '🎮', color: 'from-purple-400 to-pink-500', locked: false, progress: moduleProgress['games-hub'] || 0, category: 'creative' },
  ];

  const handleLevelClick = (level: Level) => {
    if (level.locked) {
      playSound('error');
      speak(language === 'ar' ? 'هذا المستوى مقفل' : 'This level is locked', language);
      return;
    }
    playSound('tap');
    speak(level.name, language);
    setTimeout(() => navigateTo(level.id as any), 500);
  };

  const handleBackToMenu = () => {
    playSound('tap');
    navigateTo('mode-selection');
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 overflow-x-hidden">
      {/* Premium Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b-4 border-gray-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={handleBackToMenu}
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 border-gray-100 hover:bg-gray-50 text-gray-600 font-black h-14"
          >
            <Home className="size-6 me-2" />
            {language === 'ar' ? 'العودة' : 'Back'}
          </Button>

          <div className="flex items-center gap-6">
            <Button
              onClick={() => { playSound('celebration'); navigateTo('rewards'); }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl h-14 px-6 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-lg"
            >
              <Award className="size-6 animate-pulse" />
              <span className="font-black text-xl">
                {language === 'ar' ? 'جوائزي' : 'Awards'}
              </span>
            </Button>

            <div className="bg-purple-100 text-purple-700 px-6 py-3 rounded-2xl font-black text-xl shadow-inner border-2 border-purple-200">
              {childProfile?.name || 'Explorer'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 space-y-16">
        {/* Welcome Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-12 rounded-[3.5rem] shadow-3xl border-8 border-white overflow-hidden relative group">
            {/* Decorative Elements */}
            <Sparkles className="absolute top-10 right-10 size-20 opacity-20 group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 size-40 bg-white opacity-5 rounded-full blur-3xl" />

            <div className="grid md:grid-cols-2 items-center gap-12 relative z-10">
              <div className="space-y-6">
                <motion.h1
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  className="text-6xl font-black leading-tight drop-shadow-xl"
                >
                  {language === 'ar' ? `أهلاً بك يا ${childProfile?.name || 'بطلنا'}! ✨` : `Welcome back, ${childProfile?.name || 'Hero'}! ✨`}
                </motion.h1>
                <p className="text-2xl text-purple-100 font-bold leading-relaxed max-w-md">
                  {language === 'ar' ? 'مستعد لمغامرة تعليمية جديدة اليوم؟ لقد حضرنا لك أشياء ممتعة!' : "Ready for a new learning adventure today? We've prepared some fun things for you!"}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl px-10 py-8 text-2xl font-black shadow-2xl flex items-center gap-4 transition-all hover:scale-110 active:scale-95 h-20"
                  onClick={() => { playSound('celebration'); speak(t.letters, language); navigateTo('letters'); }}
                >
                  <Play className="size-8 fill-purple-600" />
                  {language === 'ar' ? 'أكمل رحلتك' : 'Continue Journey'}
                </Button>
              </div>
              <div className="hidden md:flex justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[15rem] filter drop-shadow-2xl"
                >
                  🧸
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sectioned Content */}
        {categories.map((category, catIdx) => (
          <section key={category.id} className="space-y-8 pb-10">
            <div className="flex items-center gap-4 px-2">
              <div className={`size-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-4xl shadow-lg border-4 border-white`}>
                {category.icon}
              </div>
              <h2 className="text-4xl font-black text-gray-800 tracking-tight">
                {category.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {levels.filter(l => l.category === category.id).map((level, idx) => (
                <motion.div
                  key={level.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <button
                    onClick={() => handleLevelClick(level)}
                    disabled={level.locked}
                    className={`
                                    w-full group relative
                                    ${level.locked ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-95'}
                                `}
                  >
                    <Card className={`
                                    p-8 rounded-[3rem] border-8 border-white shadow-2xl flex flex-col items-center text-center overflow-hidden transition-all duration-200
                                    bg-white hover:shadow-3xl hover:-translate-y-2 active:scale-95
                                    relative
                                `}>
                      {/* Gradient Background Hint */}
                      <div className={`absolute top-0 inset-x-0 h-4 bg-gradient-to-r ${level.color} opacity-80`} />

                      <div className="size-28 rounded-2xl bg-gray-50 mb-6 flex items-center justify-center text-7xl shadow-inner relative group-hover:scale-110 transition-transform">
                        {level.icon}
                        {level.locked && <Lock className="absolute -top-2 -right-2 size-8 text-red-500 fill-white" />}
                      </div>

                      <h3 className="text-2xl font-black text-gray-800 mb-2">{level.name}</h3>

                      <div className="flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-gray-50 text-gray-400 font-black text-sm uppercase tracking-widest border border-gray-100">
                        <Sparkles className="size-4" />
                        {level.progress > 0
                          ? (language === 'ar' ? 'أكمل' : 'Continue')
                          : (language === 'ar' ? 'ابدأ' : 'Start')
                        }
                        <ChevronRight className={`size-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </div>
                    </Card>
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
