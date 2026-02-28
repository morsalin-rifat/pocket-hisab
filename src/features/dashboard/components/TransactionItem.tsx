import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  amount: number;
  time: string;
  category: string;
  icon: string;
}

export const TransactionItem = ({ title, amount, time, category, icon }: Props) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 mb-3 bg-white/[0.03] border border-white/[0.05] rounded-3xl"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{category} • {time}</p>
        </div>
      </div>
      <div className="text-right">
        <h4 className="text-sm font-bold text-red-400">-{amount} ৳</h4>
      </div>
    </motion.div>
  );
};