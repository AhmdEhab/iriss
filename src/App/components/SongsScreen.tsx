import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Mic2, CheckCircle2 } from 'lucide-react';
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
    lyricsAr: string;
    lyricsEn: string;
}

export function SongsScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language } = useLanguage();
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const songs: Song[] = [
        {
            id: 'alphabet',
            titleAr: 'أغنية الحروف',
            titleEn: 'Alphabet Song',
            emoji: '🔤',
            color: 'from-blue-400 to-indigo-500',
            lyricsAr: 'ألف باء تاء ثاء جيم حاء خاء دال ذال راء زاي سين شين صاد ضاد طاء ظاء عين غين فاء قاف كاف لام ميم نون هاء واو ياء. هذه حروفي الهجائية!',
            lyricsEn: 'A B C D E F G. H I J K L M N O P. Q R S T U V. W X Y and Z. Now I know my ABCs, next time won\'t you sing with me!'
        },
        {
            id: 'numbers',
            titleAr: 'أغنية الأرقام',
            titleEn: 'Numbers Song',
            emoji: '🔟',
            color: 'from-green-400 to-emerald-500',
            lyricsAr: 'واحد هو ربي، اثنان هما عيناي، ثلاثة هم أقدام القطة، أربعة هم أرجل الكرسي، وخمسة هم أصابع يدي! هيا نعد للأمام!',
            lyricsEn: 'One, two, buckle my shoe. Three, four, shut the door. Five, six, pick up sticks. Seven, eight, lay them straight. Nine, ten, a big fat hen!'
        },
        {
            id: 'twinkle',
            titleAr: 'تلمع تلمع يا نجم',
            titleEn: 'Twinkle Twinkle',
            emoji: '✨',
            color: 'from-yellow-300 to-orange-400',
            lyricsAr: 'تلمع تلمع يا نجم، كيف حالك يا نجم؟ فوق في السماء العالية، مثل الماسة الغالية. تلمع تلمع يا نجم، كيف حالك يا نجم؟',
            lyricsEn: 'Twinkle, twinkle, little star. How I wonder what you are! Up above the world so high, like a diamond in the sky. Twinkle, twinkle, little star. How I wonder what you are!'
        },
        {
            id: 'spider',
            titleAr: 'العنكبوت الصغير',
            titleEn: 'Itsy Bitsy Spider',
            emoji: '🕷️',
            color: 'from-purple-400 to-pink-500',
            lyricsAr: 'العنكبوت الصغير صعد فوق السور، أتى المطر وأنزل العنكبوت. خرجت الشمس وجففت المطر، والعنكبوت الصغير صعد فوق السور من جديد!',
            lyricsEn: 'The itsy bitsy spider climbed up the water spout. Down came the rain and washed the spider out. Out came the sun and dried up all the rain, and the itsy bitsy spider climbed up the spout again!'
        },
        {
            id: 'bus',
            titleAr: 'عجلات الحافلة',
            titleEn: 'Wheels on the Bus',
            emoji: '🚌',
            color: 'from-red-400 to-orange-500',
            lyricsAr: 'عجلات الحافلة تدور وتدور، تدور وتدور، تدور وتدور. عجلات الحافلة تدور وتدور، في كل أنحاء المدينة!',
            lyricsEn: 'The wheels on the bus go round and round, round and round, round and round. The wheels on the bus go round and round, all through the town!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        navigateTo('child-mode');
    };

    const selectedSong = songs.find(s => s.id === selectedSongId);

    const handleSongSelect = (song: Song) => {
        playSound('tap');
        const title = language === 'ar' ? song.titleAr : song.titleEn;
        speak(title, language);
        setSelectedSongId(song.id);
        setIsPlaying(false);
    };

    const handlePlaySong = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedSong) {
            const lyrics = language === 'ar' ? selectedSong.lyricsAr : selectedSong.lyricsEn;
            speak(lyrics, language);
            setIsPlaying(true);
            playSound('success');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4">
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className="text-5xl font-bold text-pink-600 drop-shadow-lg text-center flex-1">
                        {language === 'ar' ? 'أغاني جميلة' : 'Beautiful Songs'} 🎵
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedSongId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {songs.map((song, index) => (
                            <motion.div key={song.id} initial={{ scale: 0, rotate: index % 2 === 0 ? -5 : 5 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                                <button onClick={() => handleSongSelect(song)} className={`w-full aspect-video rounded-[2.5rem] shadow-xl bg-gradient-to-br ${song.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl p-6 border-8 border-white group`}>
                                    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                                        {song.emoji}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                                        {language === 'ar' ? song.titleAr : song.titleEn}
                                    </h3>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedSong && (
                            <Card className="overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white bg-white/95">
                                <div className={`bg-gradient-to-br ${selectedSong.color} p-16 text-center`}>
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 10, -10, 0] : 0 }} transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }} className="text-[12rem] mb-6 drop-shadow-2xl">{selectedSong.emoji}</motion.div>
                                    <h2 className="text-5xl font-bold text-white drop-shadow-lg">{language === 'ar' ? selectedSong.titleAr : selectedSong.titleEn}</h2>
                                </div>
                                <div className="p-10 text-center">
                                    <div className="bg-purple-50 rounded-3xl p-10 border-4 border-purple-100 mb-8 relative">
                                        <div className="absolute top-4 left-4 opacity-10"><Mic2 className="size-16" /></div>
                                        <p className="text-3xl font-bold text-gray-800 leading-relaxed italic">" {language === 'ar' ? selectedSong.lyricsAr : selectedSong.lyricsEn} "</p>
                                    </div>
                                    <div className="flex justify-center gap-6">
                                        <Button onClick={handlePlaySong} size="lg" className={`px-20 py-10 rounded-full text-3xl font-bold shadow-xl border-4 border-white ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                                            {isPlaying ? <><Pause className="size-10 me-3" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-10 me-3" />{language === 'ar' ? 'غنّي معنا' : 'Sing Along'}</>}
                                        </Button>
                                        <Button onClick={() => { playSound('success'); incrementProgress('songs'); speak(language === 'ar' ? 'يا لها من أغنية جميلة! لقد أكملتها.' : 'What a beautiful song! You completed it.', language); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                            <CheckCircle2 className="size-10 me-3" />
                                            {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                        </Button>
                                        <Button onClick={() => { playSound('tap'); setSelectedSongId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-2xl px-12 py-10 rounded-full shadow-xl grayscale hover:grayscale-0 transition-all border-4 border-gray-100">
                                            <RotateCcw className="size-8 me-3" />
                                            {language === 'ar' ? 'عودة' : 'Back'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
