import React from 'react';
import { motion } from 'framer-motion';

export const WeeklyReport = ({ transactions }: { transactions: any[] }) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeek = transactions.filter(t => t.date.toDate() >= sevenDaysAgo);
  const income = thisWeek.filter(t => t.type === 'income').reduce((s, i) => s + i.amount, 0);
  const expense = thisWeek.filter(t => t.type === 'expense').reduce((s, i) => s + i.amount, 0);
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/[0.03] border border-white/20 rounded-[40px] p-8 mb-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
      <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/50 mb-6 text-center">Weekly Pulse</h3>
      
      <div className="flex justify-between items-end gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Income</p>
          <h4 className="text-2xl font-black text-white">+{income.toLocaleString()}</h4>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500" />
          </div>
        </div>
        
        <div className="w-[1px] h-12 bg-white/10" />

        <div className="flex-1 space-y-2 text-right">
          <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Expense</p>
          <h4 className="text-2xl font-black text-white">-{expense.toLocaleString()}</h4>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (expense/income)*100) || 0}%` }} className="h-full bg-red-500" />
          </div>
        </div>
      </div>
      
      <p className="text-center text-[8px] text-white/20 font-bold mt-6 uppercase tracking-[2px]">
        {income > expense ? "System Healthy • Surplus Detected" : "Warning • Deficit Spending"}
      </p>
    </motion.div>
  );
};