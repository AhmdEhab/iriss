import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export function PlayfulBackground() {
    const blobs = useMemo(() => [
        { id: 1, color: 'bg-blue-400', size: 'size-[40rem]', left: '-10%', top: '-10%', duration: 25 },
        { id: 2, color: 'bg-purple-400', size: 'size-[45rem]', right: '-15%', top: '20%', duration: 30 },
        { id: 3, color: 'bg-orange-300', size: 'size-[35rem]', left: '20%', bottom: '-10%', duration: 22 },
        { id: 4, color: 'bg-blue-300', size: 'size-[30rem]', right: '10%', bottom: '5%', duration: 28 },
    ], []);

    const floatingEmojis = useMemo(() => [
        { id: 'e1', char: '🧸', left: '10%', top: '15%', size: 'text-7xl', duration: 18, delay: 0 },
        { id: 'e2', char: '🚀', left: '85%', top: '10%', size: 'text-8xl', duration: 22, delay: 2 },
        { id: 'e3', char: '🎈', left: '75%', top: '65%', size: 'text-9xl', duration: 25, delay: 5 },
        { id: 'e4', char: '🎨', left: '5%', top: '75%', size: 'text-7xl', duration: 20, delay: 1 },
        { id: 'e8', char: '🌟', left: '90%', top: '40%', size: 'text-6xl', duration: 12, delay: 1 },
    ], []);

    const stars = useMemo(() => {
        return [...Array(10)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 15 + 15,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-white">
            {/* Dynamic Ambient Blobs - Simplified for performance */}
            {blobs.map((blob) => (
                <motion.div
                    key={blob.id}
                    className={`absolute rounded-full opacity-10 blur-[80px] ${blob.color} ${blob.size}`}
                    style={{
                        left: blob.left,
                        top: blob.top,
                        right: blob.right,
                        bottom: blob.bottom,
                        willChange: 'transform',
                    }}
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: blob.duration * 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Playful Floating Emojis - Reduced count and complexity */}
            <div className="absolute inset-0 opacity-[0.05]">
                {floatingEmojis.map((emoji) => (
                    <motion.div
                        key={emoji.id}
                        className={`absolute ${emoji.size} select-none`}
                        style={{
                            left: emoji.left,
                            top: emoji.top,
                            willChange: 'transform',
                        }}
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: emoji.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {emoji.char}
                    </motion.div>
                ))}
            </div>

            {/* Static Content-based Stars for speed */}
            <div className="absolute inset-0 z-[1]">
                {stars.map((star) => (
                    <div
                        key={`star-${star.id}`}
                        className="absolute text-yellow-400 opacity-30 select-none"
                        style={{
                            left: star.left,
                            top: star.top,
                            fontSize: `${star.size}px`,
                        }}
                    >
                        ⭐
                    </div>
                ))}
            </div>
        </div>
    );
}
