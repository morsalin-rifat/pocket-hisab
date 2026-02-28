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
    "সিঙ্গাড়া খেয়েছি ২০ টাকার",
    "আজকের বাজার ৫০০ টাকা",
    "ওয়াইফাই বিল ১০০০ টাকা"
  ];
  
  // টাইপরাইটার এক্সাম্পল সাইকেল (৩ সেকেন্ড পর পর)
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % examples.length);
    }, 3000);
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
    const userId = auth.currentUser?.uid;
    if (userId && parsedData) {
      await transactionService.addTransaction(userId, {
        amount: parsedData.amount,
        category: parsedData.category,
        note: parsedData.note,
        walletId: 'Cash'
      });
      setIsConfirming(false);
      setInputText('');
      onClose();
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      {!isConfirming ? (
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md space-y-10">
          {/* ম্যাজিক বোর্ড হেডার */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-cyan-400 italic tracking-tighter mb-2 animate-pulse">MAGIC BOARD ✨</h2>
            <div className="h-20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p key={exampleIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-white/40 italic text-sm font-medium">
                  Try: "{examples[exampleIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* ইন্টারঅ্যাক্টিভ ইনপুট বক্স */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[35px] blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="আপনি কি খরচ করেছেন তা লিখুন..."
              className="relative w-full h-40 bg-zinc-900 border border-white/10 rounded-[30px] p-8 text-white text-lg outline-none focus:border-cyan-500/50 transition-all resize-none"
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 text-white/40 font-bold rounded-2xl uppercase tracking-widest text-[10px]">Cancel</button>
            <button onClick={handleProcess} className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-500/20">Analyze Logic</button>
          </div>
        </motion.div>
      ) : (
        /* কনফার্মেশন পপ-আপ */
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xs bg-white/5 border border-white/10 rounded-[45px] p-10 backdrop-blur-3xl text-center shadow-2xl"
        >
          <div className="text-5xl mb-6">🤖</div>
          <h2 className="text-xl font-bold text-white mb-6 italic underline decoration-cyan-500/30 underline-offset-8">Confirm Entry?</h2>
          
          <div className="space-y-4 mb-10 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Amount</span>
              <span className="text-xl font-black text-cyan-400">{parsedData.amount} ৳</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Category</span>
              <span className="text-xs font-bold text-white/80">{parsedData.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Time</span>
              <span className="text-[10px] text-white/40">{parsedData.time}</span>
            </div>
          </div>

          <button onClick={handleFinalSave} className="w-full py-4 bg-cyan-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] shadow-xl shadow-cyan-500/20 mb-3">Save Mission</button>
          <button onClick={() => setIsConfirming(false)} className="w-full py-4 text-white/20 text-[9px] font-bold uppercase tracking-widest">Edit Input</button>
        </motion.div>
      )}
    </motion.div>
  );
};