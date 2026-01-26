import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, RotateCcw, Heart, CheckCircle2, Brain } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface BodyPart {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
    funFactAr: string;
    funFactEn: string;
}

export function BodyPartsScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const bodyParts: BodyPart[] = [
        {
            id: 'eyes',
            nameAr: 'العينان',
            nameEn: 'Eyes',
            emoji: '👀',
            color: 'from-blue-400 to-blue-600',
            descAr: 'نستخدم العينين لنرى العالم الجميل من حولنا.',
            descEn: 'We use our eyes to see the beautiful world around us.',
            funFactAr: 'العين تغمض آلاف المرات كل يوم لتحمي نفسها!',
            funFactEn: 'Your eyes blink thousands of times a day to stay clean!'
        },
        {
            id: 'ears',
            nameAr: 'الأذنان',
            nameEn: 'Ears',
            emoji: '👂',
            color: 'from-orange-400 to-yellow-500',
            descAr: 'نسمع بها أصوات العصافير والموسيقى وكلام الأهل.',
            descEn: 'We hear the sounds of birds, music, and our family speaking.',
            funFactAr: 'الأذنان تساعدنا أيضاً على التوازن أثناء الوقوف والمشي.',
            funFactEn: 'Your ears also help you stay balanced when you stand and walk.'
        },
        {
            id: 'nose',
            nameAr: 'الأنف',
            nameEn: 'Nose',
            emoji: '👃',
            color: 'from-pink-400 to-rose-500',
            descAr: 'نشم به رائحة الزهور والطعام الشهي.',
            descEn: 'We smell the scent of flowers and delicious food with our nose.',
            funFactAr: 'الأنف يستطيع تمييز آلاف الروائح المختلفة!',
            funFactEn: 'Your nose can remember thousands of different smells!'
        },
        {
            id: 'mouth',
            nameAr: 'الفم',
            nameEn: 'Mouth',
            emoji: '👄',
            color: 'from-red-400 to-red-600',
            descAr: 'نتكلم به، نأكل الطعام، ونبتسم للآخرين.',
            descEn: 'We speak, eat food, and smile at others with our mouth.',
            funFactAr: 'اللسان يساعدنا على تذوق الطعم الحلو والمالح.',
            funFactEn: 'Your tongue helps you taste sweet and salty things.'
        },
        {
            id: 'hands',
            nameAr: 'اليدان',
            nameEn: 'Hands',
            emoji: '🙌',
            color: 'from-indigo-400 to-purple-500',
            descAr: 'نمسك بها الأشياء، نرسم، ونحيي الأصدقاء.',
            descEn: 'We hold things, draw, and wave hello to friends.',
            funFactAr: 'لديك عشرة أصابع في يديك تساعدك على القيام بأشياء كثيرة.',
            funFactEn: 'You have ten fingers that help you do so many things.'
        },
        {
            id: 'feet',
            nameAr: 'القدمان',
            nameEn: 'Feet',
            emoji: '👣',
            color: 'from-green-400 to-teal-500',
            descAr: 'نمشي بها، نجري، ونقفز عالياً في الهواء.',
            descEn: 'We walk, run, and jump high in the air with our feet.',
            funFactAr: 'المشي والجري يجعل عظام قدميك قوية جداً!',
            funFactEn: 'Walking and running make the bones in your feet very strong!'
        },
        {
            id: 'heart',
            nameAr: 'القلب',
            nameEn: 'Heart',
            emoji: '❤️',
            color: 'from-red-500 to-pink-600',
            descAr: 'القلب هو مضخة قوية تدفع الدم لكل جسمنا.',
            descEn: 'The heart is a powerful pump that moves blood to your whole body.',
            funFactAr: 'قلبك ينبض دائماً حتى وأنت نائم!',
            funFactEn: 'Your heart beats all the time, even when you are asleep!'
        },
        {
            id: 'brain',
            nameAr: 'الدماغ',
            nameEn: 'Brain',
            emoji: '🧠',
            color: 'from-purple-400 to-indigo-600',
            descAr: 'الدماغ هو مركز التفكير والذكاء في جسمنا.',
            descEn: 'The brain is the center of thinking and intelligence in our body.',
            funFactAr: 'دماغك يعمل مثل الكمبيوتر الخارق الذي لا يتوقف!',
            funFactEn: 'Your brain works like a supercomputer that never stops!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedPart = bodyParts.find(p => p.id === selectedPartId);

    const handlePartSelect = (part: BodyPart) => {
        playSound('tap');
        const name = language === 'ar' ? part.nameAr : part.nameEn;
        speak(name, language);
        setSelectedPartId(part.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedPart) {
            const name = language === 'ar' ? selectedPart.nameAr : selectedPart.nameEn;
            const desc = language === 'ar' ? selectedPart.descAr : selectedPart.descEn;
            const fact = language === 'ar' ? selectedPart.funFactAr : selectedPart.funFactEn;
            speak(`${name}. ${desc}. ${language === 'ar' ? 'هل تعلم؟' : 'Did you know?'} ${fact}`, language);
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
                    <h1 className="text-5xl font-bold text-indigo-700 drop-shadow-lg">
                        {t.bodyParts} 🧒
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedPartId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bodyParts.map((part, index) => (
                            <motion.div key={part.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handlePartSelect(part)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${part.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {part.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? part.nameAr : part.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedPart && (
                            <Card className={`bg-gradient-to-br ${selectedPart.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedPart.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedPart.nameAr : selectedPart.nameEn}
                                    </h2>
                                </div>

                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
                                        <Brain className="size-10 text-indigo-600 flex-shrink-0" />
                                        <p className="text-2xl font-bold text-indigo-800 leading-relaxed">
                                            {language === 'ar' ? selectedPart.descAr : selectedPart.descEn}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4 bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-100">
                                        <Heart className="size-10 text-rose-500 flex-shrink-0 mt-1" />
                                        <div className="text-left">
                                            <h4 className="text-sm font-black text-yellow-700 uppercase tracking-widest mb-1">
                                                {language === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
                                            </h4>
                                            <p className="text-2xl font-bold text-yellow-800 italic leading-snug">
                                                {language === 'ar' ? selectedPart.funFactAr : selectedPart.funFactEn}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-indigo-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>

                                    <Button onClick={() => { playSound('success'); incrementProgress('body-parts'); speak(language === 'ar' ? 'أحسنتم! لقد أكملت هذا الجزاء.' : 'Well done! You completed this part.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>

                                    <Button onClick={() => { playSound('tap'); setSelectedPartId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
