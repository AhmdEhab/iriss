import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, RotateCcw, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Animal {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji: string;
    color: string;
    factAr: string;
    factEn: string;
    soundDescAr: string;
    soundDescEn: string;
}

export function AnimalsScreen() {
    const { navigateTo, incrementProgress, unlockBadge, logActivity } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const animals: Animal[] = [
        {
            id: 'lion',
            nameAr: 'أسد',
            nameEn: 'Lion',
            emoji: '🦁',
            color: 'from-orange-400 to-yellow-500',
            factAr: 'الأسد هو ملك الغابة، وهو قوي جداً ويعيش في مجموعات كبيرة.',
            factEn: 'The lion is the king of the jungle. It is very strong and lives in big groups.',
            soundDescAr: 'صوت الأسد يسمى زئير، وهو عالٍ جداً!',
            soundDescEn: 'The sound of a lion is called a roar, and it is very loud!'
        },
        {
            id: 'elephant',
            nameAr: 'فيل',
            nameEn: 'Elephant',
            emoji: '🐘',
            color: 'from-blue-300 to-slate-400',
            factAr: 'الفيل هو أكبر حيوان يعيش على الأرض، وله خرطوم طويل يستخدمه لشرب الماء.',
            factEn: 'The elephant is the largest land animal. It has a long trunk used for drinking water.',
            soundDescAr: 'صوت الفيل يسمى نهيم، وهو قوي ومميز.',
            soundDescEn: 'The sound of an elephant is called a trumpet, and it is powerful and unique.'
        },
        {
            id: 'giraffe',
            nameAr: 'زرافة',
            nameEn: 'Giraffe',
            emoji: '🦒',
            color: 'from-yellow-300 to-orange-400',
            factAr: 'الزرافة هي أطول حيوان في العالم، ورقبتها الطويلة تساعدها على أكل أوراق الأشجار العالية.',
            factEn: 'The giraffe is the tallest animal in the world. Its long neck helps it eat leaves from high trees.',
            soundDescAr: 'الزرافات هادئة جداً، لكنها تصدر أصواتاً خفيفة للتواصل.',
            soundDescEn: 'Giraffes are very quiet, but they make soft sounds to communicate.'
        },
        {
            id: 'monkey',
            nameAr: 'قرد',
            nameEn: 'Monkey',
            emoji: '🐒',
            color: 'from-amber-600 to-yellow-700',
            factAr: 'القرد حيوان ذكي ونشيط، يحب التسلق على الأشجار وأكل الموز.',
            factEn: 'The monkey is a smart and active animal. It loves climbing trees and eating bananas.',
            soundDescAr: 'القرد يصدر أصواتاً مضحكة وسريعة للتحدث مع أصدقائه.',
            soundDescEn: 'The monkey makes funny and fast sounds to talk to its friends.'
        },
        {
            id: 'cat',
            nameAr: 'قطة',
            nameEn: 'Cat',
            emoji: '🐱',
            color: 'from-gray-200 to-gray-400',
            factAr: 'القطة حيوان أليف وجميل، تحب اللعب والنوم في مكان دافئ.',
            factEn: 'The cat is a beautiful pet. It loves playing and sleeping in a warm place.',
            soundDescAr: 'صوت القطة يسمى مواء، وهي تقول: مياو مياو!',
            soundDescEn: 'The sound of a cat is called a meow. It says: Meow Meow!'
        },
        {
            id: 'dog',
            nameAr: 'كلب',
            nameEn: 'Dog',
            emoji: '🐶',
            color: 'from-orange-200 to-amber-300',
            factAr: 'الكلب هو صديق الإنسان الوفي، وهو ذكي ويحب اللعب مع الأطفال.',
            factEn: 'The dog is a loyal friend to humans. It is smart and loves playing with children.',
            soundDescAr: 'صوت الكلب يسمى نباح، وهو يقول: هو هو!',
            soundDescEn: 'The sound of a dog is called a bark. It says: Woof Woof!'
        },
        {
            id: 'panda',
            nameAr: 'باندا',
            nameEn: 'Panda',
            emoji: '🐼',
            color: 'from-slate-100 to-slate-400',
            factAr: 'الباندا العملاقة تحب أكل الخيزران كثيراً، وهي تعيش في غابات الصين.',
            factEn: 'Giant pandas love eating bamboo very much, and they live in the forests of China.',
            soundDescAr: 'الباندا تصدر أصواتاً هادئة مثل الصفير أو الزقزقة.',
            soundDescEn: 'Pandas make quiet sounds like chirps or honks.'
        },
        {
            id: 'tiger',
            nameAr: 'نمر',
            nameEn: 'Tiger',
            emoji: '🐯',
            color: 'from-orange-500 to-orange-700',
            factAr: 'النمر هو أكبر قط في العالم، وله خطوط سوداء جميلة على جسمه البرتقالي.',
            factEn: 'The tiger is the largest cat in the world, and it has beautiful black stripes on its orange body.',
            soundDescAr: 'صوت النمر يسمى زئير، وهو مخيف وقوي جداً.',
            soundDescEn: 'The sound of a tiger is called a roar, and it is very scary and strong.'
        },
        {
            id: 'zebra',
            nameAr: 'حمار وحشي',
            nameEn: 'Zebra',
            emoji: '🦓',
            color: 'from-gray-100 to-gray-500',
            factAr: 'الحمار الوحشي يتميز بخطوطه البيضاء والسوداء التي تحميه من الحشرات.',
            factEn: 'The zebra is famous for its black and white stripes which protect it from insects.',
            soundDescAr: 'صوت الحمار الوحشي يشبه صهيل الحصان القوي.',
            soundDescEn: 'The sound of a zebra is similar to the strong neighing of a horse.'
        },
        {
            id: 'rabbit',
            nameAr: 'أرنب',
            nameEn: 'Rabbit',
            emoji: '🐰',
            color: 'from-pink-100 to-rose-200',
            factAr: 'الأرنب حيوان سريع جداً وله أذنان طويلتان وقويتان ليسمع الأصوات البعيدة.',
            factEn: 'The rabbit is a very fast animal with long, strong ears to hear distant sounds.',
            soundDescAr: 'الأرانب حيوانات صامتة غالباً، لكنها تخبط بأقدامها لتحذير أصدقائها.',
            soundDescEn: 'Rabbits are usually silent animals, but they thump their feet to warn their friends.'
        },
        {
            id: 'owl',
            nameAr: 'بومة',
            nameEn: 'Owl',
            emoji: '🦉',
            color: 'from-amber-800 to-amber-950',
            factAr: 'البومة تستطيع رؤية الأشياء في الليل بوضوح شديد وتستطيع لف رقبتها بشكل كامل.',
            factEn: 'The owl can see things clearly at night and can turn its neck almost all the way around.',
            soundDescAr: 'صوت البومة يسمى نعيق، وهي تنشط في الليل فقط.',
            soundDescEn: 'The sound of an owl is called a hoot, and they are active only at night.'
        },
        {
            id: 'bee',
            nameAr: 'نحلة',
            nameEn: 'Bee',
            emoji: '🐝',
            color: 'from-yellow-400 to-yellow-600',
            factAr: 'النحلة حشرة مجتهدة جداً، تصنع لنا العسل اللذيذ والمفيد.',
            factEn: 'The bee is a very hardworking insect that makes delicious and healthy honey for us.',
            soundDescAr: 'صوت النحلة يسمى طنين، وهي تقول: بززززز!',
            soundDescEn: 'The sound of a bee is called a buzz. It says: Buzzzzz!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedAnimal = animals.find(a => a.id === selectedAnimalId);

    const handleAnimalSelect = (animal: Animal) => {
        playSound('tap');
        const intro = language === 'ar' ? `هذا هو ال${animal.nameAr}` : `This is the ${animal.nameEn}`;
        speak(intro, language);
        setSelectedAnimalId(animal.id);
        setIsPlaying(false);
    };

    const handlePlayInfo = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedAnimal) {
            const info = language === 'ar'
                ? `${selectedAnimal.nameAr}. ${selectedAnimal.soundDescAr}. ${selectedAnimal.factAr}`
                : `${selectedAnimal.nameEn}. ${selectedAnimal.soundDescEn}. ${selectedAnimal.factEn}`;
            speak(info, language);
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

                    <h1 className="text-5xl font-bold text-green-700 drop-shadow-lg">
                        {language === 'ar' ? 'تعلم الحيوانات' : 'Learn Animals'} 🦁
                    </h1>

                    <div className="w-24" />
                </div>

                {!selectedAnimalId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {animals.map((animal, index) => (
                            <motion.div key={animal.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.05, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleAnimalSelect(animal)} className={`w-full aspect-square rounded-[2rem] shadow-2xl bg-gradient-to-br ${animal.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6 border-4 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 drop-shadow-lg">
                                        {animal.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-md">
                                        {language === 'ar' ? animal.nameAr : animal.nameEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedAnimal && (
                            <Card className={`bg-gradient-to-br ${selectedAnimal.color} shadow-2xl overflow-hidden rounded-[3rem] border-8 border-white`}>
                                <div className="p-8 text-center bg-white/10 relative overflow-hidden">
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl leading-none z-10 relative">
                                        {selectedAnimal.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg mb-4">
                                        {language === 'ar' ? selectedAnimal.nameAr : selectedAnimal.nameEn}
                                    </h2>
                                </div>

                                <div className="bg-white/95 backdrop-blur-sm p-8 m-8 rounded-3xl shadow-lg border-4 border-white/50 space-y-8">
                                    <div className="flex items-center gap-4 bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                                        <Volume2 className="size-10 text-green-600 flex-shrink-0" />
                                        <p className="text-2xl font-bold text-green-800 leading-relaxed italic">
                                            {language === 'ar' ? selectedAnimal.soundDescAr : selectedAnimal.soundDescEn}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4 bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                                        <Info className="size-10 text-blue-600 flex-shrink-0 mt-1" />
                                        <p className="text-2xl font-bold text-blue-800 leading-relaxed">
                                            {language === 'ar' ? selectedAnimal.factAr : selectedAnimal.factEn}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4">
                                    <Button onClick={handlePlayInfo} size="lg" className="bg-white text-green-700 hover:bg-green-50 text-2xl px-12 py-10 rounded-full shadow-xl border-4 border-green-100">
                                        {isPlaying ? <><Pause className="size-8 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'استمع' : 'Listen'}</>}
                                    </Button>

                                    <Button onClick={() => { playSound('success'); incrementProgress('animals'); unlockBadge('explorer'); logActivity({ type: 'learning', taskAr: `تعرف على ال${selectedAnimal.nameAr}`, taskEn: `Learned about ${selectedAnimal.nameEn}`, icon: selectedAnimal.emoji }); speak(language === 'ar' ? 'أحسنتم! لقد أكملت هذا القسم.' : 'Well done! You completed this section.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                        <CheckCircle2 className="size-8 me-3" />
                                        {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                    </Button>

                                    <Button onClick={() => { playSound('tap'); setSelectedAnimalId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100">
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
