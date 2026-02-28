import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from './aiService';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose, activeEvent }: any) => {
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
        walletId: parsedData.walletId,
        eventId: (parsedData.type === 'expense' && activeEvent) ? activeEvent.id : null
      });
      setInputText('');
      setIsConfirming(false);
      onClose();
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
    >
      {!isConfirming ? (
        <div className="w-full max-w-md space-y-8">
           {activeEvent && <div className="text-center text-blue-400 text-[10px] font-black uppercase tracking-[5px] animate-pulse">Event Universe Active</div>}
          <h2 className="text-center text-2xl font-black text-white italic tracking-[10px]">AI ENGINE</h2>
          <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="বিকাশে ৫০০ পেলাম..." className="w-full h-48 bg-white/5 border border-white/20 rounded-[45px] p-10 text-white text-xl font-medium outline-none focus:border-blue-500 shadow-2xl resize-none" autoFocus />
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 text-white/40 font-black uppercase text-[10px] tracking-[3px]">Cancel</button>
            <button onClick={handleProcess} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[4px]">Initiate Sync</button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-xs bg-zinc-900 border border-white/10 rounded-[50px] p-12 text-center shadow-[0_0_100px_rgba(0,0,0,1)]">
          <div className="text-6xl mb-8">{parsedData.type === 'income' ? "💎" : "☄️"}</div>
          <div className="space-y-6 mb-12 text-left bg-white/5 p-8 rounded-[35px] border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-[9px] text-white/30 uppercase font-black">Value</span><span className="text-2xl font-black text-white">{parsedData.amount} ৳</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-white/30 uppercase font-black">Universe</span><span className="text-[10px] text-blue-400 font-black uppercase">{activeEvent ? activeEvent.name : 'Normal'}</span></div>
          </div>
          <button onClick={handleFinalSave} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[4px] shadow-lg mb-4">Confirm & Inject</button>
          <button onClick={() => setIsConfirming(false)} className="w-full py-2 text-white/20 text-[9px] font-black uppercase">Edit Fragment</button>
        </motion.div>
      )}
    </motion.div>
  );
};