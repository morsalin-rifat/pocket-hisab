import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const ManualEntry = ({ isOpen, onClose }: any) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [walletId, setWalletId] = useState('Cash');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      await transactionService.addTransaction(auth.currentUser!.uid, {
        amount,
        category: type === 'income' ? '💰 Income' : category,
        type,
        walletId,
        note: note || (type === 'income' ? "Cash In" : "Regular Expense")
      });
      onClose();
    } catch (err) { alert("Error!"); } finally { setLoading(false); }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl" onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[45px] p-8 shadow-2xl" onClick={e => e.stopPropagation()}
      >
        <div className="flex bg-white/5 p-1 rounded-2xl mb-6 relative">
          <motion.div animate={{ x: type === 'expense' ? 0 : '100%' }} className="absolute top-1 left-1 bottom-1 w-[48%] bg-cyan-600 rounded-xl" />
          <button onClick={() => setType('expense')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'expense' ? 'text-black' : 'text-white/40'}`}>Expense</button>
          <button onClick={() => setType('income')} className={`flex-1 py-2 text-[10px] font-black uppercase z-10 ${type === 'income' ? 'text-black' : 'text-white/40'}`}>Income</button>
        </div>

        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-5xl font-light text-cyan-400 outline-none border-b border-white/5 pb-2 text-center mb-8" autoFocus />

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-2 text-center">Select Wallet</p>
            <div className="flex gap-2 justify-center">
              {['Cash', 'bKash', 'Bank'].map(w => (
                <button key={w} onClick={() => setWalletId(w)} className={`px-4 py-2 rounded-xl text-[9px] font-bold border ${walletId === w ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}>{w}</button>
              ))}
            </div>
          </div>
          
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder={type === 'income' ? "কার কাছ থেকে? কেন?" : "মন্তব্য..."} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/30" />
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full py-5 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] shadow-lg active:scale-95 transition-all">
          {loading ? "INITIALIZING..." : "LOG TRANSACTION"}
        </button>
      </motion.div>
    </motion.div>
  );
};