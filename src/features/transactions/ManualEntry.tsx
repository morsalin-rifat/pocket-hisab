import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualEntry = ({ isOpen, onClose }: Props) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await transactionService.addTransaction(userId, {
          amount,
          category,
          note,
          wallet: 'Cash' // ডিফল্ট ক্যাশ ওয়ালেট
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
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
        className="w-full max-w-sm bg-[#0d1425] border border-white/10 rounded-[40px] p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic text-white">ADD EXPENSE</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">✕</button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-2">Amount (BDT)</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" className="w-full bg-transparent text-4xl font-light text-cyan-400 outline-none border-b border-white/5 pb-2" autoFocus />
          </div>

          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-3">Category</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {['🍔 Food', '🚗 Transport', '🛍️ Shop', '💡 Bills', '💊 Meds'].map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 border rounded-2xl text-[10px] font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/10 text-white/60'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          className="w-full mt-10 py-5 bg-cyan-600 text-black font-black rounded-2xl text-xs uppercase tracking-[4px] shadow-lg shadow-cyan-600/20 active:scale-95 transition-all">
          {loading ? "Processing..." : "Confirm & Save"}
        </button>
      </motion.div>
    </motion.div>
  );
};