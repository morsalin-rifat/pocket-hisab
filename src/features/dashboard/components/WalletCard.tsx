import React from 'react';
import { motion } from 'framer-motion';

interface WalletProps {
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export const WalletCard = ({ name, balance, icon, color }: WalletProps) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      className="min-w-[180px] h-[110px] p-5 premium-glass rounded-[28px] relative group cursor-pointer shine-effect"
    >
      <div className="absolute top-4 right-5 opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      </div>
      
      <div className="h-full flex flex-col justify-between">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[2px] mb-1">{name}</p>
          <h4 className="text-xl font-medium tracking-tighter">
            {balance.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">BDT</span>
          </h4>
        </div>
      </div>
    </motion.div>
  );
};