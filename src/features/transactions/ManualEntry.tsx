import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const ManualEntry = ({ isOpen, onClose }: any) => {
  const [type, setType] = useState('expense'); // expense, income, transfer
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [walletId, setWalletId] = useState('Cash');
  const [toWalletId, setToWalletId] = useState('Cash');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const categories = ['🍔 Food', '🚗 Transport', '📱 Recharge', '🛒 Grocery', '💡 Bills', '💊 Medical', '🛍️ Others'];
  const wallets = ['Cash', 'bKash', 'Bank'];

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      await transactionService.addTransaction(auth.currentUser!.uid, {
        amount, type, walletId, toWalletId, note,
        category: type === 'income' ? '💰 Income' : (type === 'transfer' ? '🔄 Transfer' : category),
        fee: (type === 'transfer' && walletId === 'bKash') ? Number(amount) * 0.0185 : 0
      });
      onClose();
    } catch (err) { alert("Error!"); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl" onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[45px] p-8 shadow-2xl" onClick={e => e.stopPropagation()}
      >
        {/* ৩টি ট্যাব */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
          {['expense', 'income', 'transfer'].map(t => (
            <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 text-[8px] font-black uppercase rounded-xl transition-all ${type === t ? 'bg-cyan-600 text-black' : 'text-white/30'}`}>{t}</button>
          ))}
        </div>

        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-5xl font-light text-cyan-400 outline-none border-b border-white/5 pb-2 text-center mb-6" autoFocus />

        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
          {/* ক্যাটেগরি সিলেকশন (শুধুমাত্র খরচের জন্য) */}
          {type === 'expense' && (
            <div>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-2">Category</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-2 px-3 rounded-xl text-[9px] font-bold border ${category === cat ? 'bg-white text-black border-white' : 'border-white/5 text-white/40'}`}>{cat}</button>
                ))}
              </div>
            </div>
          )}

          {/* ওয়ালেট সিলেকশন */}
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-2">{type === 'transfer' ? 'From' : 'Wallet'}</p>
              <select value={walletId} onChange={e => setWalletId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-[10px] text-white outline-none">
                {wallets.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            {type === 'transfer' && (
              <div className="flex-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-2">To</p>
                <select value={toWalletId} onChange={e => setToWalletId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-[10px] text-white outline-none">
                  {wallets.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            )}
          </div>
          
          {/* নোট/কে দিল */}
          <div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-2">{type === 'income' ? 'Who gave / Why?' : 'Note'}</p>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="..." className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" />
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full mt-6 py-5 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] shadow-lg active:scale-95 transition-all">
          {loading ? "Initializing..." : "Confirm & Save"}
        </button>
      </motion.div>
    </motion.div>
  );
};