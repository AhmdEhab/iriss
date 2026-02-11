import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface BodyPart {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    contextImage?: string;
}

export function BodyPartsScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

    const bodyParts: BodyPart[] = [
        {
            id: 'eyes',
            nameAr: 'العينان',
            nameEn: 'Eyes',
            emoji: '👀',
            color: 'from-sky-400 to-blue-600',
            contextImage: 'https://images.unsplash.com/photo-1544435253-f0ededca9617?auto=format&fit=crop&q=80&w=1000' // Eye close up
        },
        {
            id: 'ears',
            nameAr: 'الأذنان',
            nameEn: 'Ears',
            emoji: '👂',
            color: 'from-amber-400 to-orange-500',
            contextImage: 'https://images.unsplash.com/photo-1590650516494-0c8e4a09dd01?auto=format&fit=crop&q=80&w=1000' // Listening to music
        },
        {
            id: 'nose',
            nameAr: 'الأنف',
            nameEn: 'Nose',
            emoji: '👃',
            color: 'from-rose-400 to-pink-500',
            contextImage: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1000' // Smelling flowers
        },
        {
            id: 'mouth',
            nameAr: 'الفم',
            nameEn: 'Mouth',
            emoji: '👄',
            color: 'from-orange-500 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1519704943960-da38fe96a433?auto=format&fit=crop&q=80&w=1000' // Eating/Smiling
        },
        {
            id: 'hands',
            nameAr: 'اليدان',
            nameEn: 'Hands',
            emoji: '🙌',
            color: 'from-violet-400 to-purple-600',
            contextImage: 'https://images.unsplash.com/photo-1511202824364-70656041130d?auto=format&fit=crop&q=80&w=1000' // Child painting with hands
        },
        {
            id: 'feet',
            nameAr: 'القدمان',
            nameEn: 'Feet',
            emoji: '👣',
            color: 'from-emerald-400 to-teal-600',
            contextImage: 'https://images.unsplash.com/photo-1490650404312-a2175773bba5?auto=format&fit=crop&q=80&w=1000' // Child feet in colors
        },
        {
            id: 'heart',
            nameAr: 'القلب',
            nameEn: 'Heart',
            emoji: '❤️',
            color: 'from-red-500 to-rose-600',
            contextImage: 'https://images.unsplash.com/photo-1530737482833-2a07c3be137f?auto=format&fit=crop&q=80&w=1000' // Heart bokeh/light
        },
        {
            id: 'brain',
            nameAr: 'الدماغ',
            nameEn: 'Brain',
            emoji: '🧠',
            color: 'from-fuchsia-400 to-indigo-600',
            contextImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000' // Thinking child/Brain concept
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedPartId) {
            setSelectedPartId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedPart = bodyParts.find(p => p.id === selectedPartId);

    const handlePartSelect = (part: BodyPart) => {
        playSound('tap');
        setSelectedPartId(part.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('body-parts');
        setTimeout(() => setSelectedPartId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-50 via-white to-pink-50'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-rose-600'}`}>
                        {language === 'ar' ? 'أعضاء جسمي' : 'My Body Parts'} 🧒
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedPartId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        >
                            {bodyParts.map((part, index) => (
                                <motion.div
                                    key={part.id}
                                    initial={{ scale: 0, scaleZ: index % 2 === 0 ? 0.9 : 1.1 }}
                                    animate={{ scale: 1, scaleZ: 1 }}
                                    transition={{ delay: index * 0.05, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handlePartSelect(part)}
                                        className={`w-full aspect-square rounded-[2.5rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : part.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-4 border-white group`}
                                    >
                                        <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                                            {part.emoji}
                                        </div>
                                        <h3 className="text-xl font-bold text-white drop-shadow-md">
                                            {language === 'ar' ? part.nameAr : part.nameEn}
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
                            {selectedPart && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        itemId={selectedPart.id}
                                        mainVisual={selectedPart.emoji}
                                        nameAr={selectedPart.nameAr}
                                        nameEn={selectedPart.nameEn}
                                        contextImage={selectedPart.contextImage}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedPartId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار عضو آخر' : 'Choose another part'}
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
