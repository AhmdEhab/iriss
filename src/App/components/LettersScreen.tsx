import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { getItemsByCategory } from '../data/MasterCurriculum';
import { SyndromeLearningCard } from './SyndromeLearningCard';

export function LettersScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

    const letters = React.useMemo(() => {
        const allLetters = getItemsByCategory('letters');
        // Filter by language (English letters start with en_)
        if (language === 'ar') {
            return allLetters.filter(l => !l.id.startsWith('en_'));
        } else {
            return allLetters.filter(l => l.id.startsWith('en_'));
        }
    }, [language]);

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedLetterId) {
            setSelectedLetterId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedLetter = letters.find(l => l.id === selectedLetterId);

    const handleLetterSelect = (letter: any) => {
        playSound('tap');
        setSelectedLetterId(letter.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('letters');
        setTimeout(() => setSelectedLetterId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-yellow-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-blue-600'}`}>
                        {language === 'ar' ? 'تعلم الحروف' : 'Learn Letters'} 📝
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedLetterId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        >
                            {letters.map((letter, index) => (
                                <motion.div
                                    key={letter.id}
                                    initial={{ scale: 0, rotate: index % 2 === 0 ? -5 : 5 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleLetterSelect(letter)}
                                        className={`w-full aspect-square rounded-[2rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : letter.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-4 border-white group`}
                                    >
                                        <span className="text-6xl font-black text-white drop-shadow-md">
                                            {letter.emoji}
                                        </span>
                                        <h3 className="text-lg font-bold text-white/90 text-center drop-shadow-md mt-2">
                                            {language === 'ar' ? letter.nameAr : letter.nameEn}
                                        </h3>
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
                            {selectedLetter && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        itemId={selectedLetter.id}
                                        mainVisual={selectedLetter.emoji}
                                        nameAr={selectedLetter.nameAr}
                                        nameEn={selectedLetter.nameEn}
                                        soundEffect="success"
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedLetterId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار حرف آخر' : 'Choose another letter'}
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
