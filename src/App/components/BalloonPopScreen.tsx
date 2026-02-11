import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play, Pause, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { BackButton } from './ui/BackButton';

interface Balloon {
    id: number;
    x: number;
    color: string;
    speed: number;
    size: number;
    label: string;
}

const BALLOON_COLORS = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-purple-500',
    'bg-orange-500'
];

export function BalloonPopScreen() {
    const { navigateTo, unlockBadge, incrementProgress, activeRules } = useApp();
    const { playSound, speak } = useAudio();
    const { t, language } = useLanguage();

    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isGameOver, setIsGameOver] = useState(false);

    const spawnBalloon = useCallback(() => {
        const id = Date.now();
        const x = Math.random() * 80 + 10;
        const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const speed = 5 + Math.random() * 5;

        // Scale size based on syndrome rules (e.g., larger for Down Syndrome)
        const baseSize = 60 + Math.random() * 40;
        const size = baseSize * (activeRules?.gameAdjustments?.hitboxScaling || 1);

        const label = Math.random() > 0.5
            ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
            : Math.floor(Math.random() * 10).toString();

        setBalloons(prev => [...prev, { id, x, color, speed, size, label }]);
    }, [activeRules]);

    useEffect(() => {
        let spawnInterval: NodeJS.Timeout;
        let timerInterval: NodeJS.Timeout;

        if (gameStarted && !isGameOver) {
            // Slower spawning for low-arousal sensory profiles
            const spawnRate = activeRules?.sensoryProfile === 'low-arousal' ? 1500 : 1000;
            spawnInterval = setInterval(spawnBalloon, spawnRate);
            timerInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(spawnInterval);
            clearInterval(timerInterval);
        };
    }, [gameStarted, isGameOver, spawnBalloon, activeRules]);

    const handlePop = (id: number, label: string) => {
        // Different sound for different syndromes
        if (activeRules?.gameAdjustments?.balloonPopStyle === 'dissolve') {
            playSound('tap'); // Soft tap for dissolve
        } else {
            playSound('tap'); // Default pop
        }

        setScore(prev => prev + 10);
        setBalloons(prev => prev.filter(b => b.id !== id));
        speak(label, language);
    };

    const handleStart = () => {
        setScore(0);
        setTimeLeft(30);
        setIsGameOver(false);
        setGameStarted(true);
        setBalloons([]);
        playSound('celebration');
        speak(language === 'ar' ? 'أمسك البالونات!' : 'Pop the balloons!', language);
    };

    const handleBack = () => {
        playSound('tap');
        navigateTo('games-hub');
    };

    useEffect(() => {
        if (isGameOver && score >= 200) {
            unlockBadge('balloon-master');
            incrementProgress('games-hub');
            playSound('celebration');
        }
    }, [isGameOver, score, unlockBadge, playSound, incrementProgress]);

    return (
        <div className="h-screen w-full bg-gradient-to-b from-blue-300 via-sky-100 to-white overflow-hidden relative touch-none">
            <BackButton onClick={handleBack} />
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
                <div className="w-24" />

                <div className="bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full flex gap-8 items-center shadow-lg border-2 border-white/50">
                    <div className="text-center">
                        <p className="text-xs font-black text-blue-600 uppercase">{language === 'ar' ? 'النقاط' : 'Score'}</p>
                        <p className="text-3xl font-black text-blue-800">{score}</p>
                    </div>
                    <div className="h-10 w-px bg-blue-200" />
                    <div className="text-center">
                        <p className="text-xs font-black text-blue-600 uppercase">{language === 'ar' ? 'الوقت' : 'Time'}</p>
                        <p className={`text-3xl font-black ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-blue-800'}`}>
                            {timeLeft}s
                        </p>
                    </div>
                </div>

                <div className="w-24" />
            </div>

            <div className="h-screen w-full relative pt-24 overflow-hidden">
                <AnimatePresence>
                    {balloons.map((balloon) => (
                        <motion.button
                            key={balloon.id}
                            type="button"
                            initial={{ y: '110vh' }}
                            animate={{ y: '-20vh' }}
                            exit={
                                activeRules?.gameAdjustments?.balloonPopStyle === 'dissolve'
                                    ? { scale: 0.8, opacity: 0, transition: { duration: 0.5 } } // Dissolve for FXS
                                    : { scale: 2, opacity: 0, transition: { duration: 0.2 } } // Pop
                            }
                            transition={{ duration: balloon.speed, ease: 'linear' }}
                            onClick={() => handlePop(balloon.id, balloon.label)}
                            onAnimationComplete={() => {
                                setBalloons(prev => prev.filter(b => b.id !== balloon.id));
                            }}
                            whileTap={{ scale: 1.2 }}
                            className={`absolute rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] cursor-pointer flex items-center justify-center shadow-lg border-2 border-white/30 z-20 ${balloon.color}`}
                            style={{
                                width: balloon.size,
                                height: balloon.size * 1.2,
                                left: `${balloon.x}vw`,
                            }}
                        >
                            <div className="absolute h-16 w-0.5 bg-gray-400 bottom-[-64px] left-1/2 -translate-x-1/2 origin-top transform rotate-2 pointer-events-none" />
                            <span className="text-3xl font-black text-white drop-shadow-md select-none pointer-events-none">
                                {balloon.label}
                            </span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(!gameStarted || isGameOver) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-2xl border-8 border-white/50"
                        >
                            {isGameOver ? (
                                <>
                                    <div className="relative inline-block mb-6">
                                        <Trophy className="size-24 text-yellow-500 mx-auto" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-4 -right-4">
                                            <Sparkles className="size-10 text-yellow-400" />
                                        </motion.div>
                                    </div>
                                    <h2 className="text-5xl font-black text-blue-900 mb-2">
                                        {language === 'ar' ? 'انتهى الوقت!' : 'Time Up!'}
                                    </h2>
                                    <p className="text-2xl text-blue-600 font-bold mb-8">
                                        {language === 'ar' ? `لقد جمعت ${score} نقطة!` : `You collected ${score} points!`}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-9xl mb-8 animate-bounce">🎈</div>
                                    <h2 className="text-5xl font-black text-blue-900 mb-4">
                                        {t.balloonPop}
                                    </h2>
                                    <p className="text-xl text-gray-500 font-medium mb-12">
                                        {language === 'ar' ? 'فرقع أكبر عدد ممكن من البالونات قبل انتهاء الوقت!' : 'Pop as many balloons as you can before time runs out!'}
                                    </p>
                                </>
                            )}

                            <div className="flex flex-col gap-4">
                                <Button onClick={handleStart} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-3xl py-10 rounded-full shadow-xl">
                                    {isGameOver ? <><RotateCcw className="size-8 me-3" />{language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}</> : <><Play className="size-8 me-3" />{language === 'ar' ? 'ابدأ اللعب!' : 'Start Play!'}</>}
                                </Button>

                                <Button onClick={handleBack} variant="outline" size="lg" className="text-2xl py-8 rounded-full border-4">
                                    {language === 'ar' ? 'عودة لصالة الألعاب' : 'Back to Games Hub'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
