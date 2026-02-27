import React from 'react';
import { motion } from 'framer-motion';

interface WalletProps {
  name: string;
  balance: number;
  icon: string;
  color: string;
}

// Named Export ব্যবহার করা হয়েছে
export const WalletCard = ({ name, balance, icon, color }: WalletProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className="min-w-[150px] p-5 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group cursor-pointer"
    >
      {/* ইন্টারনাল গ্লো */}
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-[40px] transition-opacity duration-500 opacity-20 group-hover:opacity-50" 
           style={{ backgroundColor: color }} />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{name}</p>
          <h4 className="text-lg font-black tracking-tight mt-1">{balance.toLocaleString()} <span className="text-[10px] text-slate-400">৳</span></h4>
        </div>
      </div>

      {/* বর্ডার শাইন এনিমেশন */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-[32px] transition-all duration-500" />
    </motion.div>
  );
};