import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 75, amount = "12,450.00" }) => {
  return (
    <div className="relative w-full h-[220px] rounded-[48px] glass-container overflow-hidden mb-12 shadow-2xl">
      {/* পানির স্তর (The Liquid Body) */}
      <motion.div 
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-cyan-400"
      >
        {/* ৩টি অর্গানিক ওয়েভ লেয়ার */}
        <div className="absolute top-0 left-0 w-[400%] h-24 -translate-y-[85%] flex">
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-30 wave-layer fill-white/20">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
          <svg viewBox="0 0 1200 120" className="w-1/2 h-full opacity-40 wave-layer fill-white/30" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
            <path d="M0,70 C150,120 300,20 450,70 C600,120 750,20 900,70 C1050,120 1200,20 1350,70 L1350,120 L0,120 Z" />
          </svg>
        </div>

        {/* উপরে হালকা সাদা বুদবুদ বা শাইন */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/40 blur-sm" />
      </motion.div>

      {/* টাকা এবং ইনফো (ফিক্সড) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold tracking-[6px] text-white/40 uppercase mb-2">Available Assets</span>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white">{amount}</h2>
          <span className="text-xs font-medium text-cyan-200 opacity-60">BDT</span>
        </div>
      </div>

      {/* কাঁচের বাইরের রিফ্লেকশন */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-30" />
    </div>
  );
};