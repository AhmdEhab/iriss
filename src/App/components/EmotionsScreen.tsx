import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface Emotion {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    contextImage?: string;
}

export function EmotionsScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(null);

    const emotions: Emotion[] = [
        {
            id: 'happy',
            nameAr: 'سعيد',
            nameEn: 'Happy',
            emoji: '😊',
            color: 'from-yellow-300 to-yellow-500',
            contextImage: 'https://images.unsplash.com/photo-1502781253272-4a0144b54e3f?auto=format&fit=crop&q=80&w=1000' // Happy kids playing
        },
        {
            id: 'sad',
            nameAr: 'حزين',
            nameEn: 'Sad',
            emoji: '😢',
            color: 'from-blue-300 to-indigo-500',
            contextImage: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=1000' // Child feeling sad/lonely
        },
        {
            id: 'angry',
            nameAr: 'غاضب',
            nameEn: 'Angry',
            emoji: '😠',
            color: 'from-red-400 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1454418659174-8d4847e09968?auto=format&fit=crop&q=80&w=1000' // Angry stance/expression
        },
        {
            id: 'excited',
            nameAr: 'متحمس',
            nameEn: 'Excited',
            emoji: '🤩',
            color: 'from-orange-400 to-pink-500',
            contextImage: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=1000' // Excited celebration
        },
        {
            id: 'surprised',
            nameAr: 'متفاجئ',
            nameEn: 'Surprised',
            emoji: '😲',
            color: 'from-purple-400 to-fuchsia-600',
            contextImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1000' // Surprised expression
        },
        {
            id: 'calm',
            nameAr: 'هادئ',
            nameEn: 'Calm',
            emoji: '😌',
            color: 'from-green-300 to-teal-500',
            contextImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000' // Calm/Peaceful scene
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedEmotionId) {
            setSelectedEmotionId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedEmotion = emotions.find(e => e.id === selectedEmotionId);

    const handleEmotionSelect = (emotion: Emotion) => {
        playSound('tap');
        setSelectedEmotionId(emotion.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('emotions');
        setTimeout(() => setSelectedEmotionId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-pink-50 via-white to-yellow-50'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-pink-600'}`}>
                        {language === 'ar' ? 'مشاعري الجميلة' : 'My Emotions'} ✨
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedEmotionId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-8"
                        >
                            {emotions.map((emotion, index) => (
                                <motion.div
                                    key={emotion.id}
                                    initial={{ scale: 0, scaleZ: 0.5 }}
                                    animate={{ scale: 1, scaleZ: 1 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleEmotionSelect(emotion)}
                                        className={`w-full aspect-square rounded-full shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : emotion.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-8 border-white group`}
                                    >
                                        <div className="text-9xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                                            {emotion.emoji}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                                            {language === 'ar' ? emotion.nameAr : emotion.nameEn}
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
                            {selectedEmotion && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        itemId={selectedEmotion.id}
                                        mainVisual={selectedEmotion.emoji}
                                        nameAr={selectedEmotion.nameAr}
                                        nameEn={selectedEmotion.nameEn}
                                        contextImage={selectedEmotion.contextImage}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedEmotionId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار شعور آخر' : 'Choose another emotion'}
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
