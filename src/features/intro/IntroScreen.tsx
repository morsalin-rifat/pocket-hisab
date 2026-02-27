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
      // শেষ স্লাইডে চাপ দিলে লগ-ইন পেজে যাবে
      navigate('/login');
    }
  };
  
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between p-8 overflow-hidden bg-[#0d1425]">
      
      {/* ব্যাকগ্রাউন্ড হলোগ্রাফিক গ্লো (Aurora Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* স্লাইডার কন্টেন্ট */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* থ্রিডি আইকন এনিমেশন */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl mb-8 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            >
              {introData[currentSlide].icon}
            </motion.div>

            {/* টেক্সট কন্টেন্ট */}
            <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              {introData[currentSlide].title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed px-2">
              {introData[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* নিচের অংশ: প্রগ্রেস বার ও বাটন */}
      <div className="relative z-20 w-full flex flex-col items-center gap-8 pb-10">
        
        {/* কাস্টম প্রগ্রেস ডটস */}
        <div className="flex gap-3">
          {introData.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>

        {/* হাই-টেক বাটন */}
        <button 
          onClick={nextSlide}
          className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl font-bold text-white overflow-hidden transition-all active:scale-95"
        >
          <span className="relative z-10 tracking-widest uppercase">
            {currentSlide === introData.length - 1 ? "Initialize My System" : "Next Protocol"}
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* স্ক্যানিং লাইট ইফেক্ট */}
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </button>
      </div>

    </div>
  );
};

export default IntroScreen;