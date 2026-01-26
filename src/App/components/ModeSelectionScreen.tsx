import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Baby, Lock, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export function ModeSelectionScreen() {
  const { navigateTo, unlockParentMode, isReturningUser, assessmentResult } = useApp();
  const { speak, playSound } = useAudio();
  const { t, language } = useLanguage();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChildMode = () => {
    playSound('celebration');
    speak(t.childModeDesc, language);
    setTimeout(() => {
      // Skip assessment if user is returning (from login) OR already has assessment results
      if (isReturningUser || assessmentResult) {
        navigateTo('child-mode');
      } else {
        navigateTo('ai-assessment');
      }
    }, 2000);
  };

  const handleParentMode = () => {
    playSound('tap');
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = () => {
    if (unlockParentMode(password)) {
      playSound('success');
      setShowPasswordDialog(false);
      navigateTo('parent-dashboard');
    } else {
      playSound('error');
      setError(language === 'ar' ? 'كلمة المرور ��اطئة' : 'Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold text-center mb-12 text-purple-800"
        >
          {t.selectMode}
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Child Mode */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="relative"
          >
            <Button
              onClick={handleChildMode}
              className="w-full h-full min-h-[400px] bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 hover:from-yellow-400 hover:via-orange-400 hover:to-pink-500 shadow-2xl rounded-3xl border-0 relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {['⭐', '🌟', '✨', '🎈', '🎉'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="text-9xl"
                >
                  🧸
                </motion.div>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  {t.childMode}
                </h2>
                <p className="text-2xl text-white/90">
                  {t.childModeDesc}
                </p>
              </div>
            </Button>
          </motion.div>

          {/* Parent/Specialist Mode */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="relative"
          >
            <Button
              onClick={handleParentMode}
              className="w-full h-full min-h-[400px] bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-600 shadow-2xl rounded-3xl border-0 relative overflow-hidden"
            >
              {/* Content */}
              <div className="relative z-10 space-y-6">
                <div className="relative inline-block">
                  <Users className="size-24 text-white" />
                  <Lock className="size-12 text-yellow-300 absolute -bottom-2 -right-2" />
                </div>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  {t.parentMode}
                </h2>
                <p className="text-xl text-white/90">
                  {t.parentModeDesc}
                </p>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Hint for demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-600"
        >
          {language === 'ar'
            ? '💡 نصيحة: كلمة المرور هي 1234'
            : '💡 Hint: Password is 1234'
          }
        </motion.div>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.enterPassword}</DialogTitle>
            <DialogDescription>{t.enterPasswordDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="****"
              className="text-2xl text-center tracking-widest"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <Button
              onClick={handlePasswordSubmit}
              className="w-full"
              size="lg"
            >
              {t.continue}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}