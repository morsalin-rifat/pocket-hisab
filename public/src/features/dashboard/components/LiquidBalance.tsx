import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 70, amount = "0.00" }) => {
  return (
    <div className="relative w-full h-64 bg-gray-900/50 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl premium-glass">
      
      {/* লিকুইড লেয়ারস (Percentage অনুযায়ী হাইট কন্ট্রোল হবে) */}
      <motion.div 
        initial={{ top: '100%' }}
        animate={{ top: `${100 - percentage}%` }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="water-wave" />
        <div className="water-wave" />
      </motion.div>

      {/* টেক্সট ওভারলে */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-2">Total Balance</p>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-md">{amount}</h2>
          <span className="text-sm font-bold text-blue-300 drop-shadow-md">BDT</span>
        </div>
        
        {/* লিকুইড স্ট্যাটাস ইন্ডিকেটর */}
        <div className="mt-8 px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/5">
          <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
            {percentage}% OF BUDGET REMAINING
          </p>
        </div>
      </div>

      {/* সাই-ফাই গ্রিড লাইনস */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
};