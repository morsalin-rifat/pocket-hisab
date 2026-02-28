import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  percentage: number; // ০ থেকে ১০০
  amount: string;
}

export const LiquidVisualizer = ({ percentage, amount }: Props) => {
  // বাজেট অনুযায়ী পানির রঙ নির্ধারণ (সায়ান -> কমলা -> লাল)
  const getWaterColor = () => {
    if (percentage > 60) return "from-cyan-400 to-blue-600";
    if (percentage > 25) return "from-orange-400 to-red-500";
    return "from-red-600 to-rose-900";
  };
  
  return (
    <div className="relative w-full h-48 glass-tank rounded-[40px] overflow-hidden mb-10 group">
      {/* পানির স্তর (The Liquid) */}
      <motion.div 
        initial={{ height: '100%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${getWaterColor()} transition-colors duration-1000`}
      >
        {/* SVG Waves */}
        <div className="absolute top-0 left-0 w-[400%] h-20 -translate-y-full">
          <svg viewBox="0 0 1200 120" className="absolute left-0 w-1/2 h-full opacity-40 animate-wave fill-current">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
          <svg viewBox="0 0 1200 120" className="absolute left-0 w-1/2 h-full opacity-60 animate-wave-fast fill-current" style={{ animationDirection: 'reverse', top: '5px' }}>
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1350,60 L1350,120 L0,120 Z" />
          </svg>
        </div>
      </motion.div>

      {/* টাকা এবং টেক্সট (মাঝখানে ভাসমান) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-1">Liquid Liquidity</p>
        <div className="flex items-baseline gap-1">
          <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-lg">{amount}</h2>
          <span className="text-xs font-bold opacity-50">BDT</span>
        </div>
      </div>

      {/* রিফ্লেকশন শাইন */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};