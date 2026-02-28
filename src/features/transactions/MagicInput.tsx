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
  
  const examples = ["বাস ভাড়া ৩০ টাকা...", "বিকাশে ৫০০০ পেলাম...", "আজকে চা ২০ টাকা...", "গত মাসে খরচ কত?"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isOpen || inputText) { setGhostText(''); return; }
    let char = 0;
    const str = examples[idx];
    const timer = setInterval(() => {
      setGhostText(str.slice(0, char + 1));
      char++;
      if (char === str.length) {
        clearInterval(timer);
        setTimeout(() => { setGhostText(''); setIdx((p) => (p + 1) % examples.length); }, 1500);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [isOpen, idx, inputText]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      if (inputText.includes("?") || inputText.length > 25) {
        const reply = await geminiService.askAssistant(inputText, transactions);
        setAssistantReply(reply);
      } else {
        const data = await geminiService.analyzeInput(inputText);
        setAiResponse(data);
      }
    } catch (e) {
      alert("Neural Link Error: এপিআই কী বা ইন্টারনেট চেক করুন।");
    }
    setIsProcessing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-3xl"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            <motion.div key="in" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white border border-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">✨</div>
                <h2 className="text-xs font-black text-white uppercase tracking-[8px]">Neural Core</h2>
              </div>

              <div className="relative bg-white/[0.04] border border-white/20 rounded-[40px] overflow-hidden">
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
                <button onClick={onClose} className="flex-1 py-5 text-white/40 font-black text-[10px] uppercase">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px]">
                  {isProcessing ? "ANALYZING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            <motion.div key="res" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-zinc-900 border border-white/20 rounded-[50px] p-10 text-center shadow-2xl">
              <div className="text-5xl mb-6">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <div className="space-y-4 text-left mb-8">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <p className="text-[9px] font-black text-cyan-400 uppercase tracking-[4px] mb-1">Amount</p>
                   <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-4xl font-black text-white outline-none w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[8px] text-white/30 uppercase mb-1">Wallet</p><span className="text-xs font-bold text-white uppercase">{aiResponse.walletId}</span></div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[8px] text-white/30 uppercase mb-1">Sector</p><span className="text-xs font-bold text-white uppercase">{aiResponse.category}</span></div>
                </div>
              </div>
              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[11px]">Confirm & Save</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Discard</button>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/20 rounded-[50px] p-10 text-center">
              <div className="text-4xl mb-6">🤖</div>
              <p className="text-white text-lg font-bold leading-tight mb-10 px-4">"{assistantReply}"</p>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase text-[10px]">Clear</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};