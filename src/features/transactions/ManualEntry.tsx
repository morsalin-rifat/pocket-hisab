import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualEntry = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      {/* মেইন ফর্ম কার্ড */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-sm bg-zinc-900/90 border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* শাইন ইফেক্ট */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic tracking-tight text-white">MANUAL ENTRY</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">✕</button>
        </div>

        {/* ইনপুট ফিল্ডস */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-2">Amount (BDT)</p>
            <input 
              type="number" 
              placeholder="0.00" 
              className="w-full bg-transparent text-4xl font-light tracking-tighter text-cyan-400 outline-none border-b border-white/5 pb-2 focus:border-cyan-500 transition-all"
              autoFocus
            />
          </div>

          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-3">Category</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {['🍔 Food', '🚗 Transport', '🛍️ Shop', '💡 Bills'].map((cat) => (
                <button key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold whitespace-nowrap active:bg-cyan-500 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-2">Note (Optional)</p>
            <input 
              type="text" 
              placeholder="What was this for?" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-white/20"
            />
          </div>
        </div>

        {/* কনফার্ম বাটন */}
        <button className="w-full mt-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-2xl text-xs uppercase tracking-[4px] transition-all active:scale-95 shadow-lg shadow-cyan-600/20">
          Confirm Entry
        </button>
      </motion.div>
    </motion.div>
  );
};