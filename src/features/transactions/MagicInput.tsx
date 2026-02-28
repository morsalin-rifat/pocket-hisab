import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../../lib/gemini';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose, transactions }: any) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [assistantReply, setAssistantReply] = useState('');
  const [ghostText, setGhostText] = useState('');
  
  const examples = ["বাস ভাড়া ২০ টাকা...", "বিকাশে ৫০০০ বেতন...", "আজকে চা ২০ টাকা...", "গত মাসের খরচ?"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isOpen || inputText) { setGhostText(''); return; }
    let i = 0; const str = examples[idx];
    const timer = setInterval(() => {
      setGhostText(str.slice(0, i + 1)); i++;
      if (i === str.length) {
        clearInterval(timer);
        setTimeout(() => { setGhostText(''); setIdx((p) => (p + 1) % examples.length); }, 2000);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isOpen, idx, inputText]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    const data = await geminiService.analyzeInput(inputText);
    setAiResponse(data);
    setIsProcessing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/98 flex flex-col items-center justify-center p-6 backdrop-blur-3xl"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            <motion.div key="in" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-white border border-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">✨</div>
                <h2 className="text-xs font-black text-white uppercase tracking-[8px]">Neural Core</h2>
              </div>

              <div className="relative bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden">
                {!inputText && (
                  <div className="absolute top-10 left-10 text-white/10 text-xl font-bold pointer-events-none">
                    {ghostText}<span className="border-r-2 border-cyan-500 animate-pulse ml-1" />
                  </div>
                )}
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-56 bg-transparent p-10 text-white text-xl font-bold outline-none resize-none"
                  autoFocus 
                />
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-4 text-white/30 font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px]">
                  {isProcessing ? "PROCESSING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="res" initial={{ y: 20 }} animate={{ y: 0 }} className="bg-zinc-900 border border-white/20 rounded-[50px] p-10 text-center shadow-2xl">
              <div className="text-5xl mb-8">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <div className="space-y-4 text-left mb-8">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <p className="text-[9px] font-black text-cyan-400 uppercase mb-1">Detected Amount</p>
                   <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-4xl font-black text-white outline-none w-full" />
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between">
                    <span className="text-[9px] font-black text-white/40 uppercase">Wallet: {aiResponse.walletId}</span>
                    <span className="text-[9px] font-black text-white/40 uppercase">Sector: {aiResponse.category}</span>
                 </div>
              </div>
              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] shadow-lg">Confirm & Save</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Retry</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};