import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Letter {
    id: string;
    charAr: string;
    charEn: string;
    wordAr: string;
    wordEn: string;
    emoji: string;
    color: string;
    descAr: string;
    descEn: string;
}

export function LettersScreen() {
    const { navigateTo, incrementProgress, unlockBadge, logActivity } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const letters: Letter[] = [
        { id: 'a', charAr: 'أ', charEn: 'A', wordAr: 'أسد', wordEn: 'Apple', emoji: '🍎', color: 'from-red-400 to-red-500', descAr: 'حرف الألف مثل أسد. هو أول الحروف.', descEn: 'A is for Apple. It is crunchy and sweet!' },
        { id: 'b', charAr: 'ب', charEn: 'B', wordAr: 'بطة', wordEn: 'Ball', emoji: '⚽', color: 'from-blue-400 to-blue-500', descAr: 'حرف الباء مثل بطة. الباء تحتها نقطة.', descEn: 'B is for Ball. Let\'s play together!' },
        { id: 'c', charAr: 'ت', charEn: 'C', wordAr: 'تفاحة', wordEn: 'Cat', emoji: '🐱', color: 'from-orange-400 to-yellow-500', descAr: 'حرف التاء مثل تفاحة. فوقها نقطتان.', descEn: 'C is for Cat. Cats say meow!' },
        { id: 'd', charAr: 'ث', charEn: 'D', wordAr: 'ثعلب', wordEn: 'Dog', emoji: '🐶', color: 'from-green-400 to-teal-500', descAr: 'حرف الثاء مثل ثعلب. فوقها ثلاث نقاط.', descEn: 'D is for Dog. Dogs are loyal friends.' },
        { id: 'e', charAr: 'ج', charEn: 'E', wordAr: 'جمل', wordEn: 'Elephant', emoji: '🐘', color: 'from-purple-400 to-indigo-500', descAr: 'حرف الجيم مثل جمل. في بطنها نقطة.', descEn: 'E is for Elephant. They have long trunks!' },
        { id: 'f', charAr: 'ح', charEn: 'F', wordAr: 'حصان', wordEn: 'Fish', emoji: '🐟', color: 'from-cyan-400 to-blue-500', descAr: 'حرف الحاء مثل حصان. ليس لها نقاط.', descEn: 'F is for Fish. Fish swim in the sea.' },
        { id: 'g', charAr: 'خ', charEn: 'G', wordAr: 'خروف', wordEn: 'Goat', emoji: '🐐', color: 'from-lime-400 to-green-500', descAr: 'حرف الخاء مثل خروف. فوقها نقطة.', descEn: 'G is for Goat. Goats love to climb.' },
        { id: 'h', charAr: 'د', charEn: 'H', wordAr: 'دب', wordEn: 'Horse', emoji: '🐴', color: 'from-amber-400 to-orange-500', descAr: 'حرف الدال مثل دب. شكلها مثل الزاوية.', descEn: 'H is for Horse. Horses run very fast!' },
        { id: 'i', charAr: 'ذ', charEn: 'I', wordAr: 'ذرة', wordEn: 'Ice Cream', emoji: '🍦', color: 'from-pink-300 to-rose-400', descAr: 'حرف الذال مثل ذرة. فوقها نقطة.', descEn: 'I is for Ice Cream. It is cold and tasty!' },
        { id: 'j', charAr: 'ر', charEn: 'J', wordAr: 'رمان', wordEn: 'Juice', emoji: '🧃', color: 'from-red-500 to-orange-600', descAr: 'حرف الراء مثل رمان. تتزحلق لأسفل.', descEn: 'J is for Juice. Drinking juice is healthy!' },
        { id: 'k', charAr: 'ز', charEn: 'K', wordAr: 'زرافة', wordEn: 'Kite', emoji: '🪁', color: 'from-yellow-400 to-orange-500', descAr: 'حرف الزاي مثل زرافة. فوقها نقطة.', descEn: 'K is for Kite. Kites fly high in the sky.' },
        { id: 'l', charAr: 'س', charEn: 'L', wordAr: 'سمكة', wordEn: 'Lion', emoji: '🦁', color: 'from-blue-500 to-indigo-600', descAr: 'حرف السين مثل سمكة. لها ثلاث أسنان.', descEn: 'L is for Lion. The king of the jungle!' },
        { id: 'm', charAr: 'ش', charEn: 'M', wordAr: 'شمس', wordEn: 'Monkey', emoji: '🐒', color: 'from-yellow-500 to-orange-600', descAr: 'حرف الشين مثل شمس. فوقها ثلاث نقاط.', descEn: 'M is for Monkey. Monkeys love bananas!' },
        { id: 'n', charAr: 'ص', charEn: 'N', wordAr: 'صقر', wordEn: 'Nest', emoji: '🪺', color: 'from-gray-400 to-gray-600', descAr: 'حرف الصاد مثل صقر. طائر قوي.', descEn: 'N is for Nest. Birds live in nests.' },
        { id: 'o', charAr: 'ض', charEn: 'O', wordAr: 'ضفدع', wordEn: 'Orange', emoji: '🍊', color: 'from-orange-400 to-red-500', descAr: 'حرف الضاد مثل ضفدع. فوقها نقطة.', descEn: 'O is for Orange. Oranges are full of Vitamin C!' },
        { id: 'p', charAr: 'ط', charEn: 'P', wordAr: 'طائرة', wordEn: 'Panda', emoji: '🐼', color: 'from-slate-200 to-slate-400', descAr: 'حرف الطاء مثل طائرة. تطير في السماء.', descEn: 'P is for Panda. Pandas are black and white.' },
        { id: 'q', charAr: 'ظ', charEn: 'Q', wordAr: 'ظرف', wordEn: 'Queen', emoji: '👸', color: 'from-purple-500 to-pink-600', descAr: 'حرف الظاء مثل ظرف. نضع فيه الرسالة.', descEn: 'Q is for Queen. She wears a golden crown.' },
        { id: 'r', charAr: 'ع', charEn: 'R', wordAr: 'عين', wordEn: 'Rabbit', emoji: '🐰', color: 'from-pink-200 to-pink-400', descAr: 'حرف العين مثل عين. نرى بها الأشياء.', descEn: 'R is for Rabbit. Rabbits have long ears.' },
        { id: 's', charAr: 'غ', charEn: 'S', wordAr: 'غزال', wordEn: 'Sun', emoji: '☀️', color: 'from-yellow-400 to-amber-500', descAr: 'حرف الغين مثل غزال. فوقها نقطة.', descEn: 'S is for Sun. The sun makes the day bright.' },
        { id: 't', charAr: 'ف', charEn: 'T', wordAr: 'فيل', wordEn: 'Tiger', emoji: '🐯', color: 'from-orange-500 to-red-600', descAr: 'حرف الفاء مثل فيل. فوقها نقطة واحدة.', descEn: 'T is for Tiger. Tigers have black stripes.' },
        { id: 'u', charAr: 'ق', charEn: 'U', wordAr: 'قرد', wordEn: 'Umbrella', emoji: '☂️', color: 'from-purple-400 to-indigo-500', descAr: 'حرف القاف مثل قرد. فوقها نقطتان.', descEn: 'U is for Umbrella. It keeps us dry from rain.' },
        { id: 'v', charAr: 'ك', charEn: 'V', wordAr: 'كلب', wordEn: 'Van', emoji: '🚐', color: 'from-blue-300 to-blue-500', descAr: 'حرف الكاف مثل كلب. صديق وفي.', descEn: 'V is for Van. Let\'s go for a drive!' },
        { id: 'w', charAr: 'ل', charEn: 'W', wordAr: 'ليمون', wordEn: 'Watch', emoji: '⌚', color: 'from-yellow-300 to-yellow-500', descAr: 'حرف اللام مثل ليمون. طعمه حامض.', descEn: 'W is for Watch. It tells us the time.' },
        { id: 'x', charAr: 'م', charEn: 'X', wordAr: 'موز', wordEn: 'X-ray', emoji: '🩻', color: 'from-cyan-200 to-cyan-400', descAr: 'حرف الميم مثل موز. لونه أصفر لذيذ.', descEn: 'X is for X-ray. It sees our bones!' },
        { id: 'y', charAr: 'ن', charEn: 'Y', wordAr: 'نمر', wordEn: 'Yo-yo', emoji: '🪀', color: 'from-purple-500 to-pink-600', descAr: 'حرف النون مثل نمر. فوقها نقطة.', descEn: 'Y is for Yo-yo. It goes up and down.' },
        { id: 'z', charAr: 'هـ', charEn: 'Z', wordAr: 'هلال', wordEn: 'Zebra', emoji: '🦓', color: 'from-gray-300 to-gray-500', descAr: 'حرف الهاء مثل هلال. نراه في السماء.', descEn: 'Z is for Zebra. Zebras are very cool!' },
        { id: 'end1', charAr: 'و', charEn: '!', wordAr: 'وردة', wordEn: 'Wow', emoji: '🌹', color: 'from-red-400 to-rose-500', descAr: 'حرف الواو مثل وردة. رائحتها جميلة.', descEn: 'W is for Wow! Learning is amazing!' },
        { id: 'end2', charAr: 'ي', charEn: '!', wordAr: 'يد', wordEn: 'Yay', emoji: '👋', color: 'from-blue-400 to-cyan-500', descAr: 'حرف الياء مثل يد. أسفلها نقطتان.', descEn: 'Y is for Yay! We finished the letters!' }
    ];

    const handleComplete = () => {
        playSound('success');
        incrementProgress('letters');
        unlockBadge('scholar');
        logActivity({
            type: 'learning',
            taskAr: 'تعلم الأحرف الأبجدية',
            taskEn: 'Learning the Alphabet',
            icon: '📝'
        });
        speak(language === 'ar' ? 'أحسنت! لقد تعلمت الأحرف اليوم' : 'Well done! You learned the letters today', language);
        setTimeout(() => navigateTo('child-mode'), 2000);
    };

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedLetter = letters.find(l => l.id === selectedLetterId);

    const handleLetterSelect = (letter: Letter) => {
        playSound('tap');
        const char = language === 'ar' ? letter.charAr : letter.charEn;
        const word = language === 'ar' ? letter.wordAr : letter.wordEn;
        speak(`${char}. ${word}`, language);
        setSelectedLetterId(letter.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedLetter) {
            const char = language === 'ar' ? selectedLetter.charAr : selectedLetter.charEn;
            const word = language === 'ar' ? selectedLetter.wordAr : selectedLetter.wordEn;
            const desc = language === 'ar' ? selectedLetter.descAr : selectedLetter.descEn;
            speak(`${char}. ${word}. ${desc}`, language);
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
                        {language === 'ar' ? 'تعلم الحروف' : 'Learn Letters'} 📝
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedLetterId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {letters.map((letter, index) => (
                            <motion.div key={letter.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleLetterSelect(letter)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${letter.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-4 border-4 border-white group`}>
                                    <span className="text-6xl font-black text-white drop-shadow-md group-hover:scale-110 transition-transform">
                                        {language === 'ar' ? letter.charAr : letter.charEn}
                                    </span>
                                    <h3 className="text-lg font-bold text-white/90 text-center drop-shadow-md mt-2">
                                        {language === 'ar' ? letter.wordAr : letter.wordEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedLetter && (
                            <Card className={`bg-gradient-to-br ${selectedLetter.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] font-black text-white mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {language === 'ar' ? selectedLetter.charAr : selectedLetter.charEn}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4 flex items-center justify-center gap-4">
                                        <span>{selectedLetter.emoji}</span>
                                        <span>{language === 'ar' ? selectedLetter.wordAr : selectedLetter.wordEn}</span>
                                    </h2>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-start gap-4 bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 justify-center">
                                        <p className="text-3xl font-bold text-blue-800 leading-relaxed text-center italic">
                                            "{language === 'ar' ? selectedLetter.descAr : selectedLetter.descEn}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-blue-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>
                                    <Button onClick={handleComplete} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>
                                    <Button onClick={() => { playSound('tap'); setSelectedLetterId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
