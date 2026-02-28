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
  
  const examples = ["বাস ভাড়া ৩০ টাকা...", "বিকাশে ৫০০০ পেলাম...", "চায়ে ২০ টাকা খরচ...", "Last month total expense?"];
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
        }, 2000);
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
      alert("System Busy. Please try again.");
    }
    setIsProcessing(false);
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-xl"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            <motion.div key="input" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
              {/* AI Neural Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/5 border border-cyan-500/30 rounded-full flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                  <span className="text-3xl z-10">✨</span>
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-[4px]">Neural Input</h2>
              </div>

              <div className="relative bg-white/[0.02] border border-white/10 rounded-[35px] overflow-hidden">
                {!inputText && (
                  <div className="absolute top-8 left-8 text-white/10 text-xl font-medium pointer-events-none">
                    {ghostText}<span className="border-r-2 border-cyan-500 animate-pulse ml-1" />
                  </div>
                )}
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-48 bg-transparent p-8 text-white text-xl font-semibold outline-none resize-none"
                  autoFocus 
                />
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-4 text-white/30 font-bold text-xs uppercase tracking-widest">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-[2px] shadow-2xl active:scale-95 transition-all">
                  {isProcessing ? "PROCESSING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            /* AI Response Card - Clean & Sharp */
            <motion.div key="result" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-[45px] p-8 text-center"
            >
              <div className="text-5xl mb-6">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <div className="space-y-4 mb-8 text-left">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Detected Value</p>
                  <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-4xl font-black text-white outline-none w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-bold text-white/30 uppercase mb-1">Wallet</p>
                      <select value={aiResponse.walletId} onChange={e=>setAiResponse({...aiResponse, walletId: e.target.value})} className="bg-transparent text-xs font-bold text-white outline-none w-full uppercase">
                        {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-bold text-white/30 uppercase mb-1">Sector</p>
                      <span className="text-xs font-bold text-white">{aiResponse.category}</span>
                   </div>
                </div>
              </div>
              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-[2px] shadow-lg">Confirm & Sync</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Retry</button>
            </motion.div>
          ) : (
            /* AI Assistant Reply */
            <motion.div key="chat" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/10 rounded-[45px] p-10 text-center">
              <div className="text-4xl mb-6">🤖</div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mb-8">
                <p className="text-white text-base leading-relaxed font-medium">"{assistantReply}"</p>
              </div>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-4 bg-white text-black font-bold rounded-2xl uppercase text-[10px]">Clear Signal</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};