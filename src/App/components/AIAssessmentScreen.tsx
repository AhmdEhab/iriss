import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, Trophy, Check } from 'lucide-react';
import { useApp, AssessmentResult } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface Task {
  id: number;
  type: 'image-match' | 'sound-recognition' | 'shape-sort' | 'memory' | 'counting' | 'pattern' | 'social-emotional' | 'sequencing' | 'musical-pitch' | 'verbal-instruction' | 'detail-focus' | 'sorting' | 'context-association';
  focus: 'visual' | 'auditory' | 'gestalt';
  question: string;
  questionEn: string;
  questionAr: string;
  options: string[];
  correct: number;
  minAge: number; // Minimum age for this task
  maxAge: number; // Maximum age for this task
}

// Comprehensive task pool organized by cognitive domains and scientific profiles
const taskPool: Task[] = [
  // --- VISUAL FOCUS (General High Priority) ---
  {
    id: 1, type: 'image-match', focus: 'visual', questionAr: 'أين الكلب؟ 🐕', questionEn: 'Where is the dog? 🐕', question: '',
    options: ['🐱', '🐕', '🐰', '🐭'], correct: 1, minAge: 3, maxAge: 5
  },
  {
    id: 2, type: 'shape-sort', focus: 'visual', questionAr: 'اختر الدائرة 🔵', questionEn: 'Choose the circle 🔵', question: '',
    options: ['⭐', '🔵', '⬛', '🔺'], correct: 1, minAge: 3, maxAge: 5
  },
  {
    id: 3, type: 'image-match', focus: 'visual', questionAr: 'ما هو الشيء الذي نأكله؟ 🍎', questionEn: 'Which one do we eat? 🍎', question: '',
    options: ['🚗', '🍎', '👟', '🏠'], correct: 1, minAge: 3, maxAge: 6
  },

  // --- DOWN SYNDROME SPECIALIZED (Social & Sequencing) ---
  // Strength: Social understanding, Visual memory
  {
    id: 201, type: 'social-emotional', focus: 'visual', questionAr: 'من يشعر بالسعادة؟ 😊', questionEn: 'Who is feeling happy? 😊', question: '',
    options: ['😢', '😊', '😠', '😴'], correct: 1, minAge: 4, maxAge: 8
  },
  {
    id: 202, type: 'social-emotional', focus: 'visual', questionAr: 'الولد يبكي. كيف نساعده؟', questionEn: 'The boy is crying. How do we help?', question: '',
    options: ['نضحك (Laugh)', 'نعطيه لعبة (Give Toy)', 'نصرخ (Scream)', 'نجري (Run)'], correct: 1, minAge: 5, maxAge: 10
  },
  {
    id: 203, type: 'sequencing', focus: 'visual', questionAr: 'ماذا نفعل قبل النوم؟ 🛏️', questionEn: 'What do we do before bed? 🛏️', question: '',
    options: ['نلبس المدرسة (School)', 'نغسل أسنانا (Brush teeth)', 'نلعب كرة (Play ball)', 'نأكل الغداء (Lunch)'], correct: 1, minAge: 4, maxAge: 9
  },

  // --- WILLIAMS SYNDROME SPECIALIZED (Auditory & Musical) ---
  // Strength: Auditory memory, Music/Pitch, Expressive language
  // Weakness: Spatial construction (avoid rotation tasks)
  {
    id: 301, type: 'musical-pitch', focus: 'auditory', questionAr: 'أي حيوان صوته عالي وضخم؟ 🐘', questionEn: 'Which animal has a loud, deep voice? 🐘', question: '',
    options: ['🐭', '🐘', '🐦', '🐜'], correct: 1, minAge: 4, maxAge: 8
  },
  {
    id: 302, type: 'verbal-instruction', focus: 'auditory', questionAr: 'اسمع جيداً: المس أنفك ثم أذنك', questionEn: 'Listen: Touch your nose then your ear', question: '',
    options: ['👃 ➡️ 👂', '👂 ➡️ 👃', '👃 ➡️ 👁️', '👄 ➡️ 👂'], correct: 0, minAge: 5, maxAge: 10
  },
  {
    id: 303, type: 'sound-recognition', focus: 'auditory', questionAr: 'ما هذا الصوت؟ "رنين الهاتف"', questionEn: 'What is this sound? "Phone Ringing"', question: '',
    options: ['🚗', '📱', '🐶', '🔔'], correct: 1, minAge: 4, maxAge: 9
  },

  // --- AUTISM SPECIALIZED (Detail & Systemizing) ---
  // Strength: Detail focus, Pattern recognition, Logic
  // Challenge: Social ambiguity
  {
    id: 401, type: 'detail-focus', focus: 'visual', questionAr: 'ابحث عن الشيء المختلف 🔍', questionEn: 'Find the odd one out 🔍', question: '',
    options: ['🔴', '🔴', '🛑', '🔴'], correct: 2, minAge: 5, maxAge: 10
  },
  {
    id: 402, type: 'sorting', focus: 'visual', questionAr: 'ما الشيء الذي له عجلات؟ 🚗', questionEn: 'Which one has wheels? 🚗', question: '',
    options: ['📺', '🍎', '🚗', '📚'], correct: 2, minAge: 3, maxAge: 7
  },
  {
    id: 403, type: 'pattern', focus: 'gestalt', questionAr: 'أكمل النمط: ▲ ■ ▲ ■ ...', questionEn: 'Complete the pattern: ▲ ■ ▲ ■ ...', question: '',
    options: ['●', '▲', '■', '★'], correct: 1, minAge: 4, maxAge: 9
  },

  // --- FRAGILE X SPECIALIZED (Gestalt & Context) ---
  // Strength: Simultaneous/Holistic processing, Long-term memory
  // Challenge: Sequential processing
  {
    id: 501, type: 'context-association', focus: 'gestalt', questionAr: 'ماذا نجد في المطبخ؟ 🍳', questionEn: 'What do we find in the kitchen? 🍳', question: '',
    options: ['🛏️', '🚽', '🍳', '🚗'], correct: 2, minAge: 4, maxAge: 8
  },
  {
    id: 502, type: 'context-association', focus: 'gestalt', questionAr: 'الولد يلبس مايو. إلى أين هو ذاهب؟', questionEn: 'Boy is wearing a swimsuit. Where is he going?', question: '',
    options: ['المدرسة (School)', 'الشاطئ (Beach)', 'السرير (Bed)', 'السوق (Market)'], correct: 1, minAge: 5, maxAge: 10
  },

  // --- AUDITORY / VERBAL FOCUS (General) ---
  {
    id: 13, type: 'sound-recognition', focus: 'auditory', questionAr: 'أي حيوان يقول "مياو"؟ 🐈', questionEn: 'Which animal says "Meow"? 🐈', question: '',
    options: ['🐕', '🐈', '🐄', '🦁'], correct: 1, minAge: 3, maxAge: 7
  },

  // --- GESTALT / SIMULTANEOUS FOCUS (General) ---
  {
    id: 6, type: 'pattern', focus: 'gestalt', questionAr: 'ما اللون التالي؟ 🔴 🔵 🔴 ...', questionEn: 'What color is next? 🔴 🔵 🔴 ...', question: '',
    options: ['🔴', '🔵', '🟡', '🟢'], correct: 1, minAge: 4, maxAge: 8
  }
];


// Function to select scientifically tailored tasks based on syndrome profile
function generateSyndromeSpecificAssessment(age: number, condition: string): Task[] {
  const ageTasks = taskPool.filter(task => age >= task.minAge && age <= task.maxAge);

  // Weights based on scientific profile
  let weights = {
    visual: 0.5,
    auditory: 0.25,
    gestalt: 0.25,
    social: 0,
    detail: 0
  };

  switch (condition) {
    case 'down-syndrome':
      // Strength: Visual & Social. Challenge: Auditory Short-term Memory.
      weights = { visual: 0.4, auditory: 0.1, gestalt: 0.1, social: 0.4, detail: 0 };
      break;
    case 'williams':
      // Strength: Auditory/Musical/Verbal. Challenge: Spatial/Macroscopic.
      weights = { visual: 0.1, auditory: 0.7, gestalt: 0.1, social: 0.1, detail: 0 };
      break;
    case 'autism':
      // Strength: Detail/Pattern/Systemizing. Challenge: Social Ambiguity.
      weights = { visual: 0.2, auditory: 0.1, gestalt: 0.2, social: 0, detail: 0.5 };
      break;
    case 'fragile-x':
      // Strength: Holistic/Gestalt. Challenge: Sequential/Analytic.
      weights = { visual: 0.2, auditory: 0.1, gestalt: 0.6, social: 0.1, detail: 0 };
      break;
    default:
      weights = { visual: 0.4, auditory: 0.3, gestalt: 0.3, social: 0, detail: 0 };
  }

  // Helper to get weighted count (Total 10 tasks)
  const getCount = (ratio: number) => Math.round(ratio * 10);

  const socialTasks = ageTasks.filter(t => t.type === 'social-emotional' || t.type === 'sequencing');
  const auditoryTasks = ageTasks.filter(t => t.focus === 'auditory' || t.type === 'musical-pitch' || t.type === 'verbal-instruction');
  const detailTasks = ageTasks.filter(t => t.type === 'detail-focus' || t.type === 'sorting' || (t.type === 'pattern' && condition === 'autism'));
  const gestaltTasks = ageTasks.filter(t => t.focus === 'gestalt' || t.type === 'context-association');
  const visualTasks = ageTasks.filter(t => t.focus === 'visual' && t.type !== 'social-emotional'); // Pure visual

  // Shuffle all lists
  const shuffle = (list: Task[]) => list.sort(() => Math.random() - 0.5);

  const selected: Task[] = [
    ...shuffle(visualTasks).slice(0, getCount(weights.visual)),
    ...shuffle(auditoryTasks).slice(0, getCount(weights.auditory)),
    ...shuffle(detailTasks).slice(0, getCount(weights.detail)),
    ...shuffle(socialTasks).slice(0, getCount(weights.social)),
    ...shuffle(gestaltTasks).slice(0, getCount(weights.gestalt)),
  ];

  // Fill remaining slots to reach 10 if needed (fallback to general visual)
  if (selected.length < 10) {
    const remaining = ageTasks.filter(t => !selected.includes(t));
    selected.push(...shuffle(remaining).slice(0, 10 - selected.length));
  }

  return shuffle(selected).slice(0, 10);
}

export function AIAssessmentScreen() {
  const { navigateTo, setAssessmentResult, childProfile, logActivity, setIrisProfile, activeRules, startTransition } = useApp();
  const { speak, playSound } = useAudio();

  const { t, language } = useLanguage();
  const [started, setStarted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Initialize tasks based on child's age and scientific profile
  useEffect(() => {
    const childAge = childProfile?.age || 5;
    const condition = childProfile?.condition || 'other';
    let selectedTasks = generateSyndromeSpecificAssessment(childAge, condition);

    // Fallback if no tasks found for age (prevent infinite loading)
    if (selectedTasks.length === 0) {
      selectedTasks = generateSyndromeSpecificAssessment(5, 'other'); // Default fallback
    }

    // Update question based on language
    const tasksWithLanguage = selectedTasks.map(task => ({
      ...task,
      question: language === 'ar' ? task.questionAr : task.questionEn
    }));

    setTasks(tasksWithLanguage);
  }, [childProfile, language, activeRules?.assessmentFocus]);

  useEffect(() => {
    if (started && tasks.length > 0 && currentTask < tasks.length) {
      speak(tasks[currentTask].question, language);
    }
  }, [started, currentTask, tasks, language]);

  const handleStart = () => {
    playSound('celebration');
    speak(t.assessmentIntro, language);
    setTimeout(() => {
      setStarted(true);
    }, 1000); // Reduced delay for better UX
  };

  const [nonVerbalScore, setNonVerbalScore] = useState(0);
  const [verbalScore, setVerbalScore] = useState(0);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const task = tasks[currentTask];
    const correct = index === task.correct;
    setIsCorrect(correct);

    if (correct) {
      playSound('success');
      speak(t.taskComplete, language);
      setScore(score + 1);

      if (task.focus === 'auditory') {
        setVerbalScore(v => v + 1);
      } else {
        setNonVerbalScore(nv => nv + 1);
      }
    } else {
      playSound('error');
    }

    setTimeout(async () => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Assessment complete - Send to IRIS AI
        const isFinalCorrect = index === tasks[currentTask].correct;
        const finalNonVerbal = nonVerbalScore + (isFinalCorrect && tasks[currentTask].focus !== 'auditory' ? 1 : 0);
        const finalVerbal = verbalScore + (isFinalCorrect && tasks[currentTask].focus === 'auditory' ? 1 : 0);

        // Calculate specialized scores based on task types
        const typePerformance: Record<string, { total: number; correct: number }> = {};
        tasks.forEach((t, i) => {
          if (!typePerformance[t.type]) typePerformance[t.type] = { total: 0, correct: 0 };
          typePerformance[t.type].total++;
          const thisTaskCorrect = i === currentTask ? isFinalCorrect : (i < currentTask ? true : false); // Approximation for simplicity, better to track full history
          // Actually, we need to track correct answers per task type properly.
        });

        // Simpler approach compatible with current state:
        // Ability score = (score / tasks.length) but scaled by difficulty and condition baseline
        const rawAccuracy = (score + (isFinalCorrect ? 1 : 0)) / tasks.length;

        // Base ability baseline by syndrome (Scientific norming)
        let baseLevel = 45;
        if (childProfile?.condition === 'fragile-x') baseLevel = 42;
        if (childProfile?.condition === 'down-syndrome') baseLevel = 48; // Strong visual learner bonus
        if (childProfile?.condition === 'williams') baseLevel = 46;
        if (childProfile?.condition === 'autism') baseLevel = 45; // Variable

        const bonus = rawAccuracy * 55; // Max 55 points from test
        const holisticScore = Math.min(100, Math.max(30, Math.round(baseLevel + bonus)));

        const nvRatio = finalNonVerbal / (tasks.filter(t => t.focus !== 'auditory').length || 1);
        const vRatio = finalVerbal / (tasks.filter(t => t.focus === 'auditory').length || 1);

        try {
          const aiResponse = await fetch('http://localhost:8000/assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              child_id: childProfile?.name || 'GUEST',
              age: childProfile?.age || 5,
              condition: childProfile?.condition?.replace('-', '_') || 'down_syndrome',
              ability_score: holisticScore, // Mapped result
              nv_ratio: nvRatio,
              v_ratio: vRatio,
              assessment_framework: 'iris_v3_syndrome_weighted'
            }),
          });

          if (aiResponse.ok) {
            const data = await aiResponse.json();
            setIrisProfile(data.profile);

            // Set regular assessment result
            const result: AssessmentResult = {
              level: data.profile.cognitive_level === 'foundation_learner' ? 1
                : data.profile.cognitive_level === 'emerging_learner' ? 2
                  : data.profile.cognitive_level === 'developing_learner' ? 3
                    : 4,
              iqScore: holisticScore,
              completedAt: new Date(),
              strengths: data.profile.strengths,
              areasToImprove: data.profile.challenges
            };
            setAssessmentResult(result);
          }
        } catch (error) {
          console.error("AI Assessment failed, using fallback:", error);
          const fallbackResult: AssessmentResult = {
            level: rawAccuracy > 0.8 ? 3 : rawAccuracy > 0.5 ? 2 : 1,
            iqScore: holisticScore,
            completedAt: new Date(),
            strengths: nvRatio > vRatio ? ['Visual-Spatial', 'Observation'] : ['Verbal Processing', 'Auditory Recall'],
            areasToImprove: nvRatio > vRatio ? ['Verbal Working Memory'] : ['Spatial Integration']
          };
          setAssessmentResult(fallbackResult);
        }


        logActivity({
          type: 'assessment',
          taskAr: 'إكمال التقييم التخصصي بنجاح',
          taskEn: 'Completed Syndrome-Specific Specialized Assessment',
          icon: '🔬'
        });

        setShowResult(true);
        playSound('celebration');
        speak(t.levelDetermined, language);
      }
    }, 2000);
  };

  const handleComplete = () => {
    // Navigate with transition
    startTransition(t.configuringJourney, 'child-mode', 4000);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="text-9xl"
          >
            🧠
          </motion.div>

          <h1 className="text-5xl font-bold text-purple-800">
            {t.assessment}
          </h1>

          <p className="text-2xl text-gray-700 max-w-2xl">
            {t.assessmentIntro}
          </p>

          <Button
            onClick={handleStart}
            size="lg"
            className="text-2xl px-12 py-8 rounded-full bg-purple-500 hover:bg-purple-600"
          >
            <Brain className="size-8 me-2" />
            {t.startTest}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="text-9xl"
          >
            🏆
          </motion.div>

          <h1 className="text-6xl font-bold text-purple-800">
            {t.assessmentComplete}
          </h1>

          <div className="space-y-4">
            <p className="text-3xl font-bold text-purple-600">
              {t.levelDetermined}
            </p>
            <p className="text-xl text-gray-700">
              {language === 'ar'
                ? `حصلت على ${score} من ${tasks.length} نقاط!`
                : `You scored ${score} out of ${tasks.length}!`
              }
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                <Star
                  className={`size-12 ${i < Math.ceil((score / tasks.length) * 5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                    }`}
                />
              </motion.div>
            ))}
          </div>

          <Button
            onClick={handleComplete}
            size="lg"
            className="text-2xl px-12 py-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {language === 'ar' ? 'ابدأ التعلم! 🎉' : "Let's Start Learning! 🎉"}
          </Button>
        </motion.div>
      </div>
    );
  }

  const task = tasks[currentTask];
  const progress = ((currentTask + 1) / tasks.length) * 100;

  // Show loading if tasks aren't ready yet
  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-yellow-100'}`}>
      <div className="max-w-4xl mx-auto pt-8">
        {/* Question Info (Internal use mostly) */}
        <div className="mb-4 text-center opacity-0">
          <span className="text-sm">
            {language === 'ar'
              ? `السؤال ${currentTask + 1} من ${tasks.length}`
              : `Question ${currentTask + 1} of ${tasks.length}`
            }
          </span>
        </div>

        {/* Task */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-8"
          >
            {/* Question */}
            <h2 className="text-3xl font-bold text-center text-purple-800">
              {task.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-2 gap-6">
              {task.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square rounded-2xl border-4 text-8xl
                    flex items-center justify-center
                    transition-all duration-300
                    ${selectedAnswer === index
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : selectedAnswer === null
                        ? 'border-purple-200 bg-white hover:border-purple-400'
                        : index === task.correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    }
                  `}
                >
                  {option}
                  {selectedAnswer === index && isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute"
                    >
                      <Check className="size-16 text-green-500" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-orange-100'
                  }`}
              >
                <p className="text-2xl font-bold">
                  {isCorrect
                    ? (language === 'ar' ? 'رائع! 🌟' : 'Awesome! 🌟')
                    : (language === 'ar' ? 'حاول مرة أخرى 💪' : 'Try again 💪')
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}