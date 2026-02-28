import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const BudgetModal = ({ isOpen, currentBudget, onSave, onClose }: any) => {
  const [val, setVal] = useState(currentBudget);
  if (!isOpen) return null;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-xs bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl text-center">
        <h2 className="text-sm font-black text-white/40 uppercase tracking-[4px] mb-6">Set Monthly Budget</h2>
        <input 
          type="number" value={val} onChange={(e) => setVal(e.target.value)}
          className="w-full bg-transparent text-5xl font-light text-blue-500 outline-none border-b border-white/5 pb-4 text-center mb-10"
        />
        <button onClick={() => onSave(Number(val))} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px]">Update Budget</button>
        <button onClick={onClose} className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Cancel</button>
      </motion.div>
    </motion.div>
  );
};