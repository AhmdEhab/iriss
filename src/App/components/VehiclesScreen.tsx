import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Vehicle {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
    soundAr: string;
    soundEn: string;
}

export function VehiclesScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const vehicles: Vehicle[] = [
        {
            id: 'car',
            nameAr: 'سيارة',
            nameEn: 'Car',
            emoji: '🚗',
            color: 'from-red-400 to-red-600',
            descAr: 'السيارة تمشي على الطريق وتأخذنا إلى أماكن كثيرة.',
            descEn: 'The car drives on the road and takes us to many places.',
            soundAr: 'صوت محرك السيارة يقول: بيب بيب!',
            soundEn: 'The car engine goes: Beep Beep!'
        },
        {
            id: 'plane',
            nameAr: 'طائرة',
            nameEn: 'Airplane',
            emoji: '✈️',
            color: 'from-blue-400 to-blue-600',
            descAr: 'الطائرة تطير عالياً في السماء فوق السحاب.',
            descEn: 'The airplane flies high in the sky above the clouds.',
            soundAr: 'الطائرة تصدر صوتاً قوياً عندما تطير: ووووش!',
            soundEn: 'The plane makes a loud sound when it flies: Whoosh!'
        },
        {
            id: 'train',
            nameAr: 'قطار',
            nameEn: 'Train',
            emoji: '🚂',
            color: 'from-gray-500 to-gray-700',
            descAr: 'القطار يمشي على السكة الحديدية وهو طويل جداً.',
            descEn: 'The train runs on tracks and is very long.',
            soundAr: 'صوت القطار يقول: توت توت!',
            soundEn: 'The train sound goes: Choo Choo!'
        },
        {
            id: 'ship',
            nameAr: 'سفينة',
            nameEn: 'Ship',
            emoji: '🚢',
            color: 'from-cyan-500 to-blue-700',
            descAr: 'السفينة تبحر في البحر الواسع والمحيطات.',
            descEn: 'The ship sails in the wide sea and oceans.',
            soundAr: 'السفينة تطلق بوقاً عالياً: طووووو!',
            soundEn: 'The ship blows a loud horn: Tuuuuut!'
        },
        {
            id: 'bicycle',
            nameAr: 'دراجة',
            nameEn: 'Bicycle',
            emoji: '🚲',
            color: 'from-green-400 to-green-600',
            descAr: 'الدراجة مفيدة للرياضة ولها عجلتان.',
            descEn: 'The bicycle is great for exercise and has two wheels.',
            soundAr: 'جرس الدراجة يقول: ترن ترن!',
            soundEn: 'The bicycle bell goes: Ring Ring!'
        },
        {
            id: 'rocket',
            nameAr: 'صاروخ',
            nameEn: 'Rocket',
            emoji: '🚀',
            color: 'from-orange-500 to-red-600',
            descAr: 'الصاروخ ينطلق بسرعة كبيرة نحو الفضاء الخارجي.',
            descEn: 'The rocket blasts off at great speed into outer space.',
            soundAr: 'صاروخ ينطلق بقوة: زووووووم!',
            soundEn: 'The rocket launches with power: Zoom!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    const handleVehicleSelect = (vehicle: Vehicle) => {
        playSound('tap');
        const name = language === 'ar' ? vehicle.nameAr : vehicle.nameEn;
        speak(name, language);
        setSelectedVehicleId(vehicle.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedVehicle) {
            const name = language === 'ar' ? selectedVehicle.nameAr : selectedVehicle.nameEn;
            const desc = language === 'ar' ? selectedVehicle.descAr : selectedVehicle.descEn;
            const sound = language === 'ar' ? selectedVehicle.soundAr : selectedVehicle.soundEn;
            speak(`${name}. ${desc}. ${sound}`, language);
            setIsPlaying(true);
            playSound('success');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4">
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className="text-5xl font-bold text-blue-700 drop-shadow-lg">
                        {t.vehicles} 🚀
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedVehicleId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle, index) => (
                            <motion.div key={vehicle.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleVehicleSelect(vehicle)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${vehicle.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ x: [0, 10, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {vehicle.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? vehicle.nameAr : vehicle.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedVehicle && (
                            <Card className={`bg-gradient-to-br ${selectedVehicle.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, x: isPlaying ? [0, 20, -20, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedVehicle.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedVehicle.nameAr : selectedVehicle.nameEn}
                                    </h2>
                                </div>

                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-center gap-4 bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 justify-center">
                                        <p className="text-3xl font-bold text-blue-800 leading-relaxed text-center italic">
                                            "{language === 'ar' ? selectedVehicle.descAr : selectedVehicle.descEn}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 justify-center text-center">
                                        <Volume2 className="size-10 text-orange-500 animate-pulse flex-shrink-0" />
                                        <p className="text-2xl font-black text-orange-600 italic">
                                            {language === 'ar' ? selectedVehicle.soundAr : selectedVehicle.soundEn}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-blue-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>

                                    <Button onClick={() => { playSound('success'); incrementProgress('vehicles'); speak(language === 'ar' ? 'أحسنتم! لقد تعلمت وسيلة جديدة.' : 'Well done! You learned a new vehicle.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>

                                    <Button onClick={() => { playSound('tap'); setSelectedVehicleId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
                                        <RotateCcw className="size-8 me-3" />
                                        {language === 'ar' ? 'العودة' : 'Back'}
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
