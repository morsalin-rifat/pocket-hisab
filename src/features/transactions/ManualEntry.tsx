import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

interface Props { isOpen: boolean; onClose: () => void; }

export const ManualEntry = ({ isOpen, onClose }: Props) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('☕ Tea & Snacks');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const categories = [
    '☕ Tea & Snacks', '📱 Recharge', '🚗 Transport', 
    '🍔 Meal/Food', '🛒 Grocery', '💡 Bills', '💊 Medical', '🛍️ Others'
  ];

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await transactionService.addTransaction(user.uid, {
          amount: Number(amount),
          category,
          note
        });
        setAmount(''); setNote('');
        onClose();
      } else {
        alert("সেশন শেষ হয়ে গেছে। আবার লগ-ইন করুন।");
      }
    } catch (err) {
      alert("ডাটাবেসে সেভ হতে সমস্যা হয়েছে। Rules চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 text-white font-black italic">
          <h2>MANUAL ENTRY</h2>
          <button onClick={onClose} className="opacity-40">✕</button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[4px] mb-2">Amount (BDT)</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" className="w-full bg-transparent text-5xl font-light text-cyan-400 outline-none border-b border-white/5" autoFocus />
          </div>

          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[4px] mb-3">Category</p>
            <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto no-scrollbar">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 border rounded-2xl text-[9px] font-bold text-left transition-all ${category === cat ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          className="w-full mt-8 py-5 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] active:scale-95 transition-all shadow-lg shadow-cyan-600/20">
          {loading ? "INITIALIZING..." : "CONFIRM & LOG"}
        </button>
      </motion.div>
    </motion.div>
  );
};