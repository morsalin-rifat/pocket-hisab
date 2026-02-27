import React, { useState, useEffect } from 'react';
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
    <div className="relative h-full w-full bg-[#020617] flex flex-col justify-between overflow-hidden">
      
      {/* স্টারফিল্ড ব্যাকগ্রাউন্ড (Stars Animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random(), scale: Math.random() }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* মেইন ইন্টারঅ্যাক্টিভ জোন */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="w-full flex flex-col items-center"
          >
            {/* ঘূর্ণায়মান পৃথিবী/গোলক (The Global Orb) */}
            <div className="relative mb-16">
              {/* আউটার গ্লো */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full scale-150"
              />
              
              {/* মেইন ৩ডি অরবিটাল রিং */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-blue-400/20 rounded-full scale-[1.8] rotate-45"
              />

              {/* দ্য অরবিটাল বডি */}
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 rounded-full flex items-center justify-center text-7xl shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/20 relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span className="drop-shadow-lg">{introData[currentSlide].icon}</span>
              </motion.div>
            </div>

            {/* টেক্সট ব্রিফ */}
            <h1 className="text-3xl font-black text-white mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              {introData[currentSlide].title}
            </h1>
            <p className="text-blue-100/60 text-lg text-center leading-relaxed max-w-[300px] font-medium">
              {introData[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* কন্ট্রোলস (নিওন স্টাইল) */}
      <div className="relative z-20 p-8 pb-12 flex flex-col items-center gap-10 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent">
        
        {/* স্মার্ট ইন্ডিকেটর */}
        <div className="flex gap-3">
          {introData.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-700 ${index === currentSlide ? 'w-12 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]' : 'w-2 bg-white/10'}`}
            />
          ))}
        </div>

        {/* বাটন (Glass-Fibre Effect) */}
        <button 
          onClick={nextSlide}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-lg shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.95] transition-all flex items-center justify-center gap-3 group"
        >
          <span>{currentSlide === introData.length - 1 ? "INITIALIZE SYSTEM" : "CONTINUE"}</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </button>
      </div>

    </div>
  );
};

export default IntroScreen;