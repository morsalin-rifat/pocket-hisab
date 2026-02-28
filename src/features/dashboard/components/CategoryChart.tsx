import React from 'react';
import { motion } from 'framer-motion';

export const CategoryChart = ({ transactions }: { transactions: any[] }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  const breakdown = expenses.reduce((acc: any, t: any) => {
    const cat = t.category.split(' ')[1] || t.category;
    acc[cat] = (acc[cat] || 0) + t.amount;
    return acc;
  }, {});
  
  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 mb-10">
      <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 mb-8 text-center">Expense Analytics</h3>
      <div className="space-y-5">
        {Object.entries(breakdown).length === 0 ? (
          <p className="text-center text-xs text-white/10 italic py-4">No data to analyze</p>
        ) : (
          Object.entries(breakdown).map(([name, amt]: any) => {
            const percentage = ((amt / total) * 100).toFixed(0);
            return (
              <div key={name} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-white/60 uppercase">{name}</span>
                  <span className="text-[10px] font-black text-cyan-500">{percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" 
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};