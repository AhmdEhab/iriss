import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface Shape {
    id: string;
    nameAr: string;
    nameEn: string;
    icon: string;
    color: string;
    contextImage?: string;
}

export function ShapesScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

    const shapes: Shape[] = [
        {
            id: 'circle',
            nameAr: 'دائرة',
            nameEn: 'Circle',
            icon: '🔴',
            color: 'from-orange-400 to-red-500',
            contextImage: 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?auto=format&fit=crop&q=80&w=1000' // Sun
        },
        {
            id: 'square',
            nameAr: 'مربع',
            nameEn: 'Square',
            icon: '⬛',
            color: 'from-blue-400 to-indigo-600',
            contextImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1000' // Gift box
        },
        {
            id: 'triangle',
            nameAr: 'مثلث',
            nameEn: 'Triangle',
            icon: '🔺',
            color: 'from-yellow-400 to-amber-600',
            contextImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000' // Pizza
        },
        {
            id: 'rectangle',
            nameAr: 'مستطيل',
            nameEn: 'Rectangle',
            icon: '▮',
            color: 'from-emerald-400 to-teal-600',
            contextImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1000' // TV
        },
        {
            id: 'star',
            nameAr: 'نجمة',
            nameEn: 'Star',
            icon: '⭐',
            color: 'from-yellow-300 to-orange-400',
            contextImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000' // Stars
        },
        {
            id: 'heart',
            nameAr: 'قلب',
            nameEn: 'Heart',
            icon: '❤️',
            color: 'from-pink-400 to-rose-600',
            contextImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000' // Heart cookie/shape
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedShapeId) {
            setSelectedShapeId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedShape = shapes.find(s => s.id === selectedShapeId);

    const handleShapeSelect = (shape: Shape) => {
        playSound('tap');
        setSelectedShapeId(shape.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('shapes');
        setTimeout(() => setSelectedShapeId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-indigo-600'}`}>
                        {language === 'ar' ? 'الأشكال الهندسيّة' : 'Shapes'} 🔺
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedShapeId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-8"
                        >
                            {shapes.map((shape, index) => (
                                <motion.div
                                    key={shape.id}
                                    initial={{ scale: 0, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleShapeSelect(shape)}
                                        className={`w-full aspect-square rounded-[3.5rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : shape.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-8 border-white group`}
                                    >
                                        <div className="text-9xl mb-4 group-hover:scale-110 transition-transform drop-shadow-md">
                                            {shape.icon}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                                            {language === 'ar' ? shape.nameAr : shape.nameEn}
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
                            {selectedShape && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        mainVisual={selectedShape.icon}
                                        nameAr={selectedShape.nameAr}
                                        nameEn={selectedShape.nameEn}
                                        contextImage={selectedShape.contextImage}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedShapeId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار شكل آخر' : 'Choose another shape'}
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
