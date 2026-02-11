import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface FoodItem {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    contextImage?: string;
}

export function FruitsScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const foods: FoodItem[] = [
        {
            id: 'apple',
            nameAr: 'تفاحة',
            nameEn: 'Apple',
            emoji: '🍎',
            color: 'from-red-400 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b60d05?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'banana',
            nameAr: 'موز',
            nameEn: 'Banana',
            emoji: '🍌',
            color: 'from-yellow-300 to-yellow-500',
            contextImage: 'https://images.unsplash.com/photo-1571771894821-ad990241ec4a?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'orange',
            nameAr: 'برتقال',
            nameEn: 'Orange',
            emoji: '🍊',
            color: 'from-orange-400 to-orange-600',
            contextImage: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b44?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'strawberry',
            nameAr: 'فراولة',
            nameEn: 'Strawberry',
            emoji: '🍓',
            color: 'from-pink-400 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1464965911861-746a04b48ca6?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'grapes',
            nameAr: 'عنب',
            nameEn: 'Grapes',
            emoji: '🍇',
            color: 'from-purple-400 to-indigo-500',
            contextImage: 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'watermelon',
            nameAr: 'بطيخ',
            nameEn: 'Watermelon',
            emoji: '🍉',
            color: 'from-red-500 to-green-600',
            contextImage: 'https://images.unsplash.com/photo-1587049352846-4a222e783137?auto=format&fit=crop&q=80&w=1000'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedItemId) {
            setSelectedItemId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedItem = foods.find(f => f.id === selectedItemId);

    const handleItemSelect = (item: FoodItem) => {
        playSound('tap');
        setSelectedItemId(item.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('fruits');
        setTimeout(() => setSelectedItemId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-red-100 via-white to-green-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-red-600'}`}>
                        {language === 'ar' ? 'تعلم الفواكه' : 'Learn Fruits'} 🍎
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedItemId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
                        >
                            {foods.map((food, index) => (
                                <motion.div
                                    key={food.id}
                                    initial={{ scale: 0, rotate: index % 2 === 0 ? -5 : 5 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleItemSelect(food)}
                                        className={`w-full aspect-square rounded-[3rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : food.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-8 border-white group`}
                                    >
                                        <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">
                                            {food.emoji}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                            {language === 'ar' ? food.nameAr : food.nameEn}
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
                            {selectedItem && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        itemId={selectedItem.id}
                                        mainVisual={selectedItem.emoji}
                                        nameAr={selectedItem.nameAr}
                                        nameEn={selectedItem.nameEn}
                                        contextImage={selectedItem.contextImage}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedItemId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار فاكهة أخرى' : 'Choose another fruit'}
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
