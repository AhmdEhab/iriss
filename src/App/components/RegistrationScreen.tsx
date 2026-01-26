import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Baby, Users, Brain, Check, Sparkles } from 'lucide-react';
import { useApp, ChildProfile, Condition } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

export function RegistrationScreen() {
  const { registerUser, navigateTo } = useApp();
  const { speak, playSound } = useAudio();
  const { t, language, dir } = useLanguage();

  const handleBack = () => {
    playSound('tap');
    navigateTo('splash');
  };

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    country: '',
    city: '',
    motherName: '',
    motherJob: '',
    fatherName: '',
    fatherJob: '',
    phone: '',
    condition: '' as Condition | ''
  });

  const conditions: { id: Condition; name: string; icon: string }[] = [
    { id: 'down-syndrome', name: t.downSyndrome, icon: '🧬' },
    { id: 'autism', name: t.autism, icon: '🧩' },
    { id: 'williams', name: t.williams, icon: '💙' },
    { id: 'fragile-x', name: t.fragileX, icon: '🔬' },
    { id: 'other', name: t.other, icon: '✨' }
  ];

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      speak(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email', language);
      return false;
    }
    if (password.length < 6) {
      speak(language === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters', language);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    playSound('tap');
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      setIsSubmitting(true);
      const profile: ChildProfile & { password?: string } = {
        ...formData,
        email,
        password,
        age: Number(formData.age),
        gender: formData.gender as 'male' | 'female',
        condition: formData.condition as Condition
      };

      const success = await registerUser(profile);

      if (success) {
        playSound('success');
        speak(language === 'ar' ? 'تم التسجيل بنجاح! أهلاً بك يا بطل.' : 'Registration successful! Welcome, hero.', language);
        navigateTo('ai-assessment');
      } else {
        speak(language === 'ar' ? 'حدث خطأ في التسجيل. يرجى التأكد من البيانات.' : 'Registration error. Please check your data.', language);
        playSound('error');
      }
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    playSound('tap');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <BackButton onClick={handleBack} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black text-purple-700 drop-shadow-lg mb-4">
            {t.registration} 📝
          </h1>
          <p className="text-2xl text-purple-600 font-bold">
            {language === 'ar' ? 'رحلة جديدة تبدأ هنا! 🌟' : 'A new journey starts here! 🌟'}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-black text-purple-700 uppercase tracking-wide">
              {step === 1 ? t.childInfo : step === 2 ? t.familyInfo : t.conditionSelection}
            </span>
            <span className="text-xl font-black text-purple-600 bg-white px-4 py-1 rounded-full shadow-sm">{step} / 3</span>
          </div>
          <div className="w-full bg-purple-100/50 rounded-full h-6 shadow-inner border-4 border-white overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Child Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-10 space-y-8 rounded-[3.5rem] shadow-2xl border-8 border-white bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 rounded-3xl bg-purple-100 text-purple-600 shadow-inner">
                    <Baby className="size-10" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-800">{t.childInfo}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 focus:border-purple-300 font-bold"
                      placeholder="hero@kingdom.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 focus:border-purple-300 font-bold"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.childName}</label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 focus:border-purple-300 font-bold"
                      placeholder={language === 'ar' ? 'اسم طفلنا البطل' : "Our Hero's Name"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-lg font-black text-gray-700">{t.age}</label>
                      <Input
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => updateField('age', e.target.value)}
                        className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-lg font-black text-gray-700">{language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.gender}</label>
                    <div className="grid grid-cols-2 gap-6 mt-2">
                      <Button
                        variant={formData.gender === 'male' ? 'default' : 'outline'}
                        onClick={() => { updateField('gender', 'male'); playSound('tap'); }}
                        className={`h-20 text-2xl font-black rounded-2xl border-4 transition-all duration-200 ${formData.gender === 'male' ? 'bg-blue-500 border-blue-600 scale-105 shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 active:scale-95'}`}
                      >
                        👦 {t.male}
                      </Button>
                      <Button
                        variant={formData.gender === 'female' ? 'default' : 'outline'}
                        onClick={() => { updateField('gender', 'female'); playSound('tap'); }}
                        className={`h-20 text-2xl font-black rounded-2xl border-4 transition-all duration-200 ${formData.gender === 'female' ? 'bg-pink-500 border-pink-600 scale-105 shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 active:scale-95'}`}
                      >
                        👧 {t.female}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Family Information */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-10 space-y-10 rounded-[3.5rem] shadow-2xl border-8 border-white bg-white/95">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 rounded-3xl bg-blue-100 text-blue-600 shadow-inner">
                    <Users className="size-10" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-800">{t.familyInfo}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.country}</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.city}</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.motherName}</label>
                    <Input
                      value={formData.motherName}
                      onChange={(e) => updateField('motherName', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.motherJob}</label>
                    <Input
                      value={formData.motherJob}
                      onChange={(e) => updateField('motherJob', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.fatherName}</label>
                    <Input
                      value={formData.fatherName}
                      onChange={(e) => updateField('fatherName', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.fatherJob}</label>
                    <Input
                      value={formData.fatherJob}
                      onChange={(e) => updateField('fatherJob', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-lg font-black text-gray-700">{t.phone}</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="h-16 text-xl rounded-2xl border-4 border-gray-100 font-bold text-center tracking-widest"
                      placeholder="+20 123 456 7890"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Condition Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-10 space-y-10 rounded-[3.5rem] shadow-2xl border-8 border-white bg-white/95">
                <div className="flex items-center gap-4 mb-2 text-center justify-center">
                  <div className="p-4 rounded-3xl bg-yellow-100 text-yellow-600 shadow-inner">
                    <Brain className="size-10" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-800">{t.conditionSelection}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {conditions.map((condition) => (
                    <motion.button
                      key={condition.id}
                      onClick={() => {
                        updateField('condition', condition.id);
                        playSound('tap');
                        speak(condition.name, language);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-10 rounded-[2.5rem] border-8 transition-all duration-200 relative flex flex-col items-center shadow-xl ${formData.condition === condition.id
                        ? 'border-purple-500 bg-purple-50 scale-105'
                        : 'border-white bg-white hover:border-purple-200 active:scale-95'
                        }`}
                    >
                      {formData.condition === condition.id && (
                        <div className="absolute top-4 right-4 bg-purple-500 text-white p-2 rounded-full shadow-lg">
                          <Check className="size-6" />
                        </div>
                      )}
                      <div className="text-8xl mb-6 filter drop-shadow-lg">{condition.icon}</div>
                      <div className="font-black text-2xl text-gray-800">{condition.name}</div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 gap-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
            className={`h-20 text-2xl font-black rounded-2xl border-4 shadow-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white hover:bg-gray-50'}`}
          >
            {dir === 'rtl' ? <ChevronRight className="size-8 me-2" /> : <ChevronLeft className="size-8 me-2" />}
            {t.previous}
          </Button>

          <Button
            onClick={handleNext}
            size="lg"
            className={`flex-1 h-20 text-3xl font-black rounded-2xl shadow-2xl transition-all duration-200 active:scale-95 hover:scale-[1.02] ${step === 3 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
            disabled={
              isSubmitting ||
              (step === 1 && (!formData.name || !formData.age || !formData.gender || !email || !password)) ||
              (step === 2 && (!formData.country || !formData.phone)) ||
              (step === 3 && !formData.condition)
            }
          >
            <div className="flex items-center justify-center gap-3">
              {isSubmitting ? (
                <><Sparkles className="animate-spin size-8" />{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</>
              ) : (
                <>
                  {step === 3 ? t.submit : t.next}
                  {dir === 'rtl' ? <ChevronLeft className="size-8 ms-2" /> : <ChevronRight className="size-8 ms-2" />}
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
