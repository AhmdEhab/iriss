import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, CheckCircle2, Box, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Shape {
    id: string;
    nameAr: string;
    nameEn: string;
    icon: string;
    color: string;
    descAr: string;
    descEn: string;
    exampleAr: string;
    exampleEn: string;
}

export function ShapesScreen() {
    const { navigateTo, incrementProgress, unlockBadge, logActivity } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const shapes: Shape[] = [
        {
            id: 'circle',
            nameAr: 'دائرة',
            nameEn: 'Circle',
            icon: '🔴',
            color: 'from-red-400 to-red-600',
            descAr: 'الدائرة مستديرة تماماً وليس لها زوايا.',
            descEn: 'A circle is perfectly round and has no corners.',
            exampleAr: 'مثل وجه الشمس أو هذه الكرة الجميلة ⚽',
            exampleEn: 'Like the sun or this beautiful ball ⚽'
        },
        {
            id: 'square',
            nameAr: 'مربع',
            nameEn: 'Square',
            icon: '⬛',
            color: 'from-blue-400 to-blue-600',
            descAr: 'المربع له أربعة أضلاع متساوية في الطول.',
            descEn: 'A square has four sides that are all the same length.',
            exampleAr: 'مثل شكل الشباك أو علبة الهدايا 🎁',
            exampleEn: 'Like a window or a gift box 🎁'
        },
        {
            id: 'triangle',
            nameAr: 'مثلث',
            nameEn: 'Triangle',
            icon: '🔺',
            color: 'from-yellow-400 to-yellow-600',
            descAr: 'المثلث له ثلاثة أضلاع وثلاث زوايا.',
            descEn: 'A triangle has three sides and three corners.',
            exampleAr: 'مثل قطعة البيتزا أو قمة الجبل ⛰️',
            exampleEn: 'Like a pizza slice or a mountain top ⛰️'
        },
        {
            id: 'rectangle',
            nameAr: 'مستطيل',
            nameEn: 'Rectangle',
            icon: '▮',
            color: 'from-green-400 to-green-600',
            descAr: 'المستطيل له أربعة أضلاع، كل ضلعين متقابلين متساويان.',
            descEn: 'A rectangle has four sides, opposite sides are equal.',
            exampleAr: 'مثل شكل الباب أو شاشة التلفاز 📺',
            exampleEn: 'Like a door or a TV screen 📺'
        },
        {
            id: 'star',
            nameAr: 'نجمة',
            nameEn: 'Star',
            icon: '⭐',
            color: 'from-yellow-300 to-orange-400',
            descAr: 'النجمة لها خمسة رؤوس جميلة وتلمع في السماء.',
            descEn: 'A star has five points and shines bright in the sky.',
            exampleAr: 'مثل النجوم التي نراها في الليل ✨',
            exampleEn: 'Like the stars we see at night ✨'
        },
        {
            id: 'heart',
            nameAr: 'قلب',
            nameEn: 'Heart',
            icon: '❤️',
            color: 'from-pink-400 to-red-500',
            descAr: 'القلب يعبر عن الحب والمودة للآخرين.',
            descEn: 'A heart expresses love and kindness for others.',
            exampleAr: 'مثل حبنا لعائلتنا وأصدقائنا 🥰',
            exampleEn: 'Like our love for family and friends 🥰'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedShape = shapes.find(s => s.id === selectedShapeId);

    const handleShapeSelect = (shape: Shape) => {
        playSound('tap');
        const name = language === 'ar' ? shape.nameAr : shape.nameEn;
        speak(name, language);
        setSelectedShapeId(shape.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedShape) {
            const name = language === 'ar' ? selectedShape.nameAr : selectedShape.nameEn;
            const desc = language === 'ar' ? selectedShape.descAr : selectedShape.descEn;
            const example = language === 'ar' ? selectedShape.exampleAr : selectedShape.exampleEn;
            speak(`${name}. ${desc}. ${example}`, language);
            setIsPlaying(true);
            playSound('success');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4">
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className="text-5xl font-bold text-yellow-600 drop-shadow-lg text-center flex-1">
                        {t.shapes} 🔺
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedShapeId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {shapes.map((shape, index) => (
                            <motion.div key={shape.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleShapeSelect(shape)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${shape.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {shape.id === 'rectangle' ? '▮' : shape.id === 'circle' ? '🔴' : shape.id === 'square' ? '⬛' : shape.id === 'triangle' ? '🔺' : shape.id === 'star' ? '⭐' : '❤️'}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? shape.nameAr : shape.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedShape && (
                            <Card className={`bg-gradient-to-br ${selectedShape.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedShape.id === 'rectangle' ? '▮' : selectedShape.id === 'circle' ? '🔴' : selectedShape.id === 'square' ? '⬛' : selectedShape.id === 'triangle' ? '🔺' : selectedShape.id === 'star' ? '⭐' : '❤️'}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedShape.nameAr : selectedShape.nameEn}
                                    </h2>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-center gap-4 bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-100 justify-center">
                                        <Box className="size-10 text-yellow-600 flex-shrink-0" />
                                        <p className="text-2xl font-bold text-yellow-800 leading-relaxed italic text-center">
                                            {language === 'ar' ? selectedShape.descAr : selectedShape.descEn}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-purple-50 p-6 rounded-2xl border-2 border-purple-100 justify-center text-center">
                                        <Sparkles className="size-10 text-purple-500 animate-pulse flex-shrink-0" />
                                        <p className="text-2xl font-black text-purple-600 uppercase tracking-wide">
                                            {language === 'ar' ? selectedShape.exampleAr : selectedShape.exampleEn}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-yellow-700 hover:bg-yellow-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-yellow-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>
                                    <Button onClick={() => { playSound('success'); incrementProgress('shapes'); unlockBadge('explorer'); logActivity({ type: 'learning', taskAr: `تعرف على شكل ال${selectedShape.nameAr}`, taskEn: `Learned ${selectedShape.nameEn} shape`, icon: '💠' }); speak(language === 'ar' ? 'أحسنتم! لقد أكملت هذا الجزاء.' : 'Well done! You completed this part.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>
                                    <Button onClick={() => { playSound('tap'); setSelectedShapeId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
