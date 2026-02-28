import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../../lib/gemini';
import { transactionService } from './transactionService';
import { auth } from '../../lib/firebase';

export const MagicInput = ({ isOpen, onClose, transactions, activeEvent }: any) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState < any > (null);
  const [assistantReply, setAssistantReply] = useState('');
  const [exampleText, setExampleText] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  
  const examples = [
    "বাস ভাড়া ৫০ টাকা দিলাম",
    "বিকাশে ২০০০ টাকা বেতন পেলাম",
    "আজকের লাঞ্চ ২০০ টাকা",
    "গত সপ্তাহে মোট কত খরচ হয়েছে?"
  ];
  
  useEffect(() => {
    if (!isOpen || inputText) return;
    let charIdx = 0;
    const currentStr = examples[exampleIdx];
    const typing = setInterval(() => {
      setExampleText(currentStr.slice(0, charIdx + 1));
      charIdx++;
      if (charIdx === currentStr.length) {
        clearInterval(typing);
        setTimeout(() => {
          setExampleText('');
          setExampleIdx((prev) => (prev + 1) % examples.length);
        }, 2000);
      }
    }, 80);
    return () => clearInterval(typing);
  }, [isOpen, exampleIdx, inputText]);
  
  if (!isOpen) return null;
  
  const handleExecute = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      if (inputText.includes("?") || inputText.includes("বলো") || inputText.length > 25) {
        const reply = await geminiService.askAssistant(inputText, transactions);
        setAssistantReply(reply);
      } else {
        const data = await geminiService.analyzeInput(inputText);
        setAiResponse(data);
      }
    } catch (e) {
      console.error(e);
      alert("AI Neural Link Failed! Please try again.");
    }
    setIsProcessing(false);
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center p-6 backdrop-blur-3xl"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            /* ১. মেইন এআই বোর্ড */
            <motion.div key="input-zone" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="space-y-10">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white italic tracking-[12px] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">AI ENGINE</h2>
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {exampleText && (
                      <motion.p key={exampleText} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, filter: 'blur(8px)', x: -20 }}
                        className="text-cyan-400/50 text-[10px] font-black uppercase tracking-[5px]">
                        {exampleText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative group">
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-64 bg-white/[0.03] border border-white/20 rounded-[50px] p-10 text-white text-2xl font-bold outline-none focus:border-blue-500 transition-all shadow-[0_0_50px_rgba(0,0,0,1)] resize-none placeholder:text-white/5"
                  placeholder="Tell me your expense..." autoFocus 
                />
                {isProcessing && (
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-blue-500/5 rounded-[50px] pointer-events-none border-2 border-blue-500/20" />
                )}
              </div>

              <div className="flex gap-5">
                <button onClick={onClose} className="flex-1 py-5 text-white/30 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-5 bg-white text-black font-black rounded-[25px] text-xs uppercase tracking-[5px] shadow-2xl active:scale-95 transition-all">
                  {isProcessing ? "SCANNING..." : "EXECUTE"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            /* ২. এআই এন্ট্রি রিভিউ (High Contrast) */
            <motion.div key="review-zone" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-[#0a0a0a] border border-white/20 rounded-[60px] p-10 text-center shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <div className="text-6xl mb-8 drop-shadow-2xl">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[6px] mb-10 italic">Data Verification</h2>

              <div className="space-y-5 text-left mb-12">
                <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                   <p className="text-[9px] font-black text-cyan-400 uppercase tracking-[4px] mb-2">Value</p>
                   <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-4xl font-black text-white outline-none w-full" />
                </div>
                <div className="bg-white/5 p-6 rounded-[35px] border border-white/10 flex justify-between items-center">
                   <div>
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px] mb-1">Sector</p>
                     <span className="text-sm font-bold text-white uppercase">{aiResponse.category}</span>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px] mb-1">Wallet</p>
                     <span className="text-sm font-bold text-blue-400 uppercase">{aiResponse.walletId}</span>
                   </div>
                </div>
              </div>

              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-6 bg-blue-600 text-white font-black rounded-[30px] uppercase text-xs tracking-[5px] shadow-lg shadow-blue-600/30">Confirm Sync</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-6 text-[9px] font-black text-white/20 uppercase tracking-[4px]">Discard Fragment</button>
            </motion.div>
          ) : (
            /* ৩. এআই অ্যাসিস্ট্যান্ট রিপ্লাই (Crystal Clear) */
            <motion.div key="chat-zone" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[60px] p-12 text-center"
            >
              <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[35px] flex items-center justify-center text-4xl mb-8 mx-auto animate-pulse">🤖</div>
              <div className="bg-white/5 p-8 rounded-[45px] mb-10 border border-white/5">
                <p className="text-white text-lg leading-relaxed font-bold italic tracking-tight">"{assistantReply}"</p>
              </div>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-5 bg-white text-black font-black rounded-[25px] uppercase text-[10px] tracking-[5px]">Clear Feed</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};