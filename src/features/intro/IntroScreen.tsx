import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { introData } from './introData';

const IntroScreen = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef < any > (null);
  
  // অটো-রোটেশন লজিক (৩ সেকেন্ড পর পর)
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [index]);
  
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 4000); // ৩-৪ সেকেন্ডের মধ্যে রাখা ভালো যাতে ইউজার পড়তে পারে
  };
  
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const paginate = (newDirection: number) => {
    if (index + newDirection < 0) return;
    if (index + newDirection >= introData.length) {
      if (newDirection === 1) navigate('/login');
      return;
    }
    setDirection(newDirection);
    setIndex((prev) => prev + newDirection);
  };
  
  // ৩ডি রোটেশন ভেরিয়েন্ট (Globe Feel)
  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      x: direction > 0 ? 200 : -200
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      zIndex: 1
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      x: direction < 0 ? 200 : -200,
      zIndex: 0
    })
  };
  
  return (
    <div className="relative h-full w-full bg-[#020617] flex flex-col justify-between overflow-hidden perspective-1000">
      
      {/* কসমিক ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* ৩ডি ইন্টারঅ্যাক্টিভ কন্টেইনার */}
      <div className="relative flex-1 flex items-center justify-center pt-10">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              rotateY: { duration: 0.6 },
              opacity: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) > 50;
              if (swipe) {
                paginate(offset.x > 0 ? -1 : 1);
              }
            }}
            className="w-full flex flex-col items-center p-8 cursor-grab active:cursor-grabbing"
          >
            {/* ৩ডি এনিমেটেড কোর/আইকন */}
            <div className="relative mb-16">
              {/* লেয়ার্ড রিংস (Saturn Style) */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[2px] border-blue-400/20 rounded-full scale-[2.2] -rotate-12"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-emerald-400/20 rounded-full scale-[1.8] rotate-45"
              />
              
              {/* মেইন গ্লোয়িং কোর */}
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 50px rgba(59,130,246,0.6)", "0 0 20px rgba(59,130,246,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-36 h-36 bg-gradient-to-br from-blue-600/80 to-indigo-900 rounded-full flex items-center justify-center text-7xl border border-white/30 relative z-10 backdrop-blur-md"
              >
                <motion.span
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ duration: 3, repeat: Infinity }}
                >
                  {introData[index].icon}
                </motion.span>
              </motion.div>
            </div>

            <h1 className="text-3xl font-black text-white text-center mb-4 tracking-tight leading-tight uppercase">
              {introData[index].title}
            </h1>
            <p className="text-slate-400 text-lg text-center max-w-[320px] leading-relaxed">
              {introData[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* কন্ট্রোল প্যানেল */}
      <div className="relative z-20 p-8 pb-12 flex flex-col items-center gap-10">
        
        {/* গ্লোয়িং ডটস */}
        <div className="flex gap-3">
          {introData.map((_, i) => (
            <motion.div 
              key={i}
              animate={{
                scale: i === index ? 1.2 : 1,
                backgroundColor: i === index ? "#3b82f6" : "#1e293b"
              }}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-10 shadow-[0_0_15px_#3b82f6]' : 'w-2'}`}
            />
          ))}
        </div>

        <button 
          onClick={() => paginate(1)}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-2xl text-lg shadow-[0_15px_35px_rgba(37,99,235,0.3)] transition-all active:scale-[0.96] flex items-center justify-center gap-3"
        >
          <span>{index === introData.length - 1 ? "INITIALIZE ENGINE" : "SYNC & CONTINUE"}</span>
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* CSS For 3D Perspective */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
      `}</style>

    </div>
  );
};

export default IntroScreen;