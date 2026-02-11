import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { getLearningSequence, LearningStep } from '../utils/learningSequences';
import { getItemById } from '../data/MasterCurriculum';

interface SyndromeLearningCardProps {
    mainVisual: string;
    nameAr: string;
    nameEn: string;
    soundEffect?: string;
    contextImage?: string;
    onComplete: () => void;
    language: 'ar' | 'en';
    itemId: string;
}

export function SyndromeLearningCard({
    mainVisual,
    nameAr,
    nameEn,
    soundEffect,
    contextImage,
    onComplete,
    language,
    itemId,
}: SyndromeLearningCardProps) {
    const { activeRules, childProfile, reportPerformance } = useApp();
    const { speak, playSound } = useAudio();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [phase, setPhase] = useState<'intro' | 'learning' | 'feedback'>('intro');
    const [showVisual, setShowVisual] = useState(false);
    const [showBlurred, setShowBlurred] = useState(false);
    const [canInteract, setCanInteract] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Refs for timeout cleanup
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const clearTimeouts = () => {
        timeoutsRef.current.forEach(t => clearTimeout(t));
        timeoutsRef.current = [];
    };

    const syndrome = childProfile?.syndrome || childProfile?.condition || 'other';
    const sequence = getLearningSequence(syndrome);
    const fullItem = getItemById(itemId);
    const name = language === 'ar' ? nameAr : nameEn;

    const getCurrentStep = (): LearningStep | null => {
        const steps = sequence[phase];
        return steps[currentStepIndex] || null;
    };

    const startOver = () => {
        clearTimeouts();
        setCurrentStepIndex(0);
        setPhase('intro');
        setShowVisual(false);
        setShowBlurred(false);
        setCanInteract(false);
        setIsFinished(false);
        playSound('tap');
        reportPerformance(itemId, true, false); // Report as repeated
    };

    useEffect(() => {
        if (isFinished) return;

        const step = getCurrentStep();
        if (!step) {
            if (phase === 'intro') {
                setPhase('learning');
                setCurrentStepIndex(0);
            } else if (phase === 'learning') {
                setPhase('feedback');
                setCurrentStepIndex(0);
            } else {
                setIsFinished(true);
            }
            return;
        }

        executeStep(step);

        return () => clearTimeouts();
    }, [currentStepIndex, phase, isFinished]);

    const executeStep = (step: LearningStep) => {
        const addTimeout = (fn: () => void, delay: number) => {
            const t = setTimeout(fn, delay);
            timeoutsRef.current.push(t);
        };

        switch (step.type) {
            case 'visual':
                setShowVisual(true);
                setShowBlurred(false);
                if (!step.silent && !step.waitForTap) speak(name, language);
                if (!step.waitForTap) addTimeout(() => advanceStep(), step.duration);
                else setCanInteract(true);
                break;

            case 'audio':
                if (syndrome === 'williams') {
                    speak(language === 'ar' ? `اسمع! هذا هو ${name}` : `Listen! This is ${name}`, language);
                } else {
                    speak(name, language);
                }
                if (soundEffect) addTimeout(() => playSound(soundEffect as any), 800);
                if (step.autoAdvance) addTimeout(() => advanceStep(), step.duration);
                break;

            case 'visual-audio':
                setShowVisual(true);
                setShowBlurred(false);
                speak(name, language);
                if (step.autoAdvance) addTimeout(() => advanceStep(), step.duration);
                else if (step.waitForTap) setCanInteract(true);
                break;

            case 'context':
                setShowBlurred(true);
                setShowVisual(false);
                if (step.blur) {
                    addTimeout(() => {
                        setShowBlurred(false);
                        setShowVisual(true);
                    }, step.duration - 150);
                }
                addTimeout(() => advanceStep(), step.duration);
                break;

            case 'song':
                speak(language === 'ar' ? `🎵 لنغني مع ${name}! 🎵` : `🎵 Sing with ${name}! 🎵`, language);
                playSound('welcome');
                if (step.autoAdvance) addTimeout(() => advanceStep(), step.duration);
                break;

            case 'social':
                let text = '';
                if (syndrome === 'williams') text = language === 'ar' ? 'يا صديقي! هل أنت جاهز؟ 🌟' : 'My friend! Ready? 🌟';
                else if (syndrome === 'fragile-x') text = language === 'ar' ? 'مكان هادئ... لنكتشفه معاً 🤫' : 'A calm place... let\'s explore 🤫';
                else if (syndrome === 'autism') text = language === 'ar' ? 'الآن سنبدأ الدرس.' : 'Now we start the lesson.';
                if (text) speak(text, language);
                if (step.autoAdvance) addTimeout(() => advanceStep(), step.duration);
                break;

            case 'interaction':
                setCanInteract(true);
                break;

            case 'feedback':
                if (syndrome === 'williams') {
                    speak(language === 'ar' ? 'رائع! أحسنت جداً!' : 'Great! Well done!', language);
                    playSound('celebration');
                } else {
                    playSound('success');
                }
                addTimeout(() => advanceStep(), step.duration);
                break;

            case 'letter-name':
                if (fullItem?.letterNameAr || fullItem?.letterNameEn) {
                    const letterName = language === 'ar' ? fullItem.letterNameAr : fullItem.letterNameEn;
                    if (letterName) speak(letterName, language);
                    addTimeout(() => advanceStep(), step.duration);
                } else {
                    advanceStep(); // Skip if not a letter
                }
                break;

            case 'letter-sound':
                if (fullItem?.phoneticAr || fullItem?.phoneticEn) {
                    const sound = language === 'ar' ? fullItem.phoneticAr : fullItem.phoneticEn;
                    if (sound) speak(sound, language);
                    addTimeout(() => advanceStep(), step.duration);
                } else {
                    advanceStep(); // Skip if no sound info
                }
                break;
        }
    };

    const advanceStep = () => {
        setCurrentStepIndex(prev => prev + 1);
        setCanInteract(false);
    };

    const handleTap = () => {
        if (canInteract) {
            playSound('tap');
            advanceStep();
        }
    };

    const getCardStyle = () => {
        const base = "relative rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-8 border-white transition-all duration-700 min-h-[500px] flex items-center justify-center overflow-hidden";
        if (activeRules?.sensoryProfile === 'low-arousal') return `${base} bg-slate-50`;
        if (syndrome === 'williams') return `${base} bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500`;
        return `${base} bg-gradient-to-br from-blue-400 via-cyan-400 to-emerald-400`;
    };

    return (
        <motion.div
            className={getCardStyle()}
            onClick={handleTap}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        >
            <AnimatePresence mode="wait">
                {isFinished ? (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-10 z-10"
                    >
                        <div className="text-[120px] mb-2 animate-bounce">🎉</div>
                        <h2 className="text-5xl font-black text-white drop-shadow-lg text-center">
                            {language === 'ar' ? 'أحسنت جداً! 🌟' : 'Very well done! 🌟'}
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <button
                                onClick={startOver}
                                className="px-12 py-6 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-bold shadow-2xl border-4 border-white transition-all transform hover:scale-105 flex items-center gap-4"
                            >
                                <motion.span animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                    🔄
                                </motion.span>
                                {language === 'ar' ? 'تكرار' : 'Repeat'}
                            </button>
                            <button
                                onClick={() => {
                                    reportPerformance(itemId, false, true); // Report as completed
                                    onComplete();
                                }}
                                className="px-12 py-6 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white text-3xl font-bold shadow-2xl border-4 border-white transition-all transform hover:scale-105 flex items-center gap-4"
                            >
                                ✅ {language === 'ar' ? 'إنهاء' : 'Finish'}
                            </button>
                        </div>
                    </motion.div>
                ) : showVisual ? (
                    <motion.div
                        key="visual"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="flex flex-col items-center gap-10"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <motion.div
                                animate={syndrome === 'williams' ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-[150px] md:text-[200px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] select-none leading-none text-white font-black"
                            >
                                {mainVisual || '✨'}
                            </motion.div>

                            {(contextImage || fullItem?.contextImage) && (
                                <motion.div
                                    initial={{ x: 50, opacity: 0, rotate: 10 }}
                                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                                    className="size-56 md:size-72 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white/50 p-2 bg-white/20 backdrop-blur-xl"
                                >
                                    <img
                                        src={contextImage || fullItem?.contextImage}
                                        alt={name}
                                        className="w-full h-full object-cover rounded-[2.5rem]"
                                    />
                                </motion.div>
                            )}
                        </div>

                        <h2 className="text-7xl font-black text-white drop-shadow-lg text-center">{name}</h2>
                        {canInteract && (
                            <motion.div
                                animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-3xl font-bold text-white bg-black/30 backdrop-blur-md px-10 py-4 rounded-[2rem] border-2 border-white/30"
                            >
                                {language === 'ar' ? '👆 اضغط للمتابعة' : '👆 Tap to continue'}
                            </motion.div>
                        )}
                    </motion.div>
                ) : showBlurred && contextImage ? (
                    <motion.div
                        key="context"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        <div
                            className="w-full h-full bg-cover bg-center blur-2xl transition-all duration-2000 scale-125"
                            style={{ backgroundImage: `url(${contextImage})` }}
                        />
                        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="assistant"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="flex flex-col items-center gap-6 text-white/50"
                    >
                        <div className="relative size-40">
                            <div className="absolute inset-0 rounded-full border-8 border-current border-t-transparent animate-spin" />
                            <div className="absolute inset-4 rounded-full border-4 border-current border-b-transparent animate-[spin_1.5s_linear_infinite_reverse]" />
                            <div className="absolute inset-0 flex items-center justify-center text-5xl">
                                ✨
                            </div>
                        </div>
                        <p className="text-4xl font-black italic tracking-wider animate-pulse uppercase">
                            {language === 'ar' ? 'IRIS بانتظارك...' : 'IRIS is listening...'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visual Schedule Indicator (Autism) */}
            {syndrome === 'autism' && (
                <div className="absolute top-10 right-10 flex flex-col gap-4">
                    {['intro', 'learning', 'feedback'].map((p) => (
                        <div
                            key={p}
                            className={`w-6 h-6 rounded-full border-4 border-white transition-all duration-500 ${phase === p ? 'bg-green-400 scale-125 shadow-[0_0_20px_rgba(74,222,128,0.8)]' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
