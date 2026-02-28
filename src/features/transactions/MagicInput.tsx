import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../../lib/gemini';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose, transactions }: any) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState < any > (null);
  const [assistantReply, setAssistantReply] = useState('');
  const [ghostText, setGhostText] = useState('');
  
  const examples = ["রিকশা ভাড়া ২০ টাকা...", "বিকাশে ৫০০০ বেতন পেলাম...", "আজকের খাবার ২০০ টাকা...", "গত সপ্তাহে মোট খরচ কত?"];
  const [exampleIdx, setExampleIdx] = useState(0);
  
  useEffect(() => {
    if (!isOpen || inputText) { setGhostText(''); return; }
    let charIdx = 0;
    const currentStr = examples[exampleIdx];
    const timer = setInterval(() => {
      setGhostText(currentStr.slice(0, charIdx + 1));
      charIdx++;
      if (charIdx === currentStr.length) {
        clearInterval(timer);
        setTimeout(() => {
          setGhostText('');
          setExampleIdx((prev) => (prev + 1) % examples.length);
        }, 1800);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isOpen, exampleIdx, inputText]);
  
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
      alert("Neural link unstable. Try again.");
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
            <motion.div key="input" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(255,255,255,0.05)]">✨</div>
                <h2 className="text-sm font-black text-white uppercase tracking-[8px]">Neural Interface</h2>
              </div>

              <div className="relative bg-white/[0.03] border border-white/10 rounded-[45px] overflow-hidden shadow-2xl">
                {!inputText && (
                  <div className="absolute top-10 left-10 text-white/10 text-xl font-bold pointer-events-none tracking-tight">
                    {ghostText}<span className="border-r-2 border-cyan-500 animate-pulse ml-1" />
                  </div>
                )}
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-56 bg-transparent p-10 text-white text-xl font-bold outline-none resize-none tracking-tight"
                  autoFocus 
                />
              </div>

              <div className="flex gap-5">
                <button onClick={onClose} className="flex-1 py-5 text-white/30 font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px] shadow-2xl">
                  {isProcessing ? "PROCESSING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            <motion.div key="result" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-zinc-900 border border-white/10 rounded-[55px] p-10 text-center shadow-2xl">
              <div className="text-5xl mb-8">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <div className="space-y-5 text-left mb-12">
                <div className="bg-white/5 p-6 rounded-[35px] border border-white/5">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[4px] mb-2">Confirmed Value</p>
                  <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-4xl font-black text-white outline-none w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-[25px] border border-white/5">
                      <p className="text-[8px] font-black text-white/30 uppercase mb-1">Wallet</p>
                      <select value={aiResponse.walletId} onChange={e=>setAiResponse({...aiResponse, walletId: e.target.value})} className="bg-transparent text-xs font-bold text-cyan-400 outline-none w-full uppercase cursor-pointer">
                        {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                   </div>
                   <div className="bg-white/5 p-4 rounded-[25px] border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/30 uppercase mb-1">Sector</p>
                      <span className="text-xs font-bold text-white uppercase">{aiResponse.category}</span>
                   </div>
                </div>
              </div>
              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl uppercase text-[11px] tracking-[4px] shadow-lg shadow-blue-900/50">Commit to Cloud</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-6 text-[9px] font-black text-white/20 uppercase tracking-[4px]">Discard Fragment</button>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/10 rounded-[55px] p-12 text-center">
              <div className="text-4xl mb-8 mx-auto">🤖</div>
              <div className="bg-white/5 p-8 rounded-[40px] mb-10 border border-white/5 shadow-inner">
                <p className="text-white text-base leading-relaxed font-bold tracking-tight px-2">"{assistantReply}"</p>
              </div>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[4px]">Clear Feed</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};