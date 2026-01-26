import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface FoodItem {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
    benefitAr: string;
    benefitEn: string;
}

export function FruitsScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const foods: FoodItem[] = [
        {
            id: 'apple',
            nameAr: 'تفاحة',
            nameEn: 'Apple',
            emoji: '🍎',
            color: 'from-red-400 to-red-600',
            descAr: 'التفاح فاكهة مقرمشة ولذيذة تأتي بألوان مختلفة.',
            descEn: 'Apples are crunchy and delicious fruits that come in different colors.',
            benefitAr: 'التفاح يقوي الأسنان ويجعلك ذكياً!',
            benefitEn: 'Apples strengthen your teeth and make you smart!'
        },
        {
            id: 'banana',
            nameAr: 'موز',
            nameEn: 'Banana',
            emoji: '🍌',
            color: 'from-yellow-300 to-yellow-500',
            descAr: 'الموز فاكهة طرية وسهلة الأكل ولونها أقرار زاهي.',
            descEn: 'Bananas are soft, easy to eat, and have a bright yellow color.',
            benefitAr: 'الموز يعطيك طاقة كبيرة لتلعب وتجري!',
            benefitEn: 'Bananas give you lots of energy to play and run!'
        },
        {
            id: 'orange',
            nameAr: 'برتقال',
            nameEn: 'Orange',
            emoji: '🍊',
            color: 'from-orange-400 to-orange-600',
            descAr: 'البرتقال ملئ بالعصير الطازج ومنعش جداً.',
            descEn: 'Oranges are full of fresh juice and very refreshing.',
            benefitAr: 'البرتقال يحميك من الزكام ويقوي جسمك!',
            benefitEn: 'Oranges protect you from colds and strengthen your body!'
        },
        {
            id: 'carrot',
            nameAr: 'جزر',
            nameEn: 'Carrot',
            emoji: '🥕',
            color: 'from-orange-500 to-red-500',
            descAr: 'الجزر من الخضروات المفيدة التي يحبها الأرنب أيضاً.',
            descEn: 'Carrots are healthy vegetables that bunnies love too.',
            benefitAr: 'الجزر يقوي نظرك ويجعلك ترى بوضوح!',
            benefitEn: 'Carrots improve your eyesight and help you see clearly!'
        },
        {
            id: 'strawberry',
            nameAr: 'فراولة',
            nameEn: 'Strawberry',
            emoji: '🍓',
            color: 'from-pink-400 to-red-600',
            descAr: 'الفراولة فاكهة حمراء صغيرة وجميلة وطعمها رائع.',
            descEn: 'Strawberries are small, beautiful red fruits with a great taste.',
            benefitAr: 'الفراولة مفيدة جداً لقلبك الصغير!',
            benefitEn: 'Strawberries are very good for your little heart!'
        },
        {
            id: 'grapes',
            nameAr: 'عنب',
            nameEn: 'Grapes',
            emoji: '🍇',
            color: 'from-purple-400 to-indigo-500',
            descAr: 'العنب يأتي في عناقيد صغيرة ولذيذة.',
            descEn: 'Grapes come in small and delicious clusters.',
            benefitAr: 'العنب يجعلك قوياً ونشيطاً كل اليوم!',
            benefitEn: 'Grapes make you strong and active all day long!'
        },
        {
            id: 'watermelon',
            nameAr: 'بطيخ',
            nameEn: 'Watermelon',
            emoji: '🍉',
            color: 'from-red-500 to-green-600',
            descAr: 'البطيخ كبير وبارد ويشترك فيه كل العائلة.',
            descEn: 'Watermelon is big, cool, and shared by the whole family.',
            benefitAr: 'البطيخ يرطب جسمك في أيام الصيف الحارة!',
            benefitEn: 'Watermelon hydrates your body on hot summer days!'
        },
        {
            id: 'broccoli',
            nameAr: 'بروكلي',
            nameEn: 'Broccoli',
            emoji: '🥦',
            color: 'from-green-500 to-emerald-700',
            descAr: 'البروكلي يشبه الشجرة الصغيرة وهو مفيد جداً.',
            descEn: 'Broccoli looks like a little tree and is very healthy.',
            benefitAr: 'البروكلي يجعلك بطلاً قوياً ولديك عضلات!',
            benefitEn: 'Broccoli makes you a strong hero with muscles!'
        },
        {
            id: 'corn',
            nameAr: 'ذرة',
            nameEn: 'Corn',
            emoji: '🌽',
            color: 'from-yellow-400 to-amber-500',
            descAr: 'الذرة الصفراء طعمها لذيذ عندما تكون مشوية.',
            descEn: 'Yellow corn tastes delicious when it is grilled or boiled.',
            benefitAr: 'الذرة تساعد جسمك على النمو بسرعة!',
            benefitEn: 'Corn helps your body grow fast!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedItem = foods.find(f => f.id === selectedItemId);

    const handleItemSelect = (item: FoodItem) => {
        playSound('tap');
        const name = language === 'ar' ? item.nameAr : item.nameEn;
        speak(name, language);
        setSelectedItemId(item.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedItem) {
            const name = language === 'ar' ? selectedItem.nameAr : selectedItem.nameEn;
            const desc = language === 'ar' ? selectedItem.descAr : selectedItem.descEn;
            const benefit = language === 'ar' ? selectedItem.benefitAr : selectedItem.benefitEn;
            speak(`${name}. ${desc}. ${benefit}`, language);
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
                    <h1 className="text-5xl font-bold text-red-600 drop-shadow-lg">
                        {t.fruits} 🍎
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedItemId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {foods.map((food, index) => (
                            <motion.div key={food.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleItemSelect(food)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${food.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {food.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? food.nameAr : food.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedItem && (
                            <Card className={`bg-gradient-to-br ${selectedItem.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, y: isPlaying ? [0, -20, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedItem.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedItem.nameAr : selectedItem.nameEn}
                                    </h2>
                                </div>

                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="prose prose-lg max-w-none text-center">
                                        <p className="text-2xl font-bold text-gray-800 leading-relaxed italic">
                                            {language === 'ar' ? selectedItem.descAr : selectedItem.descEn}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-red-50 p-6 rounded-2xl border-2 border-red-100 justify-center">
                                        <Heart className="size-10 text-red-500 fill-red-500 animate-pulse flex-shrink-0" />
                                        <p className="text-2xl font-black text-red-600">
                                            {language === 'ar' ? selectedItem.benefitAr : selectedItem.benefitEn}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-red-600 hover:bg-red-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-red-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>

                                    <Button onClick={() => { playSound('success'); incrementProgress('fruits'); speak(language === 'ar' ? 'أحسنتم! لقد أكملت هذا الجزاء.' : 'Well done! You completed this part.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>

                                    <Button onClick={() => { playSound('tap'); setSelectedItemId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
