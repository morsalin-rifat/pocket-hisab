import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 75, amount = "12,500.00" }) => {
  return (
    <div className="relative w-full h-[220px] rounded-[48px] bg-gradient-to-b from-cyan-900/20 to-blue-900/40 backdrop-blur-3xl border border-white/10 overflow-hidden mb-12 shadow-2xl">
      
      {/* লিকুইড বডি - পুরো কন্টেইনার জুড়ে থাকবে */}
      <motion.div 
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400"
      >
        {/* ঢেউগুলো এখন আর কালো বর্ডার তৈরি করবে না */}
        <div className="absolute top-0 left-0 w-[400%] h-32 -translate-y-[90%] flex">
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-60 wave-layer fill-cyan-400">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-40 wave-layer fill-cyan-300" style={{ animationDuration: '7s', animationDirection: 'reverse', top: '-10px' }}>
            <path d="M0,70 C150,120 300,20 450,70 C600,120 750,20 900,70 C1050,120 1200,20 1350,70 L1350,120 L0,120 Z" />
          </svg>
        </div>

        {/* সারফেস গ্লো (পানির উপরের উজ্জ্বল আভা) */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-white/40 to-transparent blur-md" />
      </motion.div>

      {/* টাকা এবং টেক্সট - ডাইনামিক শ্যাডোসহ */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black tracking-[6px] text-white/50 uppercase mb-2">Portfolio Value</span>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{amount}</h2>
          <span className="text-xs font-bold text-white/40 ml-1">BDT</span>
        </div>
      </div>

      {/* ট্যাঙ্ক রিফ্লেকশন */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-30" />
    </div>
  );
};