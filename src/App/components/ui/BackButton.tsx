import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
    const { t } = useLanguage();

    return (
        <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                fixed top-6 left-6 z-[100] 
                flex items-center gap-2 px-5 py-3
                rounded-2xl bg-white/20 backdrop-blur-md 
                border border-white/30 shadow-xl 
                text-slate-800 font-bold hover:bg-white/40 
                transition-all group ${className}
            `}
        >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline">{t.back}</span>
        </motion.button>
    );
}
