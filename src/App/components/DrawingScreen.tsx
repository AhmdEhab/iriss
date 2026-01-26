import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eraser, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BackButton } from './ui/BackButton';

export function DrawingScreen() {
    const { navigateTo, incrementProgress } = useApp();
    const { speak, playSound } = useAudio();
    const { t, language } = useLanguage();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#a855f7');
    const [brushSize, setBrushSize] = useState(8);
    const [isEraser, setIsEraser] = useState(false);

    const colors = [
        { name: 'Red', hex: '#ef4444' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Green', hex: '#22c55e' },
        { name: 'Yellow', hex: '#eab308' },
        { name: 'Orange', hex: '#f97316' },
        { name: 'Purple', hex: '#a855f7' },
        { name: 'Pink', hex: '#ec4899' },
        { name: 'Brown', hex: '#78350f' },
        { name: 'Black', hex: '#000000' }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        playSound('tap');
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.strokeStyle = isEraser ? 'white' : color;
        ctx.lineWidth = brushSize;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        playSound('error');
        speak(language === 'ar' ? 'تم مسح اللوحة' : 'Canvas cleared', language);
    };

    const handleBack = () => {
        playSound('tap');
        navigateTo('child-mode');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4 overflow-hidden">
            <BackButton onClick={handleBack} />
            <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-24" />
                    <h1 className="text-4xl md:text-5xl font-bold text-pink-600 drop-shadow-lg text-center flex-1">
                        {t.drawing} 🎨
                    </h1>
                    <div className="flex gap-4">
                        <Button onClick={clearCanvas} variant="destructive" size="lg" className="rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"><Trash2 className="size-6" /></Button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    <Card className="lg:col-span-2 p-4 flex lg:flex-col gap-4 overflow-auto lg:overflow-visible shadow-2xl rounded-[2.5rem]">
                        <div className="flex lg:flex-col gap-3 flex-1 overflow-auto p-1">
                            {colors.map((c) => (
                                <motion.button key={c.hex} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setColor(c.hex); setIsEraser(false); playSound('tap'); speak(language === 'ar' ? c.name : c.name, language); }} className={`size-12 rounded-full border-4 flex-shrink-0 ${color === c.hex && !isEraser ? 'border-gray-800 scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: c.hex }} />
                            ))}
                        </div>
                        <div className="lg:h-px lg:w-full w-px h-12 bg-gray-200" />
                        <div className="flex lg:flex-col gap-4">
                            <Button variant={isEraser ? 'default' : 'outline'} size="lg" onClick={() => { setIsEraser(!isEraser); playSound('tap'); speak(language === 'ar' ? 'ممحاة' : 'Eraser', language); }} className={`rounded-2xl size-16 p-0 ${isEraser ? 'bg-pink-500' : ''}`}><Eraser className="size-8" /></Button>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2">
                                    {[8, 16, 24].map((size) => (
                                        <button key={size} onClick={() => { setBrushSize(size); playSound('tap'); }} className={`rounded-full border-2 border-gray-200 transition-all ${brushSize === size ? 'bg-gray-800 scale-110' : 'bg-gray-100'}`} style={{ width: `${size + 20}px`, height: `${size + 20}px`, margin: '0 auto' }}>
                                            <div className="bg-white rounded-full mx-auto" style={{ width: `${size}px`, height: `${size}px` }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-10 relative bg-white shadow-2xl p-2 rounded-[2.5rem] overflow-hidden">
                        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-full cursor-crosshair touch-none rounded-[2rem]" />
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-30 select-none">
                            <p className="text-3xl font-bold text-gray-400">{language === 'ar' ? 'ارسم شيئاً جميلاً هنا! ✨' : 'Draw something beautiful here! ✨'}</p>
                        </div>
                    </Card>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button size="lg" className="px-10 py-5 rounded-2xl text-xl font-black bg-green-500 hover:bg-green-600 shadow-lg border-4 border-white transition-all transform hover:scale-105" onClick={() => { playSound('celebration'); incrementProgress('drawing'); speak(language === 'ar' ? 'عمل رائع يا فنان!' : 'Great job artist!', language); setTimeout(() => navigateTo('child-mode'), 1500); }}>
                        <CheckCircle2 className="size-6 me-2" />
                        {language === 'ar' ? 'انتهيت!' : 'Done!'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
