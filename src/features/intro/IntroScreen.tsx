import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { introData } from './introData';

const IntroScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const nextSlide = () => {
    if (currentSlide < introData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="relative h-full w-full bg-[#050505] flex flex-col justify-between overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড ডায়নামিক লাইট */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"
        />
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full flex flex-col items-center"
          >
            {/* আইকন কন্টেইনার */}
            <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full scale-150"
              />
              <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center text-6xl shadow-2xl">
                {introData[currentSlide].icon}
              </div>
            </div>

            {/* টেক্সট */}
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight text-center">
              {introData[currentSlide].title}
            </h1>
            <p className="text-gray-400 text-lg text-center leading-relaxed max-w-[280px]">
              {introData[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ফুটার কন্ট্রোল */}
      <div className="relative z-20 p-8 pb-12 flex flex-col items-center gap-10">
        
        {/* ইন্ডিকেটর */}
        <div className="flex gap-2">
          {introData.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-blue-500' : 'w-2 bg-white/10'}`}
            />
          ))}
        </div>

        {/* বাটন */}
        <button 
          onClick={nextSlide}
          className="w-full py-5 bg-white text-black font-bold rounded-2xl text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all overflow-hidden relative group"
        >
          <span className="relative z-10">
            {currentSlide === introData.length - 1 ? "Start My Journey" : "Next"}
          </span>
          <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

    </div>
  );
};

export default IntroScreen;