import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen, Star, Sparkles, Layout } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Story {
  id: string;
  titleAr: string;
  titleEn: string;
  emoji: string;
  color: string;
  duration: string;
  contentAr: string;
  contentEn: string;
  thumbnail?: string;
}

export function StoriesScreen() {
  const { navigateTo, incrementProgress, activeRules } = useApp();
  const { speak, playSound, stopSpeaking } = useAudio();
  const { language } = useLanguage();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0); // 0: Select, 1: Intro/Context, 2: Reading/Play

  const stories: Story[] = [
    {
      id: 'bunny',
      titleAr: 'الأرنب بندق',
      titleEn: 'Bandaq the Bunny',
      emoji: '🐰',
      color: 'from-pink-300 to-purple-400',
      duration: '3 min',
      contentAr: 'كان هناك أرنب صغير يدعى بندق، يحب القفز في المروج الخضراء والبحث عن الجزر اللذيذ. في يوم من الأيام، وجد بندق جزرة عملاقة لم يرَ مثلها من قبل! حاول سحبها بكل قوته لكنها كانت ثقيلة جداً. نادى بندق أصدقاءه الأرانب وجاءوا جميعاً للمساعدة. وبفضل التعاون، استطاعوا سحب الجزرة الكبيرة وتقاسموها معاً في وجبة عشاء شهية وسعيدة.',
      contentEn: 'There was a little bunny named Bandaq who loved hopping in green meadows and searching for delicious carrots. One day, Bandaq found a giant carrot unlike any he had seen before! He tried pulling it with all his might, but it was too heavy. Bandaq called his bunny friends, and they all came to help. Thanks to their teamwork, they pulled out the giant carrot and shared a delicious and happy dinner together.',
      thumbnail: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'lion',
      titleAr: 'الأسد الطيب',
      titleEn: 'The Kind Lion',
      emoji: '🦁',
      color: 'from-yellow-300 to-orange-400',
      duration: '4 min',
      contentAr: 'في غابة بعيدة، كان يعيش الأسد سيمبا، ملك الغابة القوي واللطيف. ذات يوم، رأى سيمبا عصفوراً صغيراً سقط من عشه ولا يستطيع الطيران. لم يزأر سيمبا، بل اقترب بلطف وحمل العصفور على ظهره حتى أعاده لعشه بأمان. شكرته أم العصفور وغردت له أجمل الألحان. تعلمت حيوانات الغابة أن القوة الحقيقية تكمن في مساعدة الضعفاء وحمايتهم.',
      contentEn: 'In a faraway forest lived Simba the lion, the strong yet gentle king of the woods. One day, Simba saw a tiny bird that had fallen from its nest and couldn\'t fly. Simba didn\'t roar; instead, he approached gently and carried the bird on his back until he returned it safely to its nest. The mother bird thanked him and sang the most beautiful songs. The forest animals learned that true strength lies in helping and protecting the weak.',
      thumbnail: 'https://images.unsplash.com/photo-1614027126733-7276949f5f94?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'stars',
      titleAr: 'مغامرة النجوم',
      titleEn: 'Stars Adventure',
      emoji: '⭐',
      color: 'from-blue-400 to-indigo-600',
      duration: '3 min',
      contentAr: 'في ليلة صافية، قررت النجمة الصغيرة "لولو" أن تزور الأرض لترى الزهور الجميلة. نزلت لولو بهدوء وجلست على بتلة وردة حمراء، فتعجبت الوردة من نورها الساطع. تبادلت لولو والوردة الأحاديث عن جمال السماء وسحر الأرض حتى الفجر. عندما حان وقت العودة، وعدت لولو الوردة بأن تلمع لها كل ليلة من فوق. ومنذ ذلك الحين، والوردة تنظر للسماء كل ليلة لترى صديقتها النجمة تبتسم لها.',
      contentEn: 'On a clear night, a little star named Lulu decided to visit Earth to see the beautiful flowers. Lulu descended quietly and sat on a red rose petal, and the rose was amazed by her bright light. Lulu and the rose talked about the beauty of the sky and the magic of the Earth until dawn. When it was time to return, Lulu promised the rose she would shine for her every night from above. Since then, the rose looks up at the sky every night to see her star friend smiling back.',
      thumbnail: 'https://images.unsplash.com/photo-1472500662861-a5c248be4274?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'rainbow',
      titleAr: 'ألوان السعادة',
      titleEn: 'Colors of Happiness',
      emoji: '🌈',
      color: 'from-purple-300 to-pink-500',
      duration: '3 min',
      contentAr: 'بعد عاصفة مطرية، تجمعت الألوان السبعة لتصنع قوس قزح رائعاً في السماء. بدأ كل لون يفتخر بجماله، فالأحمر قال أنا الأقوى والأزرق قال أنا الأهدأ. حزنت الشمس وقالت: لا يكتمل الجمال إلا بوجودكم جميعاً متشابكين معاً. فهمت الألوان الدرس وتعاونت لتظهر في أجمل صورة، فرسمت ابتسامة كبيرة على وجوه كل من رآها. ومنذ ذلك اليوم، أصبح قوس قزح يذكرنا دائماً بجمال التنوع والوحدة.',
      contentEn: 'After a rainstorm, the seven colors gathered to make a magnificent rainbow in the sky. Each color began to boast of its beauty: Red said "I am the strongest," and Blue said "I am the calmest." The sun grew sad and said, "Beauty is only complete when you are all intertwined together." The colors understood the lesson and cooperated to appear in the most beautiful way, drawing a big smile on the faces of all who saw them. Since that day, the rainbow always reminds us of the beauty of diversity and unity.',
      thumbnail: 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  const handleBack = () => {
    playSound('tap');
    stopSpeaking();
    setIsPlaying(false);
    if (selectedStoryId) {
      setSelectedStoryId(null);
      setJourneyStep(0);
    } else {
      navigateTo('child-mode');
    }
  };

  const selectedStory = stories.find(s => s.id === selectedStoryId);

  const handleStorySelect = (story: Story) => {
    playSound('tap');
    setSelectedStoryId(story.id);
    setIsPlaying(false);
    setJourneyStep(1);

    const style = activeRules?.instructionStyle || 'object-first';

    if (style === 'rhyme-first') {
      const intro = language === 'ar' ? `حان وقت القصة! هل أنتم مستعدون لسماع قصة ${story.titleAr}؟` : `Story time! Are you ready for the story of ${story.titleEn}?`;
      speak(intro, language);
      setTimeout(() => setJourneyStep(2), 3500);
    } else if (style === 'whole-scene') {
      setJourneyStep(1);
      setTimeout(() => setJourneyStep(2), 3000);
    } else if (style === 'structured') {
      const intro = language === 'ar' ? 'الآن سنستمع لقصة جميلة. سنجلس بهدوء ونبدأ.' : 'Now we will listen to a beautiful story. We will sit quietly and start.';
      speak(intro, language);
      setTimeout(() => setJourneyStep(2), 3000);
    } else {
      setJourneyStep(2);
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      playSound('tap');
    } else if (selectedStory) {
      const text = language === 'ar' ? selectedStory.contentAr : selectedStory.contentEn;
      speak(text, language);
      setIsPlaying(true);
      playSound('success');
    }
  };

  const handleDone = () => {
    incrementProgress('stories');
    playSound('success');
    setTimeout(() => setSelectedStoryId(null), 1500);
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
      <BackButton onClick={handleBack} />
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-24" />
          <h1 className={`text-5xl font-black drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-slate-600' : 'text-purple-600'}`}>
            {language === 'ar' ? 'عالم القصص' : 'Story World'} 📚
          </h1>
          <div className="w-24" />
        </div>

        <AnimatePresence mode="wait">
          {!selectedStoryId ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleStorySelect(story)}
                    className={`w-full bg-white rounded-[3.5rem] shadow-xl overflow-hidden border-8 border-white flex group hover:shadow-2xl transition-all duration-300`}
                  >
                    <div className={`w-1/3 bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-200 to-slate-300' : story.color} flex items-center justify-center text-7xl`}>
                      {story.emoji}
                    </div>
                    <div className="flex-1 p-8 text-start">
                      <h3 className="text-3xl font-black text-gray-800 mb-2">{language === 'ar' ? story.titleAr : story.titleEn}</h3>
                      <div className="flex items-center gap-2 text-purple-600 font-bold">
                        <Star className="size-5 fill-purple-600" />
                        <span>{story.duration}</span>
                      </div>
                      <p className="text-gray-500 mt-4 line-clamp-2 italic">
                        {language === 'ar' ? story.contentAr : story.contentEn}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {selectedStory && (
                <Card className={`overflow-hidden rounded-[4rem] shadow-2xl border-8 border-white ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-100' : 'bg-white/95'} relative`}>
                  {/* Syndrome Layer */}
                  <AnimatePresence>
                    {journeyStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-12 text-center"
                      >
                        {activeRules?.instructionStyle === 'whole-scene' && (
                          <div className="space-y-8">
                            <Sparkles className="size-32 text-blue-400 animate-pulse mx-auto" />
                            <h3 className="text-4xl font-black text-blue-600 italic">
                              {language === 'ar' ? 'استعد لقصة هادئة...' : 'Prepare for a calm story...'}
                            </h3>
                          </div>
                        )}
                        {activeRules?.instructionStyle === 'structured' && (
                          <div className="space-y-8">
                            <Layout className="size-32 text-emerald-500 mx-auto" />
                            <h3 className="text-4xl font-black text-emerald-600">
                              {language === 'ar' ? 'حان وقت الحكاية' : 'Tale Time'}
                            </h3>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`aspect-[21/9] bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-300 to-slate-400' : selectedStory.color} relative overflow-hidden flex items-center justify-center`}>
                    <motion.div animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }} transition={{ duration: 4, repeat: Infinity }} className="text-[12rem] drop-shadow-2xl z-10">
                      {selectedStory.emoji}
                    </motion.div>
                    {selectedStory.thumbnail && (
                      <img src={selectedStory.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" alt="" />
                    )}
                  </div>

                  <div className="p-10 space-y-8 text-center">
                    <h2 className="text-5xl font-black text-gray-800 drop-shadow-sm">
                      {language === 'ar' ? selectedStory.titleAr : selectedStory.titleEn}
                    </h2>

                    <div className="bg-purple-50 p-10 rounded-[3rem] border-4 border-purple-100 shadow-inner max-h-[40vh] overflow-y-auto">
                      <p className="text-3xl font-bold text-gray-700 leading-relaxed italic">
                        "{language === 'ar' ? selectedStory.contentAr : selectedStory.contentEn}"
                      </p>
                    </div>

                    <div className="flex justify-center gap-6">
                      <Button
                        onClick={handlePlay}
                        size="lg"
                        className={`px-16 py-10 rounded-full text-3xl font-black shadow-xl border-4 border-white transition-all transform hover:scale-105 ${isPlaying ? 'bg-red-500' : 'bg-purple-600'}`}
                      >
                        {isPlaying ? <><Pause className="size-10 me-3" /> {language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-10 me-3" /> {language === 'ar' ? 'استمع' : 'Listen'}</>}
                      </Button>

                      <Button
                        onClick={handleDone}
                        size="lg"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl px-12 rounded-full border-4 border-white shadow-xl"
                      >
                        <CheckCircle2 className="size-10 me-3" />
                        {language === 'ar' ? 'لقد انتهيت' : 'I\'m Done'}
                      </Button>

                      <Button
                        onClick={() => setSelectedStoryId(null)}
                        variant="outline"
                        size="lg"
                        className="bg-white text-2xl px-12 rounded-full border-4 border-gray-100 shadow-lg"
                      >
                        <RotateCcw className="size-8 me-3" />
                        {language === 'ar' ? 'قصة أخرى' : 'Another story'}
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
