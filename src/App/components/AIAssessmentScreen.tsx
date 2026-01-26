import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, Trophy, Check } from 'lucide-react';
import { useApp, AssessmentResult } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BackButton } from './ui/BackButton';

interface Task {
  id: number;
  type: 'image-match' | 'sound-recognition' | 'shape-sort' | 'memory' | 'counting' | 'pattern';
  question: string;
  questionEn: string;
  questionAr: string;
  options: string[];
  correct: number;
  minAge: number; // Minimum age for this task
  maxAge: number; // Maximum age for this task
}

// Comprehensive task pool organized by cognitive domains and age groups
const taskPool: Task[] = [
  // --- EARLY CHILDHOOD (3-5) ---
  // Visual Matching & Identity
  {
    id: 1, type: 'image-match', questionAr: 'أين الكلب؟ 🐕', questionEn: 'Where is the dog? 🐕', question: '',
    options: ['🐱', '🐕', '🐰', '🐭'], correct: 1, minAge: 3, maxAge: 5
  },
  {
    id: 2, type: 'shape-sort', questionAr: 'اختر الدائرة 🔵', questionEn: 'Choose the circle 🔵', question: '',
    options: ['⭐', '🔵', '⬛', '🔺'], correct: 1, minAge: 3, maxAge: 5
  },
  // Basic Spatial Awareness
  {
    id: 3, type: 'image-match', questionAr: 'ما هو الشيء الذي نأكله؟ 🍎', questionEn: 'Which one do we eat? 🍎', question: '',
    options: ['🚗', '🍎', '👟', '🏠'], correct: 1, minAge: 3, maxAge: 5
  },
  // Simple Quantity (1-3)
  {
    id: 4, type: 'counting', questionAr: 'اختر الصندوق الذي به نجمة واحدة ⭐', questionEn: 'Choose the box with 1 star ⭐', question: '',
    options: ['⭐', '⭐⭐', '⭐⭐⭐', '🚫'], correct: 0, minAge: 3, maxAge: 5
  },

  // --- MIDDLE CHILDHOOD (5-8) ---
  // Categorization
  {
    id: 5, type: 'image-match', questionAr: 'أي من هؤلاء هو حيوان؟ 🦁', questionEn: 'Which one is an animal? 🦁', question: '',
    options: ['🥦', '🚗', '🦁', '🎺'], correct: 2, minAge: 4, maxAge: 7
  },
  // Pattern Completion (A-B-A)
  {
    id: 6, type: 'pattern', questionAr: 'ما اللون التالي؟ 🔴 🔵 🔴 ...', questionEn: 'What color is next? 🔴 🔵 🔴 ...', question: '',
    options: ['🔴', '🔵', '🟡', '🟢'], correct: 1, minAge: 5, maxAge: 8
  },
  // Functional Knowledge
  {
    id: 7, type: 'image-match', questionAr: 'ماذا نلبس عندما تمطر؟ 🌧️', questionEn: 'What do we wear when it rains? 🌧️', question: '',
    options: ['🕶️', '🧥', '🩴', '👑'], correct: 1, minAge: 5, maxAge: 8
  },
  // Number Recognition & Correspondence
  {
    id: 8, type: 'counting', questionAr: 'اختر الرقم 4', questionEn: 'Choose the number 4', question: '',
    options: ['2', '3', '4', '5'], correct: 2, minAge: 5, maxAge: 8
  },
  // Simple Shapes (Complex)
  {
    id: 9, type: 'shape-sort', questionAr: 'أين النجمة؟ ⭐', questionEn: 'Where is the star? ⭐', question: '',
    options: ['⬛', '🔺', '⭐', '🔵'], correct: 2, minAge: 4, maxAge: 8
  },

  // --- LATE CHILDHOOD / ADVANCED (8-12) ---
  // Logical Deduction
  {
    id: 10, type: 'image-match', questionAr: 'الطائر يطير، السمكة ...؟', questionEn: 'Bird flies, Fish ...?', question: '',
    options: ['تنام (Sleep)', 'تسبح (Swim)', 'تمشي (Walk)', 'تقفز (Jump)'], correct: 1, minAge: 7, maxAge: 12
  },
  // Numerical Series
  {
    id: 11, type: 'pattern', questionAr: 'أكمل الأرقام: 2, 4, 6, ...', questionEn: 'Complete the numbers: 2, 4, 6, ...', question: '',
    options: ['7', '8', '9', '10'], correct: 1, minAge: 8, maxAge: 12
  },
  // Sequence / Time
  {
    id: 12, type: 'pattern', questionAr: 'ماذا نفعل أولاً في الصباح؟', questionEn: 'What do we do first in the morning?', question: '',
    options: ['ننام (Sleep)', 'نأكل العشاء (Dinner)', 'نستيقظ (Wake up)', 'نلعب في الحديقة (Play)'], correct: 2, minAge: 6, maxAge: 11
  },
  // Auditory-Visual Association (Mental representation)
  {
    id: 13, type: 'sound-recognition', questionAr: 'أي حيوان يقول "مياو"؟ 🐈', questionEn: 'Which animal says "Meow"? 🐈', question: '',
    options: ['🐕', '🐈', '🐄', '🦁'], correct: 1, minAge: 4, maxAge: 9
  },
  // Spatial Rotation (Simplified)
  {
    id: 14, type: 'shape-sort', questionAr: 'اختر الشكل الذي يشبه المربع ⬛', questionEn: 'Choose the shape that looks like a square ⬛', question: '',
    options: ['🔶', '🟦', '🔺', '🟡'], correct: 1, minAge: 6, maxAge: 10
  }
];

// Function to select age-appropriate tasks
function selectTasksForAge(age: number): Task[] {
  const ageTasks = taskPool.filter(task => age >= task.minAge && age <= task.maxAge);
  // Shuffle and select 10 tasks
  const shuffled = [...ageTasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

export function AIAssessmentScreen() {
  const { navigateTo, setAssessmentResult, childProfile, logActivity, setIrisProfile } = useApp();
  const { speak, playSound } = useAudio();
  const { t, language } = useLanguage();

  const [started, setStarted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Initialize tasks based on child's age
  useEffect(() => {
    const childAge = childProfile?.age || 5;
    let selectedTasks = selectTasksForAge(childAge);
    if (selectedTasks.length === 0) selectedTasks = selectTasksForAge(5);

    const tasksWithLanguage = selectedTasks.map(task => ({
      ...task,
      question: language === 'ar' ? task.questionAr : task.questionEn
    }));

    setTasks(tasksWithLanguage);
  }, [childProfile, language]);

  const handleStart = () => {
    setStarted(true);
    playSound('celebration');
    speak(language === 'ar' ? 'هيا بنا نبدأ التقييم الذكي!' : "Let's start the smart assessment!", language);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === tasks[currentTask].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      playSound('success');
    } else {
      playSound('error');
    }

    setTimeout(() => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        finishAssessment();
      }
    }, 1500);
  };

  const finishAssessment = () => {
    const finalScore = Math.round((score / tasks.length) * 100);
    const result: AssessmentResult = {
      score: finalScore,
      completedAt: new Date().toISOString(),
      cognitiveLevel: finalScore >= 80 ? 'advanced' : finalScore >= 50 ? 'intermediate' : 'beginner',
      recommendations: finalScore < 50
        ? (language === 'ar' ? ['التركيز على مهارات النطق', 'تدريبات الذاكرة البصرية'] : ['Focus on speech skills', 'Visual memory exercises'])
        : (language === 'ar' ? ['تطوير المهارات الاجتماعية', 'القصص التفاعلية'] : ['Develop social skills', 'Interactive stories'])
    };

    setAssessmentResult(result);
    setIrisProfile(null); // Force reconstruction with new data
    setShowResult(true);
    playSound('celebration');

    logActivity({
      type: 'assessment',
      taskAr: 'إكمال التقييم الذكي',
      taskEn: 'Completed Smart Assessment',
      icon: '🧠'
    });
  };

  const handleBack = () => {
    playSound('tap');
    navigateTo('splash');
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center p-4">
        <BackButton onClick={handleBack} />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full">
          <Card className="p-12 text-center rounded-[3rem] shadow-2xl border-8 border-white">
            <div className="size-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Brain className="size-16 text-purple-600" />
            </div>
            <h1 className="text-5xl font-black text-gray-800 mb-6 leading-tight">
              {language === 'ar' ? 'التقييم الذكي المبدئي' : 'Initial AI Assessment'}
            </h1>
            <p className="text-2xl text-gray-600 mb-12 font-bold leading-relaxed">
              {language === 'ar'
                ? 'ساعدنا في التعرف على مستوى طفلك لنقدم له أفضل تجربة تعليمية مخصصة.'
                : 'Help us identify your child\'s level to provide the best personalized learning experience.'}
            </p>
            <Button onClick={handleStart} size="lg" className="w-full h-20 text-3xl font-black bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-2xl shadow-xl transition-all active:scale-95">
              {language === 'ar' ? 'ابدأ الآن' : 'Start Now'} 🚀
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full">
          <Card className="p-12 text-center rounded-[3rem] shadow-2xl border-8 border-white bg-white">
            <div className="relative inline-block mb-8">
              <Trophy className="size-32 text-yellow-500" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="absolute -top-4 -right-4">
                <Star className="size-12 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </div>
            <h2 className="text-5xl font-black text-gray-800 mb-4">{language === 'ar' ? 'أحسنت يا بطل!' : 'Well Done, Hero!'}</h2>
            <p className="text-2xl text-gray-600 mb-8 font-bold">
              {language === 'ar' ? 'لقد أكملت التقييم بنجاح. هيا نستكشف عالمنا الممتع!' : 'You completed the assessment. Let\'s explore our fun world!'}
            </p>
            <Button onClick={() => navigateTo('mode-selection')} size="lg" className="w-full h-20 text-3xl font-black bg-green-500 hover:bg-green-600 rounded-2xl shadow-xl">
              {language === 'ar' ? 'التوج إلى الواجهة الرئيسية' : 'Go to Home'} 🏠
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const task = tasks[currentTask];
  if (!task) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-black text-purple-600">{language === 'ar' ? 'التقدم' : 'Progress'}</span>
            <span className="text-2xl font-black text-purple-600">{currentTask + 1} / {tasks.length}</span>
          </div>
          <Progress value={(currentTask / tasks.length) * 100} className="h-4 rounded-full border-2 border-white shadow-inner" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentTask} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-12">
            <h2 className="text-5xl font-black text-center text-gray-800 leading-tight bg-white p-12 rounded-[3rem] shadow-xl border-8 border-white">
              {task.question}
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {task.options.map((option, index) => (
                <motion.button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }} whileTap={{ scale: 0.95 }} className={`aspect-square rounded-[3rem] border-8 text-9xl flex items-center justify-center transition-all duration-300 relative shadow-2xl ${selectedAnswer === index ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : selectedAnswer === null ? 'border-white bg-white hover:border-purple-200' : index === task.correct ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50 opacity-40'}`}>
                  {option}
                  {selectedAnswer === index && isCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center">
                      <Check className="size-32 text-green-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-center p-8 rounded-[2.5rem] border-4 ${isCorrect ? 'bg-green-100 border-green-200 text-green-700' : 'bg-orange-100 border-orange-200 text-orange-700'}`}>
                <p className="text-4xl font-black">
                  {isCorrect ? (language === 'ar' ? 'رائع جداً! 🌟' : 'Super Awesome! 🌟') : (language === 'ar' ? 'أحسنت المحاولة! 💪' : 'Great Effort! 💪')}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}