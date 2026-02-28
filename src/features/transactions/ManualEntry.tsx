import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const ManualEntry = ({ isOpen, onClose, activeEvent }: any) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [walletId, setWalletId] = useState('Cash');
  const [toWalletId, setToWalletId] = useState('Cash');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return alert("অ্যামাউন্ট দিন!");
    setLoading(true);
    try {
      if (window.navigator.vibrate) window.navigator.vibrate(50); // হ্যাপটিক ফিডব্যাক
      await transactionService.addTransaction(auth.currentUser!.uid, {
        amount, type, walletId, toWalletId, note,
        category: type === 'income' ? '💰 Income' : (type === 'transfer' ? '🔄 Transfer' : category),
        fee: (type === 'transfer' && walletId === 'bKash') ? Number(amount) * 0.0185 : 0,
        eventId: (type === 'expense' && activeEvent) ? activeEvent.id : null // যদি ইভেন্ট মোড অন থাকে
      });
      onClose();
    } catch (err) { alert("Error!"); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/20 rounded-[45px] p-8 shadow-[0_0_50px_rgba(0,0,0,1)]" onClick={e => e.stopPropagation()}
      >
        {activeEvent && type === 'expense' && (
          <div className="mb-4 py-1 px-3 bg-blue-500/20 border border-blue-500/30 rounded-full inline-block">
             <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Active Event: {activeEvent.name}</p>
          </div>
        )}

        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
          {['expense', 'income', 'transfer'].map(t => (
            <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${type === t ? 'bg-white text-black' : 'text-white/40'}`}>{t}</button>
          ))}
        </div>

        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-6xl font-light text-white outline-none border-b border-white/10 pb-2 text-center mb-8" autoFocus />

        <div className="space-y-5 max-h-[250px] overflow-y-auto no-scrollbar">
          {type === 'expense' && (
            <div className="grid grid-cols-2 gap-2">
              {['🍔 Food', '🚗 Transport', '📱 Recharge', '🛍️ Others'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`py-3 rounded-2xl text-[10px] font-black border ${category === cat ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}>{cat}</button>
              ))}
            </div>
          )}

          <div className="flex gap-4">
             <div className="flex-1">
                <p className="text-[8px] font-black text-white uppercase tracking-widest mb-2">Wallet</p>
                <select value={walletId} onChange={e => setWalletId(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-[10px] text-white font-bold outline-none">
                  {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
             </div>
             {type === 'transfer' && (
               <div className="flex-1">
                 <p className="text-[8px] font-black text-white uppercase tracking-widest mb-2">To</p>
                 <select value={toWalletId} onChange={e => setToWalletId(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-[10px] text-white font-bold outline-none">
                    {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                 </select>
               </div>
             )}
          </div>

          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="মন্তব্য লিখুন..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white font-medium outline-none focus:border-white/30" />
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full mt-8 py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all">
          {loading ? "PROCESSING..." : "CONFIRM ENTRY"}
        </button>
      </motion.div>
    </motion.div>
  );
};