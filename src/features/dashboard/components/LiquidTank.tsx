import React from 'react';
import { motion } from 'framer-motion';

export const LiquidTank = ({ percentage, amount }: { percentage: number, amount: string }) => {
  return (
    <div className="relative w-full h-[220px] frosted-tank rounded-[45px] overflow-hidden mb-12 shine-effect group">
      {/* লিকুইড কন্টেইনার */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: `${100 - percentage}%` }}
        transition={{ duration: 2.5, type: 'spring', damping: 20 }}
        className="absolute inset-0 w-full"
      >
        {/* অর্গানিক ওয়াটার লেয়ার ১ */}
        <div className="absolute -top-20 -left-1/2 w-[200%] h-[400px] bg-gradient-to-b from-cyan-400 via-blue-600 to-blue-900 opacity-40 blur-3xl animate-liquid" />
        {/* অর্গানিক ওয়াটার লেয়ার ২ */}
        <div className="absolute -top-24 -right-1/2 w-[200%] h-[400px] bg-gradient-to-b from-blue-300 via-cyan-500 to-indigo-800 opacity-30 blur-2xl animate-liquid" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
        
        {/* উপরের সারফেস লাইন (Glow) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-300 shadow-[0_0_20px_#22d3ee] z-10" />
      </motion.div>

      {/* টাকা এবং ইনফো */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <span className="text-[10px] font-bold tracking-[6px] text-white/30 uppercase mb-2">Available Capital</span>
        <div className="flex items-baseline gap-1">
          <h2 className="text-6xl font-light tracking-tighter text-white">{amount}</h2>
          <span className="text-sm font-bold text-cyan-500/80">BDT</span>
        </div>
      </div>

      {/* ট্যাঙ্কের ওপরের গ্লাস রিফ্লেকশন */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
};