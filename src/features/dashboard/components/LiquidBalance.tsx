import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 75, amount = "12,500.00" }) => {
  return (
    <div className="relative w-full h-[220px] rounded-[48px] bg-blue-900 overflow-hidden mb-12 border border-white/10 shadow-2xl">
      
      {/* পানির বডি - পুরো ব্যাকগ্রাউন্ড কভার করবে */}
      <motion.div 
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-cyan-400"
      >
        {/* ঢেউগুলো এমনভাবে দেওয়া হয়েছে যাতে ব্যাকগ্রাউন্ডের সাথে মিশে যায় */}
        <div className="absolute top-0 left-0 w-[400%] h-32 -translate-y-[85%] flex">
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-60 wave-layer fill-cyan-400">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-40 wave-layer fill-cyan-300" style={{ animationDuration: '6s', animationDirection: 'reverse', top: '-10px' }}>
            <path d="M0,70 C150,120 300,20 450,70 C600,120 750,20 900,70 C1050,120 1200,20 1350,70 L1350,120 L0,120 Z" />
          </svg>
        </div>
      </motion.div>

      {/* টাকা এবং টেক্সট */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black tracking-[6px] text-white/50 uppercase mb-2">Portfolio Value</span>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-lg">{amount}</h2>
          <span className="text-xs font-bold text-white/40 ml-1">BDT</span>
        </div>
      </div>

      {/* গ্লাস রিফ্লেকশন */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-30" />
    </div>
  );
};