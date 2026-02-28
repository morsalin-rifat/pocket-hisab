import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export const WalletCard = ({ name, balance, icon, color }: Props) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className="min-w-[180px] h-[120px] p-6 rounded-[35px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 relative overflow-hidden group cursor-pointer shadow-2xl transition-all"
    >
      {/* গ্লোয়িং হোভার ইফেক্ট */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-40 transition-opacity duration-500`} style={{ backgroundColor: color }} />
      
      <div className="h-full flex flex-col justify-between relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xl border border-white/5 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px] mb-1">{name}</p>
          <h4 className="text-xl font-bold tracking-tight">
            {balance.toLocaleString()} <span className="text-[10px] text-white/40">BDT</span>
          </h4>
        </div>
      </div>
    </motion.div>
  );
};