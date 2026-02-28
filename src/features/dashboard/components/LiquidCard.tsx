import React from 'react';
import { motion } from 'framer-motion';

export const LiquidCard = ({ balance, percent }: { balance: number, percent: number }) => {
  return (
    <div className="relative w-full h-64 bg-white/5 backdrop-blur-2xl rounded-[45px] border border-white/10 overflow-hidden shadow-2xl">
      {/* লিকুইড ওয়েভ লেয়ার */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: `${100 - percent}%` }}
        transition={{ duration: 2, ease: "circOut" }}
        className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/50 to-cyan-400/30"
      >
        <svg className="absolute -top-10 w-[200%] h-20 animate-wave opacity-50" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="white" opacity="0.3" />
        </svg>
      </motion.div>

      {/* টেক্সট কন্টেন্ট */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white/60 mb-2">Available Budget</p>
        <h2 className="text-5xl font-black tracking-tighter italic">
          {balance.toLocaleString()} <span className="text-xl font-bold opacity-50">৳</span>
        </h2>
        <div className="mt-4 px-4 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
           <p className="text-[10px] font-bold tracking-widest">{percent}% REMAINING</p>
        </div>
      </div>

      {/* গ্লাস শাইন */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};