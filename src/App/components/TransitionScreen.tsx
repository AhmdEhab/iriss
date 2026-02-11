import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { Sparkles, Brain, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function TransitionScreen() {
    const { transitionState, activeRules } = useApp();
    const { t, language } = useLanguage();

    const isSelectingIQ = transitionState.message === t.selectingIQ;

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-purple-100'}`}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="flex flex-col items-center space-y-12 max-w-2xl text-center"
            >
                {/* Animated Icon Container */}
                <div className="relative">
                    {/* Background Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={`absolute inset-0 rounded-full blur-3xl ${isSelectingIQ ? 'bg-blue-300' : 'bg-purple-300'}`}
                    />

                    {/* Main Icon */}
                    <motion.div
                        animate={{
                            rotate: isSelectingIQ ? [0, 360] : 0,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: isSelectingIQ ? 3 : 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-10 bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-white"
                    >
                        {isSelectingIQ ? (
                            <Brain className={`size-32 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-500' : 'text-blue-500'}`} />
                        ) : (
                            <Settings className={`size-32 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-500' : 'text-purple-500'} animate-spin-slow`} />
                        )}
                    </motion.div>

                    {/* Floating Sparkles */}
                    <motion.div
                        animate={{
                            y: [-10, 10, -10],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5
                        }}
                        className="absolute -top-4 -right-4"
                    >
                        <Sparkles className="size-12 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-4xl md:text-5xl font-black ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-700' : 'text-gray-800'}`}
                    >
                        {transitionState.message}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`text-2xl font-bold ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-500' : 'text-gray-500'}`}
                    >
                        {t.pleaseWait}
                    </motion.p>
                </div>

                {/* Loading Bar */}
                <div className="w-full max-w-md h-4 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: transitionState.duration / 1000,
                            ease: "linear"
                        }}
                        className={`h-full rounded-full ${isSelectingIQ ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-purple-400 to-pink-400'}`}
                    />
                </div>
            </motion.div>
        </div>
    );
}
