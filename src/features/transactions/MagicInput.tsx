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
  
  const examples = ["বাস ভাড়া ২০ টাকা...", "বিকাশে ৫০০০ পেলাম...", "আজকে চা ২০ টাকা...", "গত মাসে খরচ কত?"];
  const [idx, setIdx] = useState(0);

  // ইন-বক্স ঘোস্ট টাইপিং লজিক
  useEffect(() => {
    if (!isOpen || inputText) { setGhostText(''); return; }
    let i = 0;
    const str = examples[idx];
    const timer = setInterval(() => {
      setGhostText(str.slice(0, i + 1));
      i++;
      if (i === str.length) {
        clearInterval(timer);
        setTimeout(() => { setGhostText(''); setIdx((prev) => (prev + 1) % examples.length); }, 2000);
      }
    }, 100);
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
      alert("Neural Bridge Fault. Retry in 3 seconds.");
    }
    setIsProcessing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/98 flex flex-col items-center justify-center p-6 backdrop-blur-3xl"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            <motion.div key="in" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-12">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white border-[3px] border-cyan-500 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-pulse">
                  ✨
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-[8px]">Neural Core</h2>
              </div>

              <div className="relative bg-white/[0.04] border border-white/20 rounded-[45px] overflow-hidden shadow-2xl">
                {!inputText && (
                  <div className="absolute top-10 left-10 text-white/10 text-2xl font-bold pointer-events-none">
                    {ghostText}<span className="w-1 h-8 bg-cyan-500 ml-1 inline-block animate-pulse" />
                  </div>
                )}
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-64 bg-transparent p-10 text-white text-2xl font-black outline-none resize-none"
                  autoFocus 
                />
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-5 text-white/30 font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-[4px] shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  {isProcessing ? "ANALYZING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            <motion.div key="res" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-zinc-900 border border-white/20 rounded-[60px] p-12 text-center">
              <div className="text-6xl mb-8">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <div className="space-y-6 text-left mb-12">
                <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mb-2 text-center">Fragment Value</p>
                   <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-5xl font-black text-white text-center outline-none w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center uppercase">
                      <p className="text-[8px] font-black text-white/30 mb-1">Wallet</p>
                      <select value={aiResponse.walletId} onChange={e=>setAiResponse({...aiResponse, walletId: e.target.value})} className="bg-transparent text-xs font-black text-cyan-400 outline-none w-full text-center">
                        {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                   </div>
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center">
                      <p className="text-[8px] font-black text-white/30 mb-1">Sector</p>
                      <span className="text-[10px] font-black text-white">{aiResponse.category}</span>
                   </div>
                </div>
              </div>
              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl uppercase text-xs tracking-[4px]">Confirm Sync</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-6 text-[9px] font-black text-white/20 uppercase">Discard</button>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/20 rounded-[60px] p-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-8 mx-auto animate-pulse">🤖</div>
              <p className="text-white text-lg leading-relaxed font-black mb-10 px-4">"{assistantReply}"</p>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[4px]">Clear Feed</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};