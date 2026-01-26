import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Volume2, Sparkles } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';


export function IRISAssistant() {
    const { speak, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const { irisProfile, getAiRecommendations } = useApp();

    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const messages = {
        ar: [
            "أهلاً بك! أنا إيرِس، هل تود أن نلعب معاً؟",
            "اضغط على الأيقونات لتتعرف على عالمنا الجميل!",
            "لقد أحسنت عملاً اليوم! استمر في التعلم 🌟",
            "هل تعلم أن الألوان تجعل الحياة أجمل؟ دعنا نكتشفها!",
        ],
        en: [
            "Hello! I am IRIS, would you like to play together?",
            "Click on the icons to discover our beautiful world!",
            "You did a great job today! Keep learning 🌟",
            "Did you know colors make life more beautiful? Let's explore them!",
        ]
    };

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 15000);
        return () => clearTimeout(timer);
    }, []);

    const toggleAssistant = async () => {
        if (!isOpen) {
            setLoading(true);
            speak(messages[language][currentMessageIndex], language);
            // Fetch real recommendations if we have a profile
            if (irisProfile) {
                const recs = await getAiRecommendations();
                setAiRecommendations(recs);
            }
            setLoading(false);
        } else {
            stopSpeaking();
        }
        setIsOpen(!isOpen);
        setShowHint(false);
    };


    const nextMessage = () => {
        const next = (currentMessageIndex + 1) % messages[language].length;
        setCurrentMessageIndex(next);
        speak(messages[language][next], language);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="pointer-events-auto mb-2"
                    >
                        <div className="glass-dark p-6 rounded-[2.5rem] max-w-xs text-white shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Volume2 className="size-16" />
                            </div>
                            <p className="text-xl font-bold leading-relaxed mb-4 pr-6">
                                {messages[language][currentMessageIndex]}
                            </p>
                            <button
                                onClick={nextMessage}
                                className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition-all text-sm mb-4"
                            >
                                {language === 'ar' ? 'ماذا أيضاً؟ ✨' : 'What else? ✨'}
                            </button>

                            {aiRecommendations.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                                        <Sparkles className="size-3" />
                                        {language === 'ar' ? 'توصيات ذكية' : 'Smart Recommendations'}
                                    </p>
                                    <div className="space-y-1">
                                        {aiRecommendations.slice(0, 2).map((rec, i) => (
                                            <div key={i} className="text-sm bg-white/10 p-2 rounded-lg">
                                                {rec.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="flex items-center gap-4">
                {showHint && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold text-purple-600"
                    >
                        {language === 'ar' ? 'هل تحتاج لمساعدة؟' : 'Need help?'}
                    </motion.div>
                )}

                <motion.button
                    onClick={toggleAssistant}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="pointer-events-auto size-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center text-5xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                                <X className="size-8 text-white" />
                            </motion.div>
                        ) : (
                            <motion.span key="iris" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 1.5 }}>
                                👁️‍🗨️
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}
