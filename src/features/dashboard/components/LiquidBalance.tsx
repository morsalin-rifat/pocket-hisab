import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBalance = ({ percentage = 80, amount = "0", label = "Budget" }: any) => {
  const isExhausted = percentage <= 0;
  
  return (
    <div className="relative w-full h-[220px] rounded-[50px] bg-black overflow-hidden mb-10 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,1)]">
      <motion.div 
        initial={{ height: '100%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2.5, ease: "circOut" }}
        className={`absolute bottom-0 left-0 w-full ${isExhausted ? 'bg-red-600/20' : 'bg-cyan-500'}`}
      >
        {!isExhausted && (
          <div className="absolute top-0 left-0 w-[400%] h-24 -translate-y-[98%] flex pointer-events-none opacity-80">
            <svg viewBox="0 0 1200 120" className="w-1/2 h-full fill-cyan-500 wave-layer"><path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" /></svg>
            <svg viewBox="0 0 1200 120" className="w-1/2 h-full fill-cyan-400 opacity-40 wave-layer" style={{ animationDirection: 'reverse', animationDuration: '6s' }}><path d="M0,70 C150,120 300,20 450,70 C600,120 750,20 900,70 C1050,120 1200,20 1350,70 L1350,120 L0,120 Z" /></svg>
          </div>
        )}
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black tracking-[6px] text-white/60 uppercase mb-3">{label}</span>
        <div className="flex items-baseline gap-1">
          <h2 className={`text-6xl font-black tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}>{amount}</h2>
          <span className="text-sm font-black text-white/50">BDT</span>
        </div>
        {isExhausted && <p className="mt-4 text-[10px] font-black text-red-500 animate-pulse tracking-[4px] uppercase">System Alert: Empty Tank! 👀</p>}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent z-30 opacity-40" />
    </div>
  );
};