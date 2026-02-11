import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface NumberItem {
    id: string;
    val: number;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
}

export function NumbersScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedNumId, setSelectedNumId] = useState<string | null>(null);

    const numbers: NumberItem[] = [
        { id: '1', val: 1, nameAr: 'واحد', nameEn: 'One', emoji: '🍎', color: 'from-orange-400 to-red-500' },
        { id: '2', val: 2, nameAr: 'اثنان', nameEn: 'Two', emoji: '🐥🐥', color: 'from-yellow-400 to-orange-500' },
        { id: '3', val: 3, nameAr: 'ثلاثة', nameEn: 'Three', emoji: '🚗🚗🚗', color: 'from-green-400 to-emerald-500' },
        { id: '4', val: 4, nameAr: 'أربعة', nameEn: 'Four', emoji: '🦋🦋🦋🦋', color: 'from-blue-400 to-cyan-500' },
        { id: '5', val: 5, nameAr: 'خمسة', nameEn: 'Five', emoji: '🖐️', color: 'from-purple-400 to-pink-500' },
        { id: '6', val: 6, nameAr: 'ستة', nameEn: 'Six', emoji: '🐝🐝🐝🐝🐝🐝', color: 'from-amber-400 to-yellow-600' },
        { id: '7', val: 7, nameAr: 'سبعة', nameEn: 'Seven', emoji: '🌈', color: 'from-indigo-400 to-purple-600' },
        { id: '8', val: 8, nameAr: 'ثمانية', nameEn: 'Eight', emoji: '🐙', color: 'from-pink-400 to-rose-600' },
        { id: '9', val: 9, nameAr: 'تسعة', nameEn: 'Nine', emoji: '🎈🎈🎈🎈🎈🎈🎈🎈🎈', color: 'from-cyan-400 to-blue-600' },
        { id: '10', val: 10, nameAr: 'عشرة', nameEn: 'Ten', emoji: '👐', color: 'from-teal-400 to-green-600' }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedNumId) {
            setSelectedNumId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedNum = numbers.find(n => n.id === selectedNumId);

    const handleNumSelect = (num: NumberItem) => {
        playSound('tap');
        setSelectedNumId(num.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('numbers');
        setTimeout(() => setSelectedNumId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-yellow-101'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-orange-600'}`}>
                        {language === 'ar' ? 'تعلم الأرقام' : 'Learn Numbers'} 🔢
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedNumId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
                        >
                            {numbers.map((num, index) => (
                                <motion.div
                                    key={num.id}
                                    initial={{ scale: 0, rotate: index % 2 === 0 ? -5 : 5 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleNumSelect(num)}
                                        className={`w-full aspect-square rounded-[2rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : num.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-4 border-white group`}
                                    >
                                        <span className="text-7xl font-black text-white drop-shadow-md">
                                            {num.val}
                                        </span>
                                        <span className="text-xl font-bold text-white/90 mt-2">
                                            {language === 'ar' ? num.nameAr : num.nameEn}
                                        </span>
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="max-w-4xl mx-auto pt-10"
                        >
                            {selectedNum && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        mainVisual={selectedNum.val.toString()}
                                        nameAr={selectedNum.nameAr}
                                        nameEn={selectedNum.nameEn}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedNumId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار رقم آخر' : 'Choose another number'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
