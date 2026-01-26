import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Brain, User, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface ParentChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ParentChatModal({ isOpen, onClose }: ParentChatModalProps) {
    const { parentChatHistory, sendParentMessage, childProfile } = useApp();
    const { language } = useLanguage();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [parentChatHistory]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const message = input;
        setInput('');
        setIsTyping(true);
        await sendParentMessage(message);
        setIsTyping(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Brain className="size-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">IRIS Parent Assistant</h2>
                                <p className="text-xs opacity-70">
                                    {language === 'ar' ? 'مساعدك الذكي لمعرفة تقدم طفلك' : 'Your AI assistant for child progress insights'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="size-6" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                        {parentChatHistory.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                <Sparkles className="size-16 text-purple-600" />
                                <p className="text-lg font-medium max-w-xs">
                                    {language === 'ar'
                                        ? `أهلاً بك! يمكنك سؤالي عن نقاط قوة ${childProfile?.name} أو مهاراته أو التحديات التي يواجهها.`
                                        : `Welcome! You can ask me about ${childProfile?.name}'s strengths, skills, or challenges.`}
                                </p>
                            </div>
                        )}

                        {parentChatHistory.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                                        } text-white`}>
                                        {msg.role === 'user' ? <User className="size-4" /> : <Brain className="size-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className="text-[10px] opacity-40 mt-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="size-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="size-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="size-1.5 bg-slate-400 rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={language === 'ar' ? 'اسأل IRIS عن طفلك...' : 'Ask IRIS about your child...'}
                                className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="rounded-2xl w-14 h-14 bg-purple-600 hover:bg-purple-700 p-0"
                            >
                                <Send className="size-6 text-white" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
