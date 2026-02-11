import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

interface SkillStep {
    textAr: string;
    textEn: string;
}

interface LifeSkill {
    id: string;
    titleAr: string;
    titleEn: string;
    emoji: string;
    color: string;
    steps: SkillStep[];
    tipAr: string;
    tipEn: string;
}

export function LifeSkillsScreen() {
    const { navigateTo, incrementProgress, activeRules } = useApp();
    const { speak, playSound, stopSpeaking } = useAudio();
    const { t, language, dir } = useLanguage();
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [journeyStep, setJourneyStep] = useState(-1); // -1: Overview, 0..N: Specific Step Focus

    const skills: LifeSkill[] = [
        {
            id: 'washing-hands',
            titleAr: 'غسل اليدين',
            titleEn: 'Washing Hands',
            emoji: '🧼',
            color: 'from-blue-300 to-cyan-400',
            steps: [
                { textAr: 'افتح الصنبور وبلل يديك بالماء.', textEn: 'Turn on the tap and wet your hands with water.' },
                { textAr: 'ضع الصابون وافرك يديك جيداً لمدة 20 ثانية.', textEn: 'Put soap and scrub your hands well for 20 seconds.' },
                { textAr: 'اغسل يديك بالماء لإزالة الصابون.', textEn: 'Rinse your hands with water to remove the soap.' },
                { textAr: 'جفف يديك بمنشفة نظيفة.', textEn: 'Dry your hands with a clean towel.' }
            ],
            tipAr: 'اغسل يديك دائماً قبل الأكل وبعد اللعب!',
            tipEn: 'Always wash your hands before eating and after playing!'
        },
        {
            id: 'brushing-teeth',
            titleAr: 'تنظيف الأسنان',
            titleEn: 'Brushing Teeth',
            emoji: '🪥',
            color: 'from-purple-300 to-indigo-400',
            steps: [
                { textAr: 'ضع كمية صغيرة من معجون الأسنان على الفرشاة.', textEn: 'Put a small amount of toothpaste on the brush.' },
                { textAr: 'نظف أسنانك من الأعلى والأسفل بحركات دائرية.', textEn: 'Clean your teeth up and down in circular motions.' },
                { textAr: 'نظف لسانك بلطف أيضاً.', textEn: 'Clean your tongue gently too.' },
                { textAr: 'اغسل فمك بالماء جيداً.', textEn: 'Rinse your mouth with water well.' }
            ],
            tipAr: 'نظف أسنانك مرتين يومياً لتبقى قوية وبيضاء!',
            tipEn: 'Brush your teeth twice a day to keep them strong and white!'
        },
        {
            id: 'tidying-up',
            titleAr: 'ترتيب الألعاب',
            titleEn: 'Tidying Up Toys',
            emoji: '🧸',
            color: 'from-yellow-300 to-orange-400',
            steps: [
                { textAr: 'اجمع ألعابك المبعثرة على الأرض.', textEn: 'Gather your toys scattered on the floor.' },
                { textAr: 'ضع كل نوع من الألعاب في مكانه المخصص.', textEn: 'Put each type of toy in its designated place.' },
                { textAr: 'تأكد من أن الغرفة أصبحت نظيفة ومرتبة.', textEn: 'Make sure the room is now clean and tidy.' }
            ],
            tipAr: 'ترتيب الألعاب يجعل غرفتك جميلة ويسهل عليك اللعب غداً!',
            tipEn: 'Tidying toys makes your room beautiful and easy to play tomorrow!'
        },
        {
            id: 'eating-healthy',
            titleAr: 'الأكل الصحي',
            titleEn: 'Healthy Eating',
            emoji: '🥗',
            color: 'from-green-300 to-emerald-400',
            steps: [
                { textAr: 'اختر الفواكه والخضروات الملونة لتأكلها.', textEn: 'Choose colorful fruits and vegetables to eat.' },
                { textAr: 'اشرب الكثير من الماء ليبقى جسمك نشيطاً.', textEn: 'Drink plenty of water to keep your body active.' },
                { textAr: 'تجنب الكثير من الحلويات والسكريات.', textEn: 'Avoid too many sweets and sugars.' }
            ],
            tipAr: 'الأكل الصحي يجعلك قوياً وذكياً!',
            tipEn: 'Healthy eating makes you strong and smart!'
        }
    ];

    const handleBack = () => {
        playSound('tap');
        stopSpeaking();
        setIsPlaying(false);
        setJourneyStep(-1);
        setSelectedSkillId(null);
        navigateTo('child-mode');
    };

    const selectedSkill = skills.find(s => s.id === selectedSkillId);

    const handleSkillSelect = (skill: LifeSkill) => {
        playSound('tap');
        setSelectedSkillId(skill.id);
        setIsPlaying(false);

        const style = activeRules?.instructionStyle || 'object-first';

        if (style === 'whole-scene') {
            // Fragile X: Show Overview (Timeline) first
            setJourneyStep(-1);
            const title = language === 'ar' ? skill.titleAr : skill.titleEn;
            speak(`${title}. ${language === 'ar' ? 'لنرَ الخطوات معاً' : 'Let\'s see the steps together.'}`, language);
        } else if (style === 'object-first') {
            // Down Syndrome: Focus on Step 1 immediately
            setJourneyStep(0);
            const stepText = language === 'ar' ? skill.steps[0].textAr : skill.steps[0].textEn;
            speak(stepText, language);
        } else {
            // Williams / Default: Narrative Intro then steps
            setJourneyStep(-1);
            const title = language === 'ar' ? skill.titleAr : skill.titleEn;
            speak(`${title}.`, language);
        }
    };

    const handlePlayInstructions = () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
            playSound('tap');
        } else if (selectedSkill) {
            if (journeyStep === -1) {
                // Play all steps summary
                const title = language === 'ar' ? selectedSkill.titleAr : selectedSkill.titleEn;
                const stepsText = selectedSkill.steps.map((step, i) =>
                    `${language === 'ar' ? 'الخطوة' : 'Step'} ${i + 1}: ${language === 'ar' ? step.textAr : step.textEn}`
                ).join('. ');
                speak(`${title}. ${stepsText}.`, language);
            } else {
                // Play current step only
                const step = selectedSkill.steps[journeyStep];
                const text = language === 'ar' ? step.textAr : step.textEn;
                speak(text, language);
            }
            setIsPlaying(true);
            playSound('success');
        }
    };

    const handleNextStep = () => {
        if (!selectedSkill) return;
        if (journeyStep < selectedSkill.steps.length - 1) {
            const nextStep = journeyStep + 1;
            setJourneyStep(nextStep);
            playSound('tap');
            const step = selectedSkill.steps[nextStep];
            speak(language === 'ar' ? step.textAr : step.textEn, language);
        } else {
            // Done
            setJourneyStep(-1); // Back to overview or finish
            playSound('success');
        }
    };

    const handlePrevStep = () => {
        if (journeyStep > 0) {
            const prevStep = journeyStep - 1;
            setJourneyStep(prevStep);
            playSound('tap');
        } else {
            setJourneyStep(-1); // Back to overview
            playSound('tap');
        }
    };

    return (
        <div className={`min-h-screen p-4 transition-colors duration-500 ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-gradient-to-br from-blue-100 via-white to-yellow-100'}`}>
            <BackButton onClick={handleBack} />
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-24" />
                    <h1 className={`text-5xl font-bold drop-shadow-lg text-center flex-1 ${activeRules?.sensoryProfile === 'low-arousal' ? 'text-indigo-800' : 'text-indigo-700'}`}>
                        {language === 'ar' ? 'عادات صحية' : 'Healthy Habits'} 🏠
                    </h1>
                    <div className="w-24" />
                </div>

                {!selectedSkillId ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div key={skill.id} initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ scale: 1.02 }}>
                                <button onClick={() => handleSkillSelect(skill)} className={`w-full ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-100' : 'bg-white'} rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center p-8 gap-8 border-4 border-white transition-all hover:shadow-3xl group`}>
                                    <div className={`size-24 rounded-2xl bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-300 to-slate-400' : skill.color} flex items-center justify-center text-5xl shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        {skill.emoji}
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-3xl font-black text-gray-800 mb-2">
                                            {language === 'ar' ? skill.titleAr : skill.titleEn}
                                        </h3>
                                        <p className="text-xl text-gray-500 font-medium">
                                            {language === 'ar' ? 'تعلم كيف تفعل ذلك بسهولة!' : 'Learn how to do it easily!'}
                                        </p>
                                    </div>
                                    <div className={`text-4xl ${dir === 'rtl' ? 'rotate-180' : ''} text-gray-300 group-hover:text-indigo-500 transition-colors`}>
                                        ➡️
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto">
                        {selectedSkill && (
                            <Card className={`overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-50' : 'bg-white'}`}>
                                <div className={`bg-gradient-to-r ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-400 to-slate-500' : selectedSkill.color} p-12 text-center text-white relative`}>
                                    <motion.div animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }} transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }} className="text-[8rem] mb-6 drop-shadow-2xl">
                                        {selectedSkill.emoji}
                                    </motion.div>
                                    <h2 className="text-6xl font-black drop-shadow-lg">
                                        {language === 'ar' ? selectedSkill.titleAr : selectedSkill.titleEn}
                                    </h2>
                                </div>

                                <div className="p-10 space-y-8 min-h-[400px]">
                                    {journeyStep === -1 ? (
                                        // Overview Mode (Timeline) - Fragile X Preference
                                        <div className="grid gap-6">
                                            {selectedSkill.steps.map((step, i) => (
                                                <motion.button
                                                    key={i}
                                                    onClick={() => { setJourneyStep(i); const text = language === 'ar' ? step.textAr : step.textEn; speak(text, language); }}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * i }}
                                                    className={`flex items-start gap-6 p-6 rounded-3xl border-2 shadow-sm text-left hover:bg-indigo-50 transition-colors w-full ${activeRules?.sensoryProfile === 'low-arousal' ? 'bg-slate-100 border-slate-200' : 'bg-gray-50 border-gray-100'}`}
                                                >
                                                    <div className={`size-12 rounded-full bg-gradient-to-br ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-300 to-slate-400' : selectedSkill.color} flex items-center justify-center text-2xl font-black text-white shadow-md flex-shrink-0`}>
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-700 leading-relaxed">
                                                        {language === 'ar' ? step.textAr : step.textEn}
                                                    </p>
                                                </motion.button>
                                            ))}
                                        </div>
                                    ) : (
                                        // Focus Mode (One Step) - Down Syndrome Preference
                                        <motion.div
                                            key={journeyStep}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center p-10 rounded-[3rem] bg-indigo-50 border-4 border-indigo-100 h-full"
                                        >
                                            <div className="text-9xl font-black text-indigo-200 mb-6">
                                                {journeyStep + 1}
                                            </div>
                                            <p className="text-4xl font-black text-indigo-900 text-center leading-relaxed">
                                                {language === 'ar' ? selectedSkill.steps[journeyStep].textAr : selectedSkill.steps[journeyStep].textEn}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex justify-center gap-6 p-10 pt-4 bg-gray-50/50">
                                    {(journeyStep > -1 || activeRules?.instructionStyle === 'object-first') && (
                                        <Button onClick={handlePrevStep} variant="outline" size="lg" className="bg-white text-xl px-8 rounded-full shadow-lg border-2 border-slate-200">
                                            {language === 'ar' ? 'السابق' : 'Prev'}
                                        </Button>
                                    )}

                                    <Button onClick={handlePlayInstructions} size="lg" className={`px-12 py-10 rounded-full text-2xl font-black shadow-xl border-4 border-white bg-gradient-to-r ${activeRules?.sensoryProfile === 'low-arousal' ? 'from-slate-400 to-slate-500' : selectedSkill.color} text-white`}>
                                        {isPlaying ? <Pause className="size-8 me-3" /> : <Play className="size-8 me-3" />}
                                        {isPlaying ? (language === 'ar' ? 'إيقاف' : 'Stop') : (language === 'ar' ? 'استمع' : 'Listen')}
                                    </Button>

                                    {(journeyStep > -1 || activeRules?.instructionStyle === 'object-first') && (
                                        <Button onClick={handleNextStep} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl px-10 py-10 rounded-full shadow-lg border-4 border-white">
                                            {language === 'ar' ? 'التالي' : 'Next'}
                                        </Button>
                                    )}

                                    {journeyStep === -1 && (
                                        <Button onClick={() => { playSound('success'); incrementProgress('life-skills'); speak(language === 'ar' ? 'أحسنتم! لقد تعلمت مهارة جديدة.' : 'Well done! You learned a new skill.', language); setTimeout(() => navigateTo('child-mode'), 1500); }} size="lg" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-white">
                                            <CheckCircle2 className="size-8 me-3" />
                                            {language === 'ar' ? 'تم الانتهاء' : 'Done'}
                                        </Button>
                                    )}

                                    <Button onClick={() => { playSound('tap'); setSelectedSkillId(null); setIsPlaying(false); stopSpeaking(); setJourneyStep(-1); }} variant="outline" size="lg" className="bg-white text-2xl px-10 py-10 rounded-full shadow-xl border-4 border-gray-100 text-gray-600">
                                        <RotateCcw className="size-8 me-3" />
                                        {language === 'ar' ? 'العودة' : 'Back'}
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
