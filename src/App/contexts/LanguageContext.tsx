import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface Translations {
  // Splash Screen
  welcome: string;
  welcomeMessage: string;
  start: string;

  // Registration
  registration: string;
  childInfo: string;
  childName: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  male: string;
  female: string;
  familyInfo: string;
  country: string;
  city: string;
  motherName: string;
  motherJob: string;
  fatherName: string;
  fatherJob: string;
  phone: string;
  conditionSelection: string;
  downSyndrome: string;
  autism: string;
  williams: string;
  fragileX: string;
  other: string;
  next: string;
  previous: string;
  submit: string;

  // Mode Selection
  selectMode: string;
  childMode: string;
  parentMode: string;
  childModeDesc: string;
  parentModeDesc: string;
  enterPassword: string;
  enterPasswordDesc: string;

  // AI Assessment
  assessment: string;
  assessmentIntro: string;
  startTest: string;
  taskComplete: string;
  assessmentComplete: string;
  levelDetermined: string;

  // Child Mode
  learningWorld: string;
  letters: string;
  numbers: string;
  animals: string;
  colors: string;
  lifeSkills: string;
  stories: string;
  songs: string;
  drawing: string;
  shapes: string;
  fruits: string;
  vehicles: string;
  rewards: string;
  games: string;
  memoryGame: string;
  balloonPop: string;
  shadowMatch: string;
  gamesHub: string;
  bodyParts: string;
  emotions: string;
  iqPoints: string;
  streak: string;
  basics: string;
  world: string;
  creative: string;

  // Parent Dashboard
  dashboard: string;
  progress: string;
  timeSpent: string;
  skillsProgress: string;
  emotionalTrends: string;
  aiSummary: string;

  // Family Guidance
  familyGuidance: string;
  health: string;
  education: string;
  psychology: string;
  behavior: string;

  // Common
  back: string;
  close: string;
  save: string;
  cancel: string;
  continue: string;
  loading: string;
  settings: string;

  // Transition Screens
  selectingIQ: string;
  configuringJourney: string;
  pleaseWait: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    welcome: 'مرحباً',
    welcomeMessage: 'هاااي 👋 أهلاً بيك في آيرِس',
    start: 'ابدأ',

    registration: 'التسجيل',
    childInfo: 'معلومات الطفل',
    childName: 'اسم الطفل',
    age: 'العمر',
    dateOfBirth: 'تاريخ الميلاد',
    gender: 'النوع',
    male: 'ذكر',
    female: 'أنثى',
    familyInfo: 'معلومات العائلة',
    country: 'الدولة',
    city: 'المدينة',
    motherName: 'اسم الأم',
    motherJob: 'وظيفة الأم',
    fatherName: 'اسم الأب',
    fatherJob: 'وظيفة الأب',
    phone: 'رقم الهاتف',
    conditionSelection: 'اختر الحالة',
    downSyndrome: 'متلازمة داون',
    autism: 'التوحد',
    williams: 'متلازمة ويليامز',
    fragileX: 'متلازمة إكس الهش',
    other: 'أخرى',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',

    selectMode: 'اختر الوضع',
    childMode: 'وضع الطفل',
    parentMode: 'وضع الأهل',
    childModeDesc: 'جاهزين نلعب ونتعلم؟ 🎉',
    parentModeDesc: 'متابعة تقدم الطفل والإحصائيات',
    enterPassword: 'أدخل كلمة المرور',
    enterPasswordDesc: 'كلمة المرور لدخول وضع الأهل',

    assessment: 'التقييم',
    assessmentIntro: 'هنبدأ بعض الأنشطة الممتعة لنتعرف عليك أكثر!',
    startTest: 'ابدأ التقييم',
    taskComplete: 'رائع! 🌟',
    assessmentComplete: 'انتهى التقييم',
    levelDetermined: 'تم تحديد مستوى التعلم المناسب 🎉',

    learningWorld: 'عالم التعلم',
    letters: 'الحروف',
    numbers: 'الأرقام',
    animals: 'الحيوانات',
    colors: 'الألوان',
    lifeSkills: 'مهارات الحياة',
    stories: 'القصص',
    songs: 'الأغاني',
    drawing: 'مرسمي الصغير',
    shapes: 'الأشكال',
    fruits: 'الفواكه والخضروات',
    vehicles: 'وسائل المواصلات',
    rewards: 'بطولاتي',
    games: 'الألعاب',
    memoryGame: 'لعبة الذاكرة',
    balloonPop: 'فرقعة البالونات',
    shadowMatch: 'تطابق الظلال',
    gamesHub: 'صالة الألعاب',
    bodyParts: 'جسمي الجميل',
    emotions: 'مشاعري',
    iqPoints: 'نقطة ذكاء',
    streak: 'أيام متتالية',
    basics: 'الأساسيات',
    world: 'البيئة والعالم',
    creative: 'الإبداع والمرح',

    dashboard: 'لوحة التحكم',
    progress: 'التقدم',
    timeSpent: 'الوقت المستغرق',
    skillsProgress: 'تقدم المهارات',
    emotionalTrends: 'الحالة العاطفية',
    aiSummary: 'ملخص الذكاء الاصطناعي',

    familyGuidance: 'إرشادات العائلة',
    health: 'الصحة',
    education: 'التعليم',
    psychology: 'علم النفس',
    behavior: 'السلوك اليومي',

    back: 'رجوع',
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    continue: 'متابعة',
    loading: 'جاري التحميل...',
    settings: 'الإعدادات',

    // Transition Screens
    selectingIQ: 'جارٍ اختيار اختبار الذكاء المناسب...',
    configuringJourney: 'جارٍ تهيئة طريقة الشرح المناسبة...',
    pleaseWait: 'لحظة من فضلك...'
  },
  en: {
    welcome: 'Welcome',
    welcomeMessage: 'Hii 👋 Welcome to IRIS',
    start: 'Start',

    registration: 'Registration',
    childInfo: 'Child Information',
    childName: 'Child Name',
    age: 'Age',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    familyInfo: 'Family Information',
    country: 'Country',
    city: 'City',
    motherName: "Mother's Name",
    motherJob: "Mother's Job",
    fatherName: "Father's Name",
    fatherJob: "Father's Job",
    phone: 'Phone Number',
    conditionSelection: 'Select Condition',
    downSyndrome: 'Down Syndrome',
    autism: 'Autism Spectrum',
    williams: 'Williams Syndrome',
    fragileX: 'Fragile X',
    other: 'Other',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',

    selectMode: 'Select Mode',
    childMode: 'Child Mode',
    parentMode: 'Parent Mode',
    childModeDesc: 'Ready to play and learn? 🎉',
    parentModeDesc: 'Track progress and statistics',
    enterPassword: 'Enter Password',
    enterPasswordDesc: 'Password to enter Parent Mode',

    assessment: 'Assessment',
    assessmentIntro: "Let's do some fun activities to get to know you better!",
    startTest: 'Start Assessment',
    taskComplete: 'Awesome! 🌟',
    assessmentComplete: 'Assessment Complete',
    levelDetermined: 'Learning level determined 🎉',

    learningWorld: 'Learning World',
    letters: 'Letters',
    numbers: 'Numbers',
    animals: 'Animals',
    colors: 'Colors',
    lifeSkills: 'Life Skills',
    stories: 'Stories',
    songs: 'Songs',
    drawing: 'Little Studio',
    shapes: 'Shapes',
    fruits: 'Fruits & Veggies',
    vehicles: 'Vehicles',
    rewards: 'My Trophies',
    games: 'Games',
    memoryGame: 'Memory Game',
    balloonPop: 'Balloon Pop',
    shadowMatch: 'Shadow Match',
    gamesHub: 'Games Hub',
    bodyParts: 'My Wonderful Body',
    emotions: 'My Feelings',
    iqPoints: 'IQ Points',
    streak: 'Day Streak',
    basics: 'Basics',
    world: 'World & Life',
    creative: 'Creative & Fun',

    dashboard: 'Dashboard',
    progress: 'Progress',
    timeSpent: 'Time Spent',
    skillsProgress: 'Skills Progress',
    emotionalTrends: 'Emotional Trends',
    aiSummary: 'AI Summary',

    familyGuidance: 'Family Guidance',
    health: 'Health',
    education: 'Education',
    psychology: 'Psychology',
    behavior: 'Daily Behavior',

    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    continue: 'Continue',
    loading: 'Loading...',
    settings: 'Settings',

    // Transition Screens
    selectingIQ: 'Selecting appropriate IQ test...',
    configuringJourney: 'Configuring personalized learning path...',
    pleaseWait: 'Please wait...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        dir: language === 'ar' ? 'rtl' : 'ltr'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}