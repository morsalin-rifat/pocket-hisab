import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 75, amount = "12,500.00" }) => {
  return (
    <div className="relative w-full h-[220px] rounded-[48px] bg-black overflow-hidden mb-12 border border-white/10 shadow-2xl">
      
      {/* মেইন লিকুইড কন্টেইনার */}
      <motion.div 
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-0 left-0 w-full bg-cyan-500"
      >
        {/* ঢেউগুলো এখন বডির একদম মাথায় 'Stitch' করা */}
        <div className="absolute top-0 left-0 w-[400%] h-24 -translate-y-[99%] flex pointer-events-none">
          {/* প্রথম ঢেউ - সলিড কালার */}
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full wave-layer fill-cyan-500">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
          {/* দ্বিতীয় ঢেউ - সামান্য ড্রার্ক যাতে ঢেউয়ের গভীরতা বোঝা যায় কিন্তু কালো না হয় */}
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full wave-layer fill-cyan-600 opacity-90" style={{ animationDuration: '7s', animationDirection: 'reverse', top: '1px' }}>
            <path d="M0,70 C150,120 300,20 450,70 C600,120 750,20 900,70 C1050,120 1200,20 1350,70 L1350,120 L0,120 Z" />
          </svg>
        </div>
      </motion.div>

      {/* টাকা এবং টেক্সট - পানির রঙের সাথে কন্ট্রাস্ট বজায় রাখতে ড্রপ শ্যাডো */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black tracking-[6px] text-white/50 uppercase mb-2">Portfolio Value</span>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">{amount}</h2>
          <span className="text-xs font-bold text-white/40 ml-1">BDT</span>
        </div>
      </div>

      {/* গ্লাস শাইন */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-30 opacity-50" />
    </div>
  );
};