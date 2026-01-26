import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, Palette, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface ColorItem {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    hex: string;
    colorClass: string;
    descAr: string;
    descEn: string;
}

export function ColorsScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const colors: ColorItem[] = [
        { id: 'red', nameAr: 'أحمر', nameEn: 'Red', emoji: '🍎', hex: '#ef4444', colorClass: 'from-red-400 to-red-600', descAr: 'اللون الأحمر مثل التفاحة الجميلة وقلب الحب.', descEn: 'Red is the color of a beautiful apple and a heart.' },
        { id: 'blue', nameAr: 'أزرق', nameEn: 'Blue', emoji: '🐳', hex: '#3b82f6', colorClass: 'from-blue-400 to-blue-600', descAr: 'اللون الأزرق مثل لون البحر والسماء الصافية.', descEn: 'Blue is the color of the sea and the clear sky.' },
        { id: 'green', nameAr: 'أخضر', nameEn: 'Green', emoji: '🌳', hex: '#22c55e', colorClass: 'from-green-400 to-green-600', descAr: 'اللون الأخضر مثل أوراق الأشجار والعشب في الحديقة.', descEn: 'Green is the color of tree leaves and garden grass.' },
        { id: 'yellow', nameAr: 'أصفر', nameEn: 'Yellow', emoji: '☀️', hex: '#eab308', colorClass: 'from-yellow-300 to-yellow-500', descAr: 'اللون الأصفر مثل قرص الشمس والموز اللذيذ.', descEn: 'Yellow is the color of the sun and delicious bananas.' },
        { id: 'orange', nameAr: 'برتقالي', nameEn: 'Orange', emoji: '🍊', hex: '#f97316', colorClass: 'from-orange-400 to-orange-600', descAr: 'اللون البرتقالي مثل فاكهة البرتقال والجزرة المقرمشة.', descEn: 'Orange is the color of oranges and crunchy carrots.' },
        { id: 'purple', nameAr: 'بنفسجي', nameEn: 'Purple', emoji: '🍇', hex: '#a855f7', colorClass: 'from-purple-400 to-purple-600', descAr: 'اللون البنفسجي مثل عنقود العنب وزهرة الخزامى.', descEn: 'Purple is the color of grapes and lavender flowers.' },
        { id: 'pink', nameAr: 'وردي', nameEn: 'Pink', emoji: '🌸', hex: '#ec4899', colorClass: 'from-pink-400 to-pink-600', descAr: 'اللون الوردي مثل لون الوردة الجميلة والحلوى.', descEn: 'Pink is the color of a beautiful rose and candy.' },
        { id: 'brown', nameAr: 'بني', nameEn: 'Brown', emoji: '🐻', hex: '#78350f', colorClass: 'from-amber-700 to-amber-900', descAr: 'اللون البني مثل لون الدب وجذع الشجرة.', descEn: 'Brown is the color of a bear and a tree trunk.' },
        { id: 'black', nameAr: 'أسود', nameEn: 'أسود', emoji: '🐈‍⬛', hex: '#000000', colorClass: 'from-gray-700 to-black', descAr: 'اللون الأسود مثل لون الليل والقطة السوداء.', descEn: 'Black is the color of the night and a black cat.' },
        { id: 'white', nameAr: 'أبيض', nameEn: 'White', emoji: '☁️', hex: '#ffffff', colorClass: 'from-slate-50 to-slate-200', descAr: 'اللون الأبيض مثل السحاب والثلج الأبيض.', descEn: 'White is the color of clouds and white snow.' }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedColor = colors.find(c => c.id === selectedColorId);

    const handleColorSelect = (colorOrId: ColorItem) => {
        playSound('tap');
        const name = language === 'ar' ? colorOrId.nameAr : colorOrId.nameEn;
        speak(name, language);
        setSelectedColorId(colorOrId.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedColor) {
            const name = language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn;
            const desc = language === 'ar' ? selectedColor.descAr : selectedColor.descEn;
            speak(`${name}. ${desc}`, language);
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
                    <h1 className="text-5xl font-bold text-pink-600 drop-shadow-lg">
                        {language === 'ar' ? 'تعلم الألوان' : 'Learn Colors'} 🎨
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedColorId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {colors.map((color, index) => (
                            <motion.div key={color.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleColorSelect(color)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${color.colorClass} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {color.emoji}
                                    </motion.div>
                                    <h3 className={`text-2xl font-bold ${color.id === 'white' ? 'text-gray-800' : 'text-white'} text-center drop-shadow-md`}>
                                        {language === 'ar' ? color.nameAr : color.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedColor && (
                            <Card className={`bg-gradient-to-br ${selectedColor.colorClass} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedColor.emoji}
                                    </motion.div>
                                    <h2 className={`text-6xl font-black ${selectedColor.id === 'white' ? 'text-gray-800' : 'text-white'} drop-shadow-lg mb-4`}>
                                        {language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}
                                    </h2>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-start gap-4 bg-pink-50 p-6 rounded-2xl border-2 border-pink-100">
                                        <Palette className="size-10 text-pink-600 flex-shrink-0 mt-1" />
                                        <p className="text-2xl font-bold text-pink-800 leading-relaxed italic">
                                            {language === 'ar' ? selectedColor.descAr : selectedColor.descEn}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white hover:bg-gray-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-gray-100" style={{ color: selectedColor.hex !== '#ffffff' ? selectedColor.hex : '#333' }}>
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>
                                    <Button onClick={() => { playSound('success'); incrementProgress('colors'); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>
                                    <Button onClick={() => { playSound('tap'); setSelectedColorId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
