import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from './aiService';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose, activeEvent }: any) => {
  const [inputText, setInputText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  
  // এডিটেবল স্টেট (AI থেকে আসার পর ইউজার এখানে এডিট করবে)
  const [editData, setEditData] = useState({
    amount: 0,
    category: '',
    type: 'expense',
    walletId: 'Cash',
    note: ''
  });
  
  if (!isOpen) return null;
  
  const handleProcess = () => {
    if (!inputText) return;
    const result = aiService.parseText(inputText);
    setEditData({
      amount: result.amount,
      category: result.category,
      type: result.type,
      walletId: result.walletId,
      note: result.note
    });
    setIsConfirming(true);
  };
  
  const handleFinalSave = async () => {
    if (auth.currentUser) {
      await transactionService.addTransaction(auth.currentUser.uid, {
        ...editData,
        eventId: (editData.type === 'expense' && activeEvent) ? activeEvent.id : null
      });
      setInputText('');
      setIsConfirming(false);
      onClose();
    }
  };
  
  const wallets = ['Cash', 'bKash', 'Bank'];
  const categories = ['🍔 Food', '🚗 Transport', '📱 Recharge', '🛒 Grocery', '💡 Bills', '💊 Medical', '🛍️ Others'];
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 overflow-y-auto"
    >
      <AnimatePresence mode="wait">
        {!isConfirming ? (
          /* ১. এআই ইনপুট বোর্ড */
          <motion.div key="input" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-black text-white italic tracking-[10px] uppercase mb-2">AI Engine</h2>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[4px]">Waiting for data fragment...</p>
            </div>
            
            <textarea 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              placeholder="৫০০ টাকা পেলাম বাবার কাছ থেকে..." 
              className="w-full h-48 bg-white/5 border border-white/10 rounded-[45px] p-10 text-white text-xl font-medium outline-none focus:border-blue-500 shadow-2xl resize-none" 
              autoFocus 
            />

            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-5 text-white/40 font-black uppercase text-[10px] tracking-[3px]">Abort</button>
              <button onClick={handleProcess} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[4px] shadow-xl active:scale-95 transition-all">Analyze Fragment</button>
            </div>
          </motion.div>
        ) : (
          /* ২. ডিটেইলড এডিট ও কনফার্ম প্যানেল */
          <motion.div key="review" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[50px] p-8 text-center shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            <div className="text-5xl mb-6">{editData.type === 'income' ? "💎" : "☄️"}</div>
            <h2 className="text-sm font-black text-white uppercase tracking-[5px] mb-8 italic">Review & Adjust</h2>

            <div className="space-y-4 text-left">
              {/* টাকার অংক এডিট */}
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-1">Confirmed Value</p>
                <input 
                  type="number" 
                  value={editData.amount} 
                  onChange={e => setEditData({...editData, amount: Number(e.target.value)})}
                  className="bg-transparent text-3xl font-black text-white outline-none w-full border-b border-white/10 pb-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* ওয়ালেট সিলেক্ট */}
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-2">Wallet</p>
                  <select 
                    value={editData.walletId} 
                    onChange={e => setEditData({...editData, walletId: e.target.value})}
                    className="bg-transparent text-[11px] font-bold text-cyan-400 outline-none w-full cursor-pointer"
                  >
                    {wallets.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                {/* টাইপ সিলেক্ট */}
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-2">Flow</p>
                  <select 
                    value={editData.type} 
                    onChange={e => setEditData({...editData, type: e.target.value})}
                    className={`bg-transparent text-[11px] font-bold outline-none w-full cursor-pointer ${editData.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              {/* ক্যাটাগরি ও নোট */}
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                <div>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-2">Sector</p>
                  <select 
                    value={editData.category} 
                    onChange={e => setEditData({...editData, category: e.target.value})}
                    className="bg-transparent text-[11px] font-bold text-white/80 outline-none w-full cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-2">Description</p>
                  <input 
                    type="text" 
                    value={editData.note} 
                    onChange={e => setEditData({...editData, note: e.target.value})}
                    className="bg-transparent text-[11px] font-medium text-white outline-none w-full border-b border-white/5 pb-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button onClick={handleFinalSave} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl text-[11px] uppercase tracking-[4px] shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
                Confirm & Inject
              </button>
              <button onClick={() => setIsConfirming(false)} className="w-full py-2 text-white/20 text-[9px] font-black uppercase tracking-[2px]">
                Re-scan Input
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};