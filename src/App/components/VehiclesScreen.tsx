import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';
import { SyndromeLearningCard } from './SyndromeLearningCard';

interface Vehicle {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    contextImage?: string;
}

export function VehiclesScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

    const vehicles: Vehicle[] = [
        {
            id: 'car',
            nameAr: 'سيارة',
            nameEn: 'Car',
            emoji: '🚗',
            color: 'from-red-400 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'plane',
            nameAr: 'طائرة',
            nameEn: 'Airplane',
            emoji: '✈️',
            color: 'from-blue-400 to-blue-600',
            contextImage: 'https://images.unsplash.com/photo-1436491865332-7a61a20fb2a5?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'train',
            nameAr: 'قطار',
            nameEn: 'Train',
            emoji: '🚂',
            color: 'from-gray-500 to-gray-700',
            contextImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'ship',
            nameAr: 'سفينة',
            nameEn: 'Ship',
            emoji: '🚢',
            color: 'from-cyan-500 to-blue-700',
            contextImage: 'https://images.unsplash.com/photo-1544654803-b69110bb8154?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'bicycle',
            nameAr: 'دراجة',
            nameEn: 'Bicycle',
            emoji: '🚲',
            color: 'from-green-400 to-green-600',
            contextImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'rocket',
            nameAr: 'صاروخ',
            nameEn: 'Rocket',
            emoji: '🚀',
            color: 'from-orange-500 to-red-600',
            contextImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        if (selectedVehicleId) {
            setSelectedVehicleId(null);
        } else {
            navigateTo('child-mode');
        }
    };

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    const handleVehicleSelect = (vehicle: Vehicle) => {
        playSound('tap');
        setSelectedVehicleId(vehicle.id);
    };

    const handleLearningComplete = () => {
        incrementProgress('vehicles');
        setTimeout(() => setSelectedVehicleId(null), 1500);
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-orange-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-blue-600'}`}>
                        {language === 'ar' ? 'وسائل المواصلات' : 'Vehicles'} 🚀
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedVehicleId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
                        >
                            {vehicles.map((vehicle, index) => (
                                <motion.div
                                    key={vehicle.id}
                                    initial={{ scale: 0, rotate: index % 2 === 0 ? -5 : 5 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleVehicleSelect(vehicle)}
                                        className={`w-full aspect-square rounded-[3rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : vehicle.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-8 border-white group`}
                                    >
                                        <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">
                                            {vehicle.emoji}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                            {language === 'ar' ? vehicle.nameAr : vehicle.nameEn}
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
                            {selectedVehicle && (
                                <div className="space-y-8">
                                    <SyndromeLearningCard
                                        itemId={selectedVehicle.id}
                                        mainVisual={selectedVehicle.emoji}
                                        nameAr={selectedVehicle.nameAr}
                                        nameEn={selectedVehicle.nameEn}
                                        contextImage={selectedVehicle.contextImage}
                                        onComplete={handleLearningComplete}
                                        language={language}
                                    />

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setSelectedVehicleId(null)}
                                            variant="outline"
                                            size="lg"
                                            className="bg-white/80 backdrop-blur-sm text-2xl px-12 py-8 rounded-full shadow-xl border-4 border-white/50"
                                        >
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'اختيار وسيلة أخرى' : 'Choose another vehicle'}
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
