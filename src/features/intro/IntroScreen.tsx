import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { introData } from './introData';

const IntroScreen = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  
  const nextSlide = useCallback(() => {
    setDirection(1);
    if (current < introData.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      navigate('/login');
    }
  }, [current, navigate]);
  
  // অটো-রোটেশন ৫ সেকেন্ড পর পর
  useEffect(() => {
    const timer = setInterval(() => {
      if (current < introData.length - 1) nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [current, nextSlide]);
  
  return (
    <div className="relative h-full w-full bg-[#02040a] flex flex-col justify-between overflow-hidden perspective-[1500px]">
      
      {/* Dynamic Starfield */}
      <div className="absolute inset-0 z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: Math.random() * 5 + 2, repeat: Infinity }}
            className="absolute bg-blue-400 rounded-full"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* 3D Rotating Cube/Globe Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            initial={{ rotateY: direction > 0 ? 90 : -90, opacity: 0, scale: 0.8 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: direction > 0 ? -90 : 90, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="w-full h-full flex flex-col items-center justify-center p-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Meaningful Micro-Animations Based on Type */}
            <div className="relative w-48 h-48 mb-12">
              {/* Outer Energy Rings */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full scale-125"
              />
              
              {/* Central Animation Body */}
              <div className="w-full h-full flex items-center justify-center">
                {introData[current].type === 'core' && (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-blue-500 rounded-full blur-[20px] shadow-[0_0_60px_#3b82f6]" />
                )}
                {introData[current].type === 'ai' && (
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} animate={{ height: [20, 60, 20] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-2 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
                    ))}
                  </div>
                )}
                {introData[current].type === 'event' && (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-32 h-32 border-4 border-indigo-500 border-t-transparent rounded-full relative">
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 shadow-[0_0_15px_white]" />
                  </motion.div>
                )}
                {introData[current].type === 'secure' && (
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-32 h-40 border-4 border-blue-400 rounded-t-full relative flex items-center justify-center">
                     <div className="w-10 h-10 bg-blue-400 rounded-full" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Content Text */}
            <h1 className="text-3xl font-black text-white text-center mb-4 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              {introData[current].title}
            </h1>
            <p className="text-blue-100/50 text-center text-lg leading-relaxed max-w-[320px]">
              {introData[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controller Section */}
      <div className="relative z-20 p-8 pb-12 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-between items-center mb-8">
            <div className="flex gap-1">
              {introData.map((_, i) => (
                <div key={i} className={`h-1 transition-all duration-500 ${i === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
            <span className="text-blue-500 font-mono text-xs tracking-widest">SYSTEM V1.0</span>
        </div>

        <button 
          onClick={nextSlide}
          className="w-full py-5 bg-white text-black font-black rounded-xl tracking-[0.2em] uppercase active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 group"
        >
          {current === introData.length - 1 ? "Initialize Identity" : "Continue"}
          <span className="group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>

    </div>
  );
};

export default IntroScreen;