import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, CheckCircle2, Youtube, Music, Sparkles, Layout } from 'lucide-react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Song {
    id: string;
    titleAr: string;
    titleEn: string;
    emoji: string;
    color: string;
    descriptionAr: string;
    descriptionEn: string;
    youtubeIdAr: string;
    youtubeIdEn: string;
}

export function SongsScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { language } = useLanguage();
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [journeyStep, setJourneyStep] = useState(0); // 0: Select, 1: Intro/Rhythm, 2: Video/Play, 3: Done

    const songs: Song[] = [
        {
            id: 'alphabet',
            titleAr: 'أغنية الحروف العربية',
            titleEn: 'ABC Alphabet Song',
            emoji: '🔤',
            color: 'from-blue-400 to-indigo-500',
            descriptionAr: 'تعلم الحروف العربية بطريقة ممتعة ومرحة!',
            descriptionEn: 'Learn the ABC alphabet in a fun and entertaining way!',
            youtubeIdAr: 'sJXZ9Dok7u8',
            youtubeIdEn: 'hq3yfQnllfQ'
        },
        {
            id: 'numbers',
            titleAr: 'أغنية الأرقام',
            titleEn: 'Numbers Song 1-10',
            emoji: '🔟',
            color: 'from-green-400 to-emerald-500',
            descriptionAr: 'تعلم الأرقام من 1 إلى 10 مع الأغنية الممتعة!',
            descriptionEn: 'Learn to count from 1 to 10 with this fun song!',
            youtubeIdAr: 'Yt8GFgxlITs',
            youtubeIdEn: 'D0Ajq682yrA'
        },
        {
            id: 'colors',
            titleAr: 'أغنية الألوان',
            titleEn: 'Colors Song',
            emoji: '🎨',
            color: 'from-pink-400 to-rose-500',
            descriptionAr: 'تعلم الألوان الجميلة مع هذه الأغنية الرائعة!',
            descriptionEn: 'Learn beautiful colors with this amazing song!',
            youtubeIdAr: 'Rvz8p3VFZQY',
            youtubeIdEn: 'tRNy2i75tCc'
        },
        {
            id: 'animals',
            titleAr: 'أصوات الحيوانات',
            titleEn: 'Animal Sounds Song',
            emoji: '🦁',
            color: 'from-yellow-300 to-orange-400',
            descriptionAr: 'تعرف على أصوات الحيوانات المختلفة!',
            descriptionEn: 'Learn different animal sounds!',
            youtubeIdAr: 'gPrBEGHKGVc',
            youtubeIdEn: 'qbJnMfB1vVs'
        },
        {
            id: 'twinkle',
            titleAr: 'تلمع تلمع يا نجمة',
            titleEn: 'Twinkle Twinkle Little Star',
            emoji: '✨',
            color: 'from-purple-400 to-pink-500',
            descriptionAr: 'الأغنية الكلاسيكية المحبوبة للأطفال!',
            descriptionEn: 'The classic beloved children\'s song!',
            youtubeIdAr: 'yCjJyiqpAuU',
            youtubeIdEn: 'yCjJyiqpAuU'
        },
        {
            id: 'bus',
            titleAr: 'عجلات الحافلة',
            titleEn: 'Wheels on the Bus',
            emoji: '🚌',
            color: 'from-red-400 to-orange-500',
            descriptionAr: 'عجلات الحافلة تدور وتدور في كل مكان!',
            descriptionEn: 'The wheels on the bus go round and round!',
            youtubeIdAr: 'e_04ZrNroTo',
            youtubeIdEn: 'e_04ZrNroTo'
        },
        {
            id: 'baby-shark',
            titleAr: 'بيبي شارك',
            titleEn: 'Baby Shark',
            emoji: '🦈',
            color: 'from-cyan-400 to-blue-500',
            descriptionAr: 'الأغنية الأكثر شهرة للأطفال في العالم!',
            descriptionEn: 'The most popular children\'s song in the world!',
            youtubeIdAr: 'XqZsoesa55w',
            youtubeIdEn: 'XqZsoesa55w'
        }
    ];

    const playerRef = useRef<any>(null);

    const handleBack = () => {
        playSound('tap');
        if (playerRef.current) playerRef.current.pauseVideo();
        stopSpeaking();
        setIsPlaying(false);
        setJourneyStep(0);
        setSelectedSongId(null);
        navigateTo('child-mode');
    };

    const selectedSong = songs.find(s => s.id === selectedSongId);

    const handleSongSelect = (song: Song) => {
        playSound('tap');
        setSelectedSongId(song.id);
        setIsPlaying(false);
        setJourneyStep(1);

        const style = activeRules?.instructionStyle || 'object-first';

        if (style === 'rhyme-first') {
            // Williams: Musical hook first
            playSound('welcome');
            speak(language === 'ar' ? 'يا سلام! أغنية رائعة! استمع للنغمات.' : 'Oh wow! A wonderful song! Listen to the rhythms.', language);
            setTimeout(() => {
                setJourneyStep(2);
                setIsPlaying(true);
            }, 3500);
        } else if (style === 'whole-scene') {
            // Fragile X: Calm transition
            setTimeout(() => setJourneyStep(2), 4000);
        } else if (style === 'structured') {
            // Autism: Predictable countdown
            speak(language === 'ar' ? 'استعد.. الأغنية ستبدأ الآن.' : 'Get ready.. the song will start now.', language);
            setTimeout(() => setJourneyStep(2), 3000);
        } else {
            // Down Syndrome / Direct: Visual prelude
            setTimeout(() => setJourneyStep(2), 3000);
        }
    };

    const handlePlaySong = () => {
        if (isPlaying && playerRef.current) {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
        } else if (!isPlaying && playerRef.current) {
            playerRef.current.playVideo();
            setIsPlaying(true);
            setJourneyStep(3);
        }
        playSound('tap');
    };

    const restartVideo = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
            setIsPlaying(true);
            playSound('success');
        }
    };

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        if (event.data === 1) setIsPlaying(true);
        else if (event.data === 2) setIsPlaying(false);
        else if (event.data === 0) {
            // Looping logic - could be automatic or manual
            setIsPlaying(false);
        }
    };

    const videoId = selectedSong ? (language === 'ar' ? selectedSong.youtubeIdAr : selectedSong.youtubeIdEn) : '';

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-pink-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-indigo-600'}`}>
                        {language === 'ar' ? 'أغاني ومرح' : 'Songs & Fun'} 🎵
                    </h1>
                    <div className="w-24" />
                </div>

                <AnimatePresence mode="wait">
                    {!selectedSongId ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {songs.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ scale: 0, rotate: index % 2 === 0 ? -2 : 2 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button
                                        onClick={() => handleSongSelect(song)}
                                        className={`w-full aspect-video rounded-[3rem] shadow-xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : song.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl border-8 border-white group relative overflow-hidden`}
                                    >
                                        <div className="text-8xl mb-4 group-hover:scale-110 transition-transform z-10">
                                            {song.emoji}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white drop-shadow-lg z-10">
                                            {language === 'ar' ? song.titleAr : song.titleEn}
                                        </h3>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="max-w-4xl mx-auto pt-4"
                        >
                            {selectedSong && (
                                <Card className={`overflow-hidden rounded-[3.5rem] shadow-2xl border-8 border-white ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-100' : 'bg-white/95'} relative`}>
                                    {/* Syndrome Overlays */}
                                    <AnimatePresence>
                                        {journeyStep === 1 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-10 text-center"
                                            >
                                                {activeRules?.instructionStyle === 'rhyme-first' && (
                                                    <div className="space-y-6">
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                                            transition={{ duration: 0.5, repeat: Infinity }}
                                                        >
                                                            <Music className="size-32 text-pink-500 mx-auto" />
                                                        </motion.div>
                                                        <h3 className="text-5xl font-black text-pink-600 animate-pulse">
                                                            {language === 'ar' ? 'استعد للنغمات! 🎵' : 'Ready for Rhythm! 🎵'}
                                                        </h3>
                                                    </div>
                                                )}
                                                {activeRules?.instructionStyle === 'whole-scene' && (
                                                    <div className="space-y-6">
                                                        <motion.div
                                                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                            className="absolute inset-0 bg-blue-100/30"
                                                        />
                                                        <Sparkles className="size-24 text-blue-400 animate-pulse mx-auto z-10" />
                                                        <h3 className="text-4xl font-black text-blue-600 z-10">
                                                            {language === 'ar' ? 'هدوء... لنستمع معاً.' : 'Calm... let\'s listen together.'}
                                                        </h3>
                                                    </div>
                                                )}
                                                {activeRules?.instructionStyle === 'structured' && (
                                                    <div className="space-y-8">
                                                        <div className="flex gap-4 justify-center">
                                                            {[3, 2, 1].map((n, i) => (
                                                                <motion.div
                                                                    key={n}
                                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    transition={{ delay: i * 1 }}
                                                                    className="size-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold"
                                                                >
                                                                    {n}
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                        <h3 className="text-4xl font-black text-emerald-600">
                                                            {language === 'ar' ? 'الأغنية ستبدأ' : 'Starting Song'}
                                                        </h3>
                                                    </div>
                                                )}
                                                {activeRules?.instructionStyle === 'object-first' && (
                                                    <div className="space-y-6">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1.5 }}
                                                            className="text-[120px] mb-4"
                                                        >
                                                            {selectedSong.emoji}
                                                        </motion.div>
                                                        <h3 className="text-4xl font-black text-blue-600">
                                                            {language === 'ar' ? selectedSong.titleAr : selectedSong.titleEn}
                                                        </h3>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className={`bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-300 to-slate-400' : selectedSong.color} p-12 text-center relative`}>
                                        <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }} transition={{ duration: 2, repeat: Infinity }} className="text-[10rem] mb-4 drop-shadow-2xl">
                                            {selectedSong.emoji}
                                        </motion.div>
                                        <h2 className="text-5xl font-black text-white drop-shadow-lg">
                                            {language === 'ar' ? selectedSong.titleAr : selectedSong.titleEn}
                                        </h2>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border-8 border-white relative group/player">
                                            <YouTube
                                                videoId={videoId}
                                                opts={{
                                                    width: '100%',
                                                    height: '100%',
                                                    playerVars: {
                                                        autoplay: 0,
                                                        modestbranding: 1,
                                                        rel: 0,
                                                        fs: 1,
                                                        loop: 1,
                                                        playlist: videoId
                                                    },
                                                }}
                                                onReady={onPlayerReady}
                                                onStateChange={onPlayerStateChange}
                                                className="w-full h-full"
                                            />

                                            {/* Click to Repeat Overlay */}
                                            <div
                                                onClick={restartVideo}
                                                className="absolute inset-x-0 top-0 h-1/4 z-10 cursor-pointer opacity-0 group-hover/player:opacity-100 transition-opacity bg-gradient-to-b from-black/40 to-transparent flex items-center justify-center"
                                            >
                                                <div className="flex items-center gap-2 text-white bg-indigo-600/80 px-6 py-2 rounded-full font-bold shadow-lg">
                                                    <RotateCcw className="size-5" />
                                                    {language === 'ar' ? 'إعادة من البداية' : 'Restart from start'}
                                                </div>
                                            </div>

                                            <div className="absolute top-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg z-20 pointer-events-none">
                                                <Youtube className="size-5" /> YouTube
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-3xl border-4 border-indigo-100 justify-center text-center">
                                            <p className="text-2xl font-bold text-indigo-800 italic">
                                                {language === 'ar' ? selectedSong.descriptionAr : selectedSong.descriptionEn}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-6">
                                            <Button
                                                onClick={handlePlaySong}
                                                size="lg"
                                                className={`px-16 py-10 rounded-full text-3xl font-black shadow-xl border-4 border-white transition-all transform hover:scale-105 ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`}
                                            >
                                                {isPlaying ? <><Pause className="size-10 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-10 me-3" />{language === 'ar' ? 'تشغيل' : 'Play'}</>}
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    incrementProgress('songs');
                                                    playSound('success');
                                                    setTimeout(() => setSelectedSongId(null), 1500);
                                                }}
                                                size="lg"
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl px-12 rounded-full border-4 border-white shadow-xl"
                                            >
                                                <CheckCircle2 className="size-10 me-3" />
                                                {language === 'ar' ? 'تم' : 'Done'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
