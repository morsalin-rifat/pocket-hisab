import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from './aiService';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

interface Props { isOpen: boolean;onClose: () => void; }

export const MagicInput = ({ isOpen, onClose }: Props) => {
  const [inputText, setInputText] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [parsedData, setParsedData] = useState < any > (null);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const examples = [
    "বাস ভাড়া ৩০ টাকা দিলাম",
    "বিকাশ থেকে ১০০০ টাকা ক্যাশ আউট",
    "চা ২০ টাকা",
    "বাবার একাউন্টে ৫০০০ পাঠালাম"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => setExampleIndex(i => (i + 1) % examples.length), 3000);
    return () => clearInterval(interval);
  }, []);
  
  if (!isOpen) return null;
  
  const handleProcess = () => {
    if (!inputText) return;
    const result = aiService.parseText(inputText);
    setParsedData(result);
    setIsConfirming(true);
  };
  
  const handleFinalSave = async () => {
    const user = auth.currentUser;
    if (user && parsedData) {
      // যদি ট্রান্সফার হয়, আমরা দুটি এন্ট্রি করতে পারি অথবা একটি স্পেশাল ফ্ল্যাগ দিতে পারি
      await transactionService.addTransaction(user.uid, {
        amount: parsedData.amount,
        category: parsedData.category,
        note: parsedData.note,
        fee: parsedData.fee || 0,
        type: parsedData.isTransfer ? 'transfer' : 'expense'
      });
      setIsConfirming(false);
      setInputText('');
      onClose();
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      {!isConfirming ? (
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-black text-cyan-400 italic tracking-[4px] mb-2 uppercase">Input Portal</h2>
            <AnimatePresence mode="wait">
              <motion.p key={exampleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/30 text-xs font-bold tracking-widest italic">
                Try: "{examples[exampleIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your transaction..."
            className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-[35px] p-8 text-white text-lg outline-none focus:border-cyan-500/50 transition-all resize-none shadow-2xl"
            autoFocus
          />

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 text-white/20 font-bold uppercase text-[10px] tracking-[2px]">Cancel</button>
            <button onClick={handleProcess} className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-[2px] shadow-lg shadow-cyan-500/20">Analyze & Process</button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xs bg-zinc-900 border border-white/10 rounded-[45px] p-10 text-center shadow-[0_0_50px_rgba(0,0,0,1)]"
        >
          <div className="text-5xl mb-6">{parsedData.isTransfer ? "🔄" : "🤖"}</div>
          <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest">{parsedData.isTransfer ? "Transfer Ready" : "Confirm Entry"}</h2>
          
          <div className="space-y-4 mb-8 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Main Amount</span>
              <span className="text-xl font-black text-cyan-400">{parsedData.amount} ৳</span>
            </div>
            {parsedData.isTransfer && (
              <div className="flex justify-between items-baseline border-b border-white/5 pb-2 text-red-400">
                <span className="text-[8px] font-black uppercase tracking-widest">Fee (System)</span>
                <span className="text-xs font-bold">{parsedData.fee} ৳</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Category</span>
              <span className="text-[10px] font-bold text-white/80">{parsedData.category}</span>
            </div>
          </div>

          <button onClick={handleFinalSave} className="w-full py-4 bg-cyan-600 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] shadow-xl mb-3">Sync Transaction</button>
          <button onClick={() => setIsConfirming(false)} className="w-full py-4 text-white/20 text-[9px] font-bold uppercase tracking-widest">Re-adjust Input</button>
        </motion.div>
      )}
    </motion.div>
  );
};