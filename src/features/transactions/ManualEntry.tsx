import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const ManualEntry = ({ isOpen, onClose }: any) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      await transactionService.addTransaction(auth.currentUser!.uid, {
        amount, category: type === 'income' ? '💰 Income' : category, type
      });
      onClose();
    } catch (err) { alert("Error!"); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl" onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative">
          <motion.div animate={{ x: type === 'expense' ? 0 : '100%' }} className="absolute top-1 left-1 bottom-1 w-[48%] bg-cyan-600 rounded-xl" />
          <button onClick={() => setType('expense')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'expense' ? 'text-black' : 'text-white/40'}`}>Expense</button>
          <button onClick={() => setType('income')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'income' ? 'text-black' : 'text-white/40'}`}>Income</button>
        </div>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-5xl font-light text-cyan-400 outline-none border-b border-white/5 pb-2 text-center mb-8" autoFocus />
        {type === 'expense' && (
          <div className="grid grid-cols-2 gap-2 mb-8">{['🍔 Food', '🚗 Transport', '📱 Recharge', '🛍️ Others'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`py-3 border rounded-2xl text-[9px] font-bold ${category === cat ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>{cat}</button>
          ))}</div>
        )}
        <button onClick={handleSave} disabled={loading} className="w-full py-5 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px]">{loading ? "Syncing..." : "Confirm"}</button>
      </motion.div>
    </motion.div>
  );
};