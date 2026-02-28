import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const ManualEntry = ({ isOpen, onClose }: any) => {
  const [type, setType] = useState('expense'); // expense or income
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await transactionService.addTransaction(user.uid, {
          amount, category: type === 'income' ? '💰 Income' : category, note, type
        });
        onClose();
      }
    } catch (err) { alert("Error saving!"); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* টাইপ সিলেকশন (Income/Expense Switch) */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative">
          <motion.div 
            animate={{ x: type === 'expense' ? 0 : '100%' }}
            className="absolute top-1 left-1 bottom-1 w-[48%] bg-cyan-600 rounded-xl shadow-lg"
          />
          <button onClick={() => setType('expense')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'expense' ? 'text-black' : 'text-white/40'}`}>Expense</button>
          <button onClick={() => setType('income')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'income' ? 'text-black' : 'text-white/40'}`}>Income</button>
        </div>

        <div className="space-y-6">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" className={`w-full bg-transparent text-5xl font-light outline-none border-b border-white/5 pb-2 text-center ${type === 'income' ? 'text-emerald-400' : 'text-cyan-400'}`} autoFocus />

          {type === 'expense' && (
            <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto no-scrollbar">
              {['🍔 Food', '🚗 Transport', '📱 Recharge', '🛍️ Shop', '💡 Bills'].map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 border rounded-2xl text-[9px] font-bold transition-all ${category === cat ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={loading}
          className={`w-full mt-8 py-5 font-black rounded-2xl text-[10px] uppercase tracking-[4px] active:scale-95 transition-all shadow-lg ${type === 'income' ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-cyan-600 text-black shadow-cyan-600/20'}`}>
          {loading ? "Syncing..." : "Confirm Entry"}
        </button>
      </motion.div>
    </motion.div>
  );
};