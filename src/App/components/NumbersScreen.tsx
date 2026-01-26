import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface NumberItem {
    id: string;
    val: number;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
}

export function NumbersScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedNumId, setSelectedNumId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const numbers: NumberItem[] = [
        { id: '1', val: 1, nameAr: 'واحد', nameEn: 'One', emoji: '🍎', color: 'from-orange-400 to-red-500', descAr: 'الرقم واحد مثل تفاحة واحدة لذيذة.', descEn: 'Number one is like one delicious apple.' },
        { id: '2', val: 2, nameAr: 'اثنان', nameEn: 'Two', emoji: '🐥🐥', color: 'from-yellow-400 to-orange-500', descAr: 'الرقم اثنان مثل عصفورين صغيرين يغردان.', descEn: 'Number two is like two little birds chirping.' },
        { id: '3', val: 3, nameAr: 'ثلاثة', nameEn: 'Three', emoji: '🚗🚗🚗', color: 'from-green-400 to-emerald-500', descAr: 'الرقم ثلاثة مثل ثلاث سيارات سريعة الملونة.', descEn: 'Number three is like three fast colorful cars.' },
        { id: '4', val: 4, nameAr: 'أربعة', nameEn: 'Four', emoji: '🦋🦋🦋🦋', color: 'from-blue-400 to-cyan-500', descAr: 'الرقم أربعة مثل أربع فراشات تطير في الحديقة.', descEn: 'Number four is like four butterflies flying in the garden.' },
        { id: '5', val: 5, nameAr: 'خمسة', nameEn: 'Five', emoji: '🖐️', color: 'from-purple-400 to-pink-500', descAr: 'الرقم خمسة مثل أصابع اليد الواحدة.', descEn: 'Number five is like the fingers on one hand.' },
        { id: '6', val: 6, nameAr: 'ستة', nameEn: 'Six', emoji: '🐝🐝🐝🐝🐝🐝', color: 'from-amber-400 to-yellow-600', descAr: 'الرقم ستة مثل ست نحلات نشيطات يصنعن العسل.', descEn: 'Number six is like six busy bees making honey.' },
        { id: '7', val: 7, nameAr: 'سبعة', nameEn: 'Seven', emoji: '🌈', color: 'from-indigo-400 to-purple-600', descAr: 'الرقم سبعة مثل ألوان قوس قزح الجميلة.', descEn: 'Number seven is like the beautiful colors of the rainbow.' },
        { id: '8', val: 8, nameAr: 'ثمانية', nameEn: 'Eight', emoji: '🐙', color: 'from-pink-400 to-rose-600', descAr: 'الرقم ثمانية مثل أذرع الأخطبوط الثمانية في البحر.', descEn: 'Number eight is like the eight arms of an octopus in the sea.' },
        { id: '9', val: 9, nameAr: 'تسعة', nameEn: 'Nine', emoji: '🎈🎈🎈🎈🎈🎈🎈🎈🎈', color: 'from-cyan-400 to-blue-600', descAr: 'الرقم تسعة مثل تسع بالونات ملونة تطير في السماء.', descEn: 'Number nine is like nine colorful balloons flying in the sky.' },
        { id: '10', val: 10, nameAr: 'عشرة', nameEn: 'Ten', emoji: '👐', color: 'from-teal-400 to-green-600', descAr: 'الرقم عشرة مثل أصابع اليدين معاً.', descEn: 'Number ten is like the fingers on both hands together.' }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedNum = numbers.find(n => n.id === selectedNumId);

    const handleNumSelect = (num: NumberItem) => {
        playSound('tap');
        const name = language === 'ar' ? num.nameAr : num.nameEn;
        speak(`${num.val}. ${name}`, language);
        setSelectedNumId(num.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedNum) {
            const name = language === 'ar' ? selectedNum.nameAr : selectedNum.nameEn;
            const desc = language === 'ar' ? selectedNum.descAr : selectedNum.descEn;
            speak(`${selectedNum.val}. ${name}. ${desc}`, language);
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
                    <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg">
                        {language === 'ar' ? 'تعلم الأرقام' : 'Learn Numbers'} 🔢
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedNumId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {numbers.map((num, index) => (
                            <motion.div key={num.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleNumSelect(num)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${num.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <span className="text-7xl font-black text-white drop-shadow-md group-hover:scale-110 transition-transform">
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
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedNum && (
                            <Card className={`bg-gradient-to-br ${selectedNum.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] font-black text-white mb-6 drop-shadow-2xl leading-none z-10 relative italic">
                                        {selectedNum.val}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedNum.nameAr : selectedNum.nameEn}
                                    </h2>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex flex-wrap justify-center gap-4 text-6xl py-4">
                                        {selectedNum.emoji}
                                    </div>
                                    <div className="h-px bg-gray-200 w-1/2 mx-auto" />
                                    <p className="text-3xl font-bold text-gray-800 leading-relaxed text-center italic">
                                        "{language === 'ar' ? selectedNum.descAr : selectedNum.descEn}"
                                    </p>
                                </div>
                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-orange-700 hover:bg-orange-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-orange-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>
                                    <Button onClick={() => { playSound('success'); incrementProgress('numbers'); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>
                                    <Button onClick={() => { playSound('tap'); setSelectedNumId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
