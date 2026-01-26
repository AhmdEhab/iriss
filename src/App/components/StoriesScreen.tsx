import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface Story {
  id: string;
  title: string;
  emoji: string;
  color: string;
  duration: string;
  contentAr: string;
  contentEn: string;
}

export function StoriesScreen() {
  const { navigateTo, incrementProgress } = useApp();
  const { speak, playSound, stopSpeaking } = useAudio();
  const { t, language } = useLanguage();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stories: Story[] = [
    {
      id: 'bunny',
      title: language === 'ar' ? 'الأرنب بندق' : 'Bandaq the Bunny',
      emoji: '🐰',
      color: 'from-pink-300 to-purple-300',
      duration: '3 min',
      contentAr: 'كان هناك أرنب صغير يدعى بندق، يحب القفز في المروج الخضراء والبحث عن الجزر اللذيذ. في يوم من الأيام، وجد بندق جزرة عملاقة لم يرَ مثلها من قبل! حاول سحبها بكل قوته لكنها كانت ثقيلة جداً. نادى بندق أصدقاءه الأرانب وجاءوا جميعاً للمساعدة. وبفضل التعاون، استطاعوا سحب الجزرة الكبيرة وتقاسموها معاً في وجبة عشاء شهية وسعيدة.',
      contentEn: 'There was a little bunny named Bandaq who loved hopping in green meadows and searching for delicious carrots. One day, Bandaq found a giant carrot unlike any he had seen before! He tried pulling it with all his might, but it was too heavy. Bandaq called his bunny friends, and they all came to help. Thanks to their teamwork, they pulled out the giant carrot and shared a delicious and happy dinner together.'
    },
    {
      id: 'lion',
      title: language === 'ar' ? 'الأسد الطيب' : 'The Kind Lion',
      emoji: '🦁',
      color: 'from-yellow-300 to-orange-300',
      duration: '4 min',
      contentAr: 'في غابة بعيدة، كان يعيش الأسد سيمبا، ملك الغابة القوي واللطيف. ذات يوم، رأى سيمبا عصفوراً صغيراً سقط من عشه ولا يستطيع الطيران. لم يزأر سيمبا، بل اقترب بلطف وحمل العصفور على ظهره حتى أعاده لعشه بأمان. شكرته أم العصفور وغردت له أجمل الألحان. تعلمت حيوانات الغابة أن القوة الحقيقية تكمن في مساعدة الضعفاء وحمايتهم.',
      contentEn: 'In a faraway forest lived Simba the lion, the strong yet gentle king of the woods. One day, Simba saw a tiny bird that had fallen from its nest and couldn\'t fly. Simba didn\'t roar; instead, he approached gently and carried the bird on his back until he returned it safely to its nest. The mother bird thanked him and sang the most beautiful songs. The forest animals learned that true strength lies in helping and protecting the weak.'
    },
    {
      id: 'stars',
      title: language === 'ar' ? 'مغامرة النجوم' : 'Stars Adventure',
      emoji: '⭐',
      color: 'from-blue-300 to-indigo-300',
      duration: '3 min',
      contentAr: 'في ليلة صافية، قررت النجمة الصغيرة "لولو" أن تزور الأرض لترى الزهور الجميلة. نزلت لولو بهدوء وجلست على بتلة وردة حمراء، فتعجبت الوردة من نورها الساطع. تبادلت لولو والوردة الأحاديث عن جمال السماء وسحر الأرض حتى الفجر. عندما حان وقت العودة، وعدت لولو الوردة بأن تلمع لها كل ليلة من فوق. ومنذ ذلك الحين، والوردة تنظر للسماء كل ليلة لترى صديقتها النجمة تبتسم لها.',
      contentEn: 'On a clear night, a little star named Lulu decided to visit Earth to see the beautiful flowers. Lulu descended quietly and sat on a red rose petal, and the rose was amazed by her bright light. Lulu and the rose talked about the beauty of the sky and the magic of the Earth until dawn. When it was time to return, Lulu promised the rose she would shine for her every night from above. Since then, the rose looks up at the sky every night to see her star friend smiling back.'
    },
    {
      id: 'tree',
      title: language === 'ar' ? 'الشجرة المعطاءة' : 'The Giving Tree',
      emoji: '🌳',
      color: 'from-green-300 to-emerald-300',
      duration: '4 min',
      contentAr: 'كانت هناك شجرة بلوط كبيرة تسكن في وسط قرية صغيرة، وكانت تحب الأطفال كثيراً. في الصيف، كانت تفرش ظلها البارد ليلعبوا تحته، وفي الخريف كانت تهدي الخشب للتدفئة. وفي الشتاء، كانت تحمي العصافير بين أغصانها القوية من البرد والمطر. عندما كبر الأطفال، عادوا ليزرعوا حولها شجيرات صغيرة لتكون بصحبتها. ظلت الشجرة رمزاً للعطاء والحب الذي لا ينتهي أبداً في قلوب الجميع.',
      contentEn: 'There was a large oak tree living in the center of a small village, and it loved children very much. In the summer, it spread its cool shade for them to play under, and in the autumn, it gave wood for warmth. In the winter, it protected birds among its strong branches from the cold and rain. When the children grew up, they returned to plant small bushes around it to keep it company. The tree remained a symbol of giving and endless love in everyone\'s hearts.'
    },
    {
      id: 'rainbow',
      title: language === 'ar' ? 'ألوان السعادة' : 'Colors of Happiness',
      emoji: '🌈',
      color: 'from-purple-300 to-pink-300',
      duration: '3 min',
      contentAr: 'بعد عاصفة مطرية، تجمعت الألوان السبعة لتصنع قوس قزح رائعاً في السماء. بدأ كل لون يفتخر بجماله، فالأحمر قال أنا الأقوى والأزرق قال أنا الأهدأ. حزنت الشمس وقالت: لا يكتمل الجمال إلا بوجودكم جميعاً متشابكين معاً. فهمت الألوان الدرس وتعاونت لتظهر في أجمل صورة، فرسمت ابتسامة كبيرة على وجوه كل من رآها. ومنذ ذلك اليوم، أصبح قوس قزح يذكرنا دائماً بجمال التنوع والوحدة.',
      contentEn: 'After a rainstorm, the seven colors gathered to make a magnificent rainbow in the sky. Each color began to boast of its beauty: Red said "I am the strongest," and Blue said "I am the calmest." The sun grew sad and said, "Beauty is only complete when you are all intertwined together." The colors understood the lesson and cooperated to appear in the most beautiful way, drawing a big smile on the faces of all who saw them. Since that day, the rainbow always reminds us of the beauty of diversity and unity.'
    },
    {
      id: 'moon',
      title: language === 'ar' ? 'حارس الأحلام' : 'The Dream Guardian',
      emoji: '🌙',
      color: 'from-indigo-400 to-purple-400',
      duration: '4 min',
      contentAr: 'عندما يحل المساء، يخرج القمر الفضي ليحرس أحلام الأطفال الصغار في كل مكان. يهمس القمر للنجوم لتنشد أعذب الألحان الهادئة التي تساعد على النوم العميق. في إحدى الليالي، خاف طفل صغير من الظلام، فأنزل له القمر شعاعاً من النور ليؤنسه. نام الطفل مطمئناً وهو يعلم أن صديقه القمر يراقبه من بعيد. استيقظ الطفل في الصباح وهو يشعر بالنشاط والسعادة، منتظراً لقاء القمر في الليلة القادمة.',
      contentEn: 'When evening falls, the silver moon comes out to guard the dreams of little children everywhere. The moon whispers to the stars to sing the sweetest, calmest melodies that help with deep sleep. One night, a little boy was afraid of the dark, so the moon sent down a beam of light to comfort him. The boy slept peacefully, knowing his friend the moon was watching him from afar. He woke up in the morning feeling energetic and happy, waiting to meet the moon the next night.'
    }
  ];

  const handleBack = () => {
    playSound('tap');
    stopSpeaking();
    setIsPlaying(false);
    navigateTo('child-mode');
  };

  const handleStorySelect = (story: Story) => {
    playSound('tap');
    speak(story.title, language);
    setSelectedStoryId(story.id);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      playSound('tap');
    } else {
      const story = stories.find(s => s.id === selectedStoryId);
      if (story) {
        const storyText = language === 'ar' ? story.contentAr : story.contentEn;
        speak(storyText, language);
        setIsPlaying(true);
        playSound('success');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4">
      <BackButton onClick={handleBack} />
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-24" />
          <h1 className="text-5xl font-bold text-purple-800 drop-shadow-lg">
            {t.stories} 📚
          </h1>
          <div className="w-24" />
        </div>

        {!selectedStoryId ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div key={story.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ scale: 1.05 }}>
                <button onClick={() => handleStorySelect(story)} className={`w-full aspect-square rounded-3xl shadow-2xl bg-gradient-to-br ${story.color} flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl p-6`}>
                  <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4">
                    {story.emoji}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white text-center drop-shadow-lg mb-2">
                    {story.title}
                  </h3>
                  <span className="text-white/80 text-sm">{story.duration}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
            {(() => {
              const story = stories.find(s => s.id === selectedStoryId);
              if (!story) return null;
              return (
                <Card className={`bg-gradient-to-br ${story.color} shadow-2xl overflow-hidden`}>
                  <div className="p-8 text-center">
                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, rotate: isPlaying ? [0, 5, -5, 0] : 0 }} transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }} className="text-9xl mb-6">
                      {story.emoji}
                    </motion.div>
                    <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
                      {story.title}
                    </h2>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm p-8 m-6 rounded-2xl shadow-lg">
                    <div className="prose prose-lg max-w-none text-center">
                      <p className="text-2xl leading-relaxed">
                        {language === 'ar' ? story.contentAr : story.contentEn}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 p-8">
                    <Button onClick={handlePlay} size="lg" className="bg-white text-purple-600 hover:bg-purple-50 text-xl px-12 py-8 rounded-full shadow-xl">
                      {isPlaying ? <><Pause className="size-8 me-2" />{language === 'ar' ? 'إيقاف' : 'Pause'}</> : <><Play className="size-8 me-2" />{language === 'ar' ? 'تشغيل' : 'Play'}</>}
                    </Button>
                    <Button onClick={() => { playSound('success'); incrementProgress('stories'); speak(language === 'ar' ? 'قصة رائعة! لقد أكملتها.' : 'Great story! You completed it.', language); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-xl px-10 py-8 rounded-full shadow-xl border-4 border-white">
                      <CheckCircle2 className="size-8 me-2" />
                      {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                    </Button>
                    <Button onClick={() => { playSound('tap'); setSelectedStoryId(null); setIsPlaying(false); stopSpeaking(); }} variant="outline" size="lg" className="bg-white text-xl px-8 py-8 rounded-full shadow-xl">
                      <RotateCcw className="size-6 me-2" />
                      {language === 'ar' ? 'العودة' : 'Back'}
                    </Button>
                  </div>
                </Card>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
