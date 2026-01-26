import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

export function LoginScreen() {
    const { loginUser, navigateTo } = useApp();
    const { speak, playSound } = useAudio();
    const { t, language, dir } = useLanguage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            speak(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields', language);
            playSound('error');
            return;
        }

        setIsLoading(true);
        playSound('tap');

        const userData = await loginUser(email, password);

        if (userData) {
            playSound('success');
            speak(language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!', language);
            setIsLoading(false);

            if (!userData.assessmentResult) {
                navigateTo('ai-assessment');
            } else {
                navigateTo('mode-selection');
            }
        } else {
            playSound('error');
            speak(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password', language);
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        playSound('tap');
        navigateTo('splash');
    };

    return (
        <div className="min-h-screen bg-transparent py-8 px-4">
            <BackButton onClick={handleBack} />
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-purple-700 drop-shadow-lg mb-4">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'} 🔐
                    </h1>
                    <p className="text-2xl text-purple-600 font-bold">
                        {language === 'ar' ? 'مرحباً بعودتك يا بطل! 👋' : 'Welcome back, hero! 👋'}
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-10 space-y-8 rounded-[3rem] shadow-2xl border-8 border-white bg-white/95 backdrop-blur-md relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 rounded-3xl bg-purple-100 text-purple-600">
                                <LogIn className="size-10" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800">{language === 'ar' ? 'بياناتك' : 'Your Details'}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {/* Email Input */}
                            <div className="space-y-4">
                                <label className="text-xl font-black text-gray-700">
                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => {
                                        speak(language === 'ar' ? 'البريد الإلكتروني' : 'Email', language);
                                        playSound('tap');
                                    }}
                                    className="h-16 text-xl rounded-2xl border-4 border-gray-100 focus:border-purple-300 transition-all font-bold"
                                    placeholder="example@email.com"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-4">
                                <label className="text-xl font-black text-gray-700">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => {
                                        speak(language === 'ar' ? 'كلمة المرور' : 'Password', language);
                                        playSound('tap');
                                    }}
                                    className="h-16 text-xl rounded-2xl border-4 border-gray-100 focus:border-purple-300 transition-all font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            disabled={isLoading || !email || !password}
                            size="lg"
                            className="w-full h-20 text-3xl font-black bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-2xl shadow-xl transition-all duration-200 active:scale-95 hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">⏳ {language === 'ar' ? 'جاري الدخول...' : 'Logging in...'}</span>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    {language === 'ar' ? 'دخول الآن' : 'Login Now'}
                                    {dir === 'rtl' ? <ArrowLeft className="size-8" /> : <ArrowRight className="size-8" />}
                                </div>
                            )}
                        </Button>
                    </Card>
                </motion.div>

                {/* Register Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <Card className="inline-block p-6 rounded-3xl bg-white shadow-lg border-4 border-gray-50">
                        <p className="text-2xl text-gray-600 font-bold">
                            {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => {
                                    playSound('tap');
                                    navigateTo('registration');
                                }}
                                className="text-purple-600 font-black hover:text-purple-700 transition-colors underline underline-offset-8"
                            >
                                {language === 'ar' ? 'سجل الآن' : 'Register now'}
                            </button>
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
