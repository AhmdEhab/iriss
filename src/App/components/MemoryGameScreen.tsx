import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Brain, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface CardItem {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const EMOJI_POOL = ['🍎', '🐶', '🚗', '☀️', '🦁', '🐘', '🍦', '🚀', '🌈', '🎨', '🍕', '🎸', '🧸', '🎈', '🍭', '🐱'];

export function MemoryGameScreen() {
    const { navigateTo, unlockBadge, incrementProgress } = useApp();
    const { playSound, speak } = useAudio();
    const { t, language } = useLanguage();

    const [cards, setCards] = useState<CardItem[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState<4 | 6 | 8>(6);
    const [isProcessing, setIsProcessing] = useState(false);

    const initGame = useCallback(() => {
        // Robust Fisher-Yates Shuffle
        const selectedEmojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, difficulty);
        const pairEmojis = [...selectedEmojis, ...selectedEmojis];

        // Final shuffle of pairs
        for (let i = pairEmojis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairEmojis[i], pairEmojis[j]] = [pairEmojis[j], pairEmojis[i]];
        }

        const shuffledCards = pairEmojis.map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false,
        }));

        setCards(shuffledCards);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setIsGameOver(false);
        setIsProcessing(false);

        speak(language === 'ar' ? 'هيا نختبر ذاكرتنا القوية!' : "Let's test our super memory!", language);
    }, [difficulty, language, speak]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleCardClick = (id: number) => {
        if (isProcessing || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched || isGameOver) return;

        playSound('tap');

        // Flip the card
        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            setMoves(m => m + 1);
            const [firstId, secondId] = newFlipped;

            if (cards[firstId].emoji === cards[secondId].emoji) {
                // Match! - Faster response
                setTimeout(() => {
                    const matchedCards = [...newCards];
                    matchedCards[firstId].isMatched = true;
                    matchedCards[secondId].isMatched = true;
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setMatches(m => m + 1);
                    playSound('success');
                    setIsProcessing(false);

                    if (matches + 1 === difficulty) {
                        handleWin();
                    }
                }, 400); // reduced from 600
            } else {
                // Not a match - Faster turnover
                setTimeout(() => {
                    const resetCards = [...newCards];
                    resetCards[firstId].isFlipped = false;
                    resetCards[secondId].isFlipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                    setIsProcessing(false);
                }, 800); // reduced from 1000
            }
        }
    };

    const handleWin = () => {
        setIsGameOver(true);
        setTimeout(() => {
            playSound('celebration');
            speak(language === 'ar' ? 'مذهل! أنت تمتلك ذاكرة أبطال.' : 'Amazing! You have a hero memory.', language);
        }, 300);

        if (difficulty >= 6) {
            unlockBadge('memory-master');
            incrementProgress('games-hub');
        }
    };

    const handleBack = () => {
        playSound('tap');
        navigateTo('games-hub');
    };

    return (
        <div className="min-h-screen bg-transparent p-4 overflow-hidden relative">
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8 h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className="text-6xl font-black text-emerald-700 drop-shadow-xl text-center flex-1">
                        {t.memoryGame} 🧩
                    </h1>

                    <Card className="flex gap-6 bg-white/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border-4 border-emerald-100">
                        <div className="text-center px-4 border-e-4 border-emerald-50">
                            <p className="text-sm font-black uppercase text-emerald-600 tracking-widest">{language === 'ar' ? 'الحركات' : 'Moves'}</p>
                            <p className="text-4xl font-black text-emerald-700">{moves}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-sm font-black uppercase text-emerald-600 tracking-widest">{language === 'ar' ? 'الأزواج' : 'Matches'}</p>
                            <p className="text-4xl font-black text-emerald-700">{matches}/{difficulty}</p>
                        </div>
                    </Card>
                </div>

                {/* Game Area */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                    {!isGameOver ? (
                        <div className={`
                            grid gap-8 w-full max-w-5xl p-6
                            ${difficulty === 4 ? 'grid-cols-2 lg:grid-cols-4' :
                                difficulty === 6 ? 'grid-cols-3 lg:grid-cols-4' :
                                    'grid-cols-4 lg:grid-cols-4'}
                        `}>
                            {cards.map((card) => (
                                <motion.button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.id)}
                                    whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="aspect-square relative perspective-1000 group"
                                >
                                    <motion.div
                                        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
                                        className="w-full h-full preserve-3d relative"
                                    >
                                        {/* Front (Hidden) */}
                                        <Card className={`
                                            absolute inset-0 backface-hidden border-8 border-white shadow-3xl
                                            bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 
                                            flex items-center justify-center rounded-[2.5rem]
                                            group-hover:shadow-emerald-200/50 transition-shadow
                                        `}>
                                            <Brain className="size-20 text-white/40 animate-pulse" />
                                        </Card>

                                        {/* Back (Emoji) */}
                                        <Card className={`
                                            absolute inset-0 backface-hidden border-8 border-white shadow-3xl
                                            bg-white flex items-center justify-center rounded-[2.5rem]
                                            rotate-y-180 transition-colors
                                            ${card.isMatched ? 'bg-emerald-50 border-emerald-400' : ''}
                                        `}>
                                            <span className={`text-[6rem] sm:text-[8rem] ${card.isMatched ? 'scale-110 drop-shadow-lg' : ''}`}>
                                                {card.emoji}
                                            </span>
                                            {card.isMatched && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
                                                >
                                                    <Sparkles className="size-6" />
                                                </motion.div>
                                            )}
                                        </Card>
                                    </motion.div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        /* Game Over Screen */
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-10"
                        >
                            <div className="relative inline-block">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-20 text-8xl flex justify-around items-center opacity-30"
                                >
                                    <span>✨</span><span>🌟</span><span>✨</span><span>🌟</span>
                                </motion.div>
                                <div className="text-[12rem] bg-white rounded-[4rem] p-16 shadow-3xl border-8 border-emerald-200 relative z-10">
                                    🏆
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-7xl font-black text-emerald-800 drop-shadow-sm">
                                    {language === 'ar' ? 'يا لك من بطل!' : 'Heroic Work!'}
                                </h2>
                                <p className="text-3xl text-emerald-600 font-black">
                                    {language === 'ar' ? `أنهيت اللعبة في ${moves} تجربة` : `Completed in ${moves} moves`}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={initGame}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-3xl font-black px-16 py-8 rounded-[2rem] shadow-2xl flex items-center gap-4 transition-colors"
                                >
                                    <RotateCcw className="size-10" />
                                    {language === 'ar' ? 'مرة أخرى' : 'Play Again'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBack}
                                    className="bg-white text-emerald-500 border-4 border-emerald-100 text-3xl font-black px-16 py-8 rounded-[2rem] shadow-2xl flex items-center gap-4 hover:bg-emerald-50 transition-colors"
                                >
                                    {language === 'ar' ? 'القائمة' : 'Menu'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer Settings */}
                {!isGameOver && (
                    <Card className="mt-8 self-center bg-white/80 p-4 rounded-[2rem] border-4 border-white shadow-xl flex items-center gap-8">
                        <p className="text-2xl font-black text-emerald-700">{language === 'ar' ? 'مستوى التحدي:' : 'Challenge:'}</p>
                        <div className="flex gap-4">
                            {[4, 6, 8].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => { playSound('tap'); setDifficulty(d as any); }}
                                    className={`px-8 py-3 rounded-2xl font-black text-xl transition-all ${difficulty === d
                                        ? 'bg-emerald-500 text-white shadow-lg scale-110'
                                        : 'bg-emerald-50 text-emerald-400 hover:bg-emerald-100'}`}
                                >
                                    {d} {language === 'ar' ? 'أزواج' : 'Pairs'}
                                </button>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
}
