import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Trash2, Globe, User, Shield, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function ParentSettingsScreen() {
    const { navigateTo, childProfile, setChildProfile, resetProgress, updateUser } = useApp();
    const { playSound, speak } = useAudio();
    const { t, language, setLanguage } = useLanguage();

    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const [formData, setFormData] = useState({
        name: childProfile?.name || '',
        age: childProfile?.age.toString() || '',
        motherName: childProfile?.motherName || '',
        fatherName: childProfile?.fatherName || '',
        email: childProfile?.email || '',
    });

    const handleBack = () => {
        playSound('tap');
        navigateTo('parent-dashboard');
    };

    const handleSave = async () => {
        if (!childProfile?.email) return;
        setIsSaving(true);
        playSound('tap');

        const success = await updateUser(childProfile.email, {
            name: formData.name,
            age: Number(formData.age),
            motherName: formData.motherName,
            fatherName: formData.fatherName,
        });

        if (success) {
            setIsSaving(false);
            playSound('success');
            speak(language === 'ar' ? 'تم حفظ التغييرات' : 'Settings saved successfully', language);
        } else {
            setIsSaving(false);
            playSound('error');
            speak(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings', language);
        }
    };

    const handleReset = () => {
        resetProgress();
        setShowConfirmReset(false);
        playSound('celebration');
        speak(language === 'ar' ? 'تم تصفير التقدم بنجاح' : 'Progress reset successfully', language);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                        className="bg-white shadow-lg"
                    >
                        <ArrowLeft className="size-5 me-2" />
                        {t.back}
                    </Button>

                    <h1 className="text-4xl font-bold text-slate-800">
                        {t.settings} ⚙️
                    </h1>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                        {isSaving ? '...' : <Save className="size-5 me-2" />}
                        {t.save}
                    </Button>
                </div>

                <div className="grid gap-8">
                    {/* Section: Language */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="size-6 text-blue-500" />
                            <h2 className="text-2xl font-bold">{language === 'ar' ? 'اللغة' : 'Language'}</h2>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => { setLanguage('ar'); playSound('tap'); }}
                                variant={language === 'ar' ? 'default' : 'outline'}
                                className="flex-1 h-16 text-xl rounded-2xl"
                            >
                                العربية 🇪🇬
                            </Button>
                            <Button
                                onClick={() => { setLanguage('en'); playSound('tap'); }}
                                variant={language === 'en' ? 'default' : 'outline'}
                                className="flex-1 h-16 text-xl rounded-2xl"
                            >
                                English 🇺🇸
                            </Button>
                        </div>
                    </Card>

                    {/* Section: Profile */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="size-6 text-purple-500" />
                            <h2 className="text-2xl font-bold">{t.childInfo}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>{t.childName}</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.age}</Label>
                                <Input
                                    type="number"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.motherName}</Label>
                                <Input
                                    value={formData.motherName}
                                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.fatherName}</Label>
                                <Input
                                    value={formData.fatherName}
                                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Section: Security & Danger Zone */}
                    <Card className="p-6 border-red-100 bg-red-50/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="size-6 text-red-500" />
                            <h2 className="text-2xl font-bold text-red-700">
                                {language === 'ar' ? 'إدارة البيانات' : 'Data Management'}
                            </h2>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
                            <div>
                                <h3 className="font-bold text-lg text-red-900">
                                    {language === 'ar' ? 'تصفير التقدم' : 'Reset Progress'}
                                </h3>
                                <p className="text-red-600 text-sm">
                                    {language === 'ar' ? 'سيتم مسح جميع الإنجازات والتقدم وبدء التعلم من جديد' : 'Clear all achievements and start learning from scratch'}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => setShowConfirmReset(true)}
                            >
                                <RotateCcw className="size-4 me-2" />
                                {language === 'ar' ? 'تصفير' : 'Reset'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showConfirmReset && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
                    >
                        <div className="size-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="size-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">
                            {language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {language === 'ar'
                                ? 'لا يمكن التراجع عن هذه الخطوة بعد تصفير التقدم.'
                                : 'This action cannot be undone. All progress will be lost.'}
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl"
                                onClick={() => setShowConfirmReset(false)}
                            >
                                {t.cancel}
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 h-12 rounded-xl"
                                onClick={handleReset}
                            >
                                {language === 'ar' ? 'نعم، تصفير' : 'Yes, Reset'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
