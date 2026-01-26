import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Emotion {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
    adviceAr: string;
    adviceEn: string;
}

export function EmotionsScreen() {
    const { navigateTo, incrementProgress, logActivity } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const emotions: Emotion[] = [
        {
            id: 'happy',
            nameAr: 'سعيد',
            nameEn: 'Happy',
            emoji: '😊',
            color: 'from-yellow-300 to-yellow-500',
            descAr: 'نشعر بالسعادة عندما نلعب مع أصدقائنا أو نحصل على هدية جميلة.',
            descEn: 'We feel happy when we play with our friends or get a nice gift.',
            adviceAr: 'الابتسامة تجعل يومك ويوم الآخرين أجمل! استمر في نشر الفرح.',
            adviceEn: 'A smile makes your day and others\' days better! Keep spreading joy.'
        },
        {
            id: 'sad',
            nameAr: 'حزين',
            nameEn: 'Sad',
            emoji: '😢',
            color: 'from-blue-300 to-blue-500',
            descAr: 'نشعر بالحزن أحياناً عندما نفقد شيئاً نحبه أو نبتعد عن شخص عزيز.',
            descEn: 'We sometimes feel sad when we lose something we love or are away from someone dear.',
            adviceAr: 'لا بأس أن تحزن قليلاً. تحدث مع ماما أو بابا، وسوف تشعر بتحسن كبير.',
            adviceEn: 'It\'s okay to be sad for a while. Talk to Mom or Dad, and you will feel much better.'
        },
        {
            id: 'angry',
            nameAr: 'غاضب',
            nameEn: 'Angry',
            emoji: '😠',
            color: 'from-red-400 to-red-600',
            descAr: 'نشعر بالغضب عندما لا تسير الأمور كما نريد أو نشعر بالظلم.',
            descEn: 'We feel angry when things don\'t go our way or we feel mistreated.',
            adviceAr: 'خذ نفساً عميقاً، وعد من 1 إلى 10 لتهدأ. الغضب يذهب بالهدوء.',
            adviceEn: 'Take a deep breath and count to 10 to calm down. Anger goes away with calmness.'
        },
        {
            id: 'excited',
            nameAr: 'متحمس',
            nameEn: 'Excited',
            emoji: '🤩',
            color: 'from-orange-400 to-pink-500',
            descAr: 'نشعر بالحماس عندما ننتظر شيئاً رائعاً سيحدث قريباً!',
            descEn: 'We feel excited when we are waiting for something wonderful to happen soon!',
            adviceAr: 'طاقة الحماس رائعة! استخدمها لتجربة أشياء جديدة وممتعة.',
            adviceEn: 'Excitement energy is great! Use it to try new and fun things.'
        },
        {
            id: 'surprised',
            nameAr: 'متفاجئ',
            nameEn: 'Surprised',
            emoji: '😲',
            color: 'from-purple-400 to-indigo-500',
            descAr: 'نشعر بالمفاجأة عندما يحدث شيء لم نكن نتوقعه أبداً.',
            descEn: 'We feel surprised when something happens that we didn\'t expect at all.',
            adviceAr: 'المفاجآت تجعل الحياة ممتعة ومبهرة. يالها من مفاجأة جميلة!',
            adviceEn: 'Surprises make life fun and dazzling. What a beautiful surprise!'
        },
        {
            id: 'calm',
            nameAr: 'هادئ',
            nameEn: 'Calm',
            emoji: '😌',
            color: 'from-green-300 to-teal-500',
            descAr: 'نشعر بالهدوء عندما نجلس في مكان هادئ أو نسمع موسيقى لطيفة.',
            descEn: 'We feel calm when we sit in a quiet place or listen to gentle music.',
            adviceAr: 'الهدوء يساعد عقلك على التفكير والتركيز بشكل أفضل.',
            adviceEn: 'Calmness helps your brain think and focus better.'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedEmotion = emotions.find(e => e.id === selectedEmotionId);

    const handleEmotionSelect = (emotion: Emotion) => {
        playSound('tap');
        const name = language === 'ar' ? emotion.nameAr : emotion.nameEn;
        speak(name, language);
        setSelectedEmotionId(emotion.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedEmotion) {
            const name = language === 'ar' ? selectedEmotion.nameAr : selectedEmotion.nameEn;
            const desc = language === 'ar' ? selectedEmotion.descAr : selectedEmotion.descEn;
            const advice = language === 'ar' ? selectedEmotion.adviceAr : selectedEmotion.adviceEn;
            speak(`${name}. ${desc}. ${advice}`, language);
            setIsPlaying(true);
            playSound('success');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 p-4">
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className="text-5xl font-bold text-pink-600 drop-shadow-lg">
                        {t.emotions} ✨
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedEmotionId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {emotions.map((emotion, index) => (
                            <motion.div key={emotion.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleEmotionSelect(emotion)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${emotion.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {emotion.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? emotion.nameAr : emotion.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedEmotion && (
                            <Card className={`bg-gradient-to-br ${selectedEmotion.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedEmotion.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedEmotion.nameAr : selectedEmotion.nameEn}
                                    </h2>
                                </div>

                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="prose prose-lg max-w-none text-center">
                                        <p className="text-3xl font-bold text-gray-800 leading-relaxed italic">
                                            "{language === 'ar' ? selectedEmotion.descAr : selectedEmotion.descEn}"
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4 bg-pink-50 p-6 rounded-2xl border-2 border-pink-100 shadow-inner">
                                        <Heart className="size-10 text-pink-500 fill-pink-500 flex-shrink-0 mt-1" />
                                        <div className="text-left">
                                            <h4 className="text-sm font-black text-pink-700 uppercase tracking-widest mb-1">
                                                {language === 'ar' ? 'نصيحة ذكية' : 'Smart Advice'}
                                            </h4>
                                            <p className="text-2xl font-bold text-pink-800 italic leading-snug">
                                                {language === 'ar' ? selectedEmotion.adviceAr : selectedEmotion.adviceEn}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-pink-600 hover:bg-pink-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-pink-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>

                                    <Button onClick={() => { playSound('success'); incrementProgress('emotions'); logActivity({ type: 'emotion', taskAr: `تعرف على شعور ${selectedEmotion.nameAr}`, taskEn: `Learned about ${selectedEmotion.nameEn} emotion`, icon: selectedEmotion.emoji }); speak(language === 'ar' ? 'أحسنتم! لقد أكملت هذا الجزاء.' : 'Well done! You completed this part.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>

                                    <Button onClick={() => { playSound('tap'); setSelectedEmotionId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
