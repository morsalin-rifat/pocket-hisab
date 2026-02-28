import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from './aiService';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose }: any) => {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState < any > (null);
  const [isConfirming, setIsConfirming] = useState(false);
  
  if (!isOpen) return null;
  
  const handleProcess = () => {
    if (!inputText) return;
    const result = aiService.parseText(inputText);
    setParsedData(result);
    setIsConfirming(true);
  };
  
  const handleFinalSave = async () => {
    if (auth.currentUser && parsedData) {
      await transactionService.addTransaction(auth.currentUser.uid, {
        amount: parsedData.amount,
        category: parsedData.category,
        note: parsedData.note,
        type: parsedData.type,
        walletId: parsedData.walletId
      });
      setInputText('');
      setIsConfirming(false);
      onClose();
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      {!isConfirming ? (
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-xl font-black text-cyan-400 italic tracking-[5px]">AI MAGIC BOARD</h2>
          <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="বাবার কাছ থেকে ২০০০ টাকা পেলাম..." className="w-full h-40 bg-white/5 border border-white/10 rounded-[35px] p-8 text-white text-lg outline-none focus:border-cyan-500/40 resize-none shadow-2xl" autoFocus />
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 text-white/20 font-bold uppercase text-[10px]">Cancel</button>
            <button onClick={handleProcess} className="flex-[2] py-4 bg-cyan-600 text-black font-black rounded-2xl uppercase text-[10px] tracking-[2px]">Analyze & Sync</button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-xs bg-zinc-900 border border-white/10 rounded-[45px] p-10 text-center">
          <div className="text-5xl mb-6">{parsedData.type === 'income' ? "💰" : "💸"}</div>
          <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest">{parsedData.type === 'income' ? "Income Detected" : "Expense Detected"}</h2>
          <div className="space-y-4 mb-8 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[8px] text-white/30 uppercase">Amount</span><span className="text-xl font-black text-cyan-400">{parsedData.amount} ৳</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[8px] text-white/30 uppercase">Wallet</span><span className="text-[10px] text-white/80 font-bold">{parsedData.walletId}</span></div>
            <div className="flex justify-between"><span className="text-[8px] text-white/30 uppercase">Type</span><span className={`text-[10px] font-bold ${parsedData.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>{parsedData.type.toUpperCase()}</span></div>
          </div>
          <button onClick={handleFinalSave} className="w-full py-4 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase mb-3">Save to Cloud</button>
          <button onClick={() => setIsConfirming(false)} className="w-full py-4 text-white/20 text-[9px] font-bold">Edit Input</button>
        </motion.div>
      )}
    </motion.div>
  );
};