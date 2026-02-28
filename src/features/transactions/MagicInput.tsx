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
    "বাবার কাছ থেকে ৫০০ পেলাম",
    "গত সপ্তাহে মোট কত খরচ হয়েছে?",
    "সবচেয়ে বেশি খরচ কোন খাতে?"
  ];
  
  // টাইপরাইটার এনিমেশন (অক্ষর ধরে ধরে টাইপ এবং ধোঁয়ার মতো মিশে যাওয়া)
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
        }, 2500); // ২.৫ সেকেন্ড অপেক্ষা
      }
    }, 100); // টাইপিং স্পিড
    return () => clearInterval(typing);
  }, [isOpen, exampleIdx, inputText]);
  
  if (!isOpen) return null;
  
  const handleExecute = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      // যদি প্রশ্নবোধক চিহ্ন থাকে বা দৈর্ঘ্য বেশি হয় তবে অ্যাসিস্ট্যান্ট মোড
      if (inputText.includes("?") || inputText.includes("কত") || inputText.includes("বলো") || inputText.length > 25) {
        const reply = await geminiService.askAssistant(inputText, transactions);
        setAssistantReply(reply);
      } else {
        const data = await geminiService.analyzeInput(inputText);
        setAiResponse(data);
      }
    } catch (e) {
      alert("AI Neural Link Failed!");
    }
    setIsProcessing(false);
  };
  
  const finalizeSave = async () => {
    if (auth.currentUser && aiResponse) {
      await transactionService.addTransaction(auth.currentUser.uid, {
        ...aiResponse,
        eventId: (aiResponse.type === 'expense' && activeEvent) ? activeEvent.id : null
      });
      onClose();
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            /* ১. মেইন এআই বোর্ড */
            <motion.div key="input-zone" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-white italic tracking-[8px] uppercase">Neural Input</h2>
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {exampleText && (
                      <motion.p 
                        key={exampleText} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        className="text-white/30 text-[10px] font-bold uppercase tracking-[4px] italic"
                      >
                        {exampleText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative">
                {isProcessing && <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -inset-2 bg-cyan-500/10 rounded-[50px] blur-2xl" />}
                <textarea 
                  value={inputText} 
                  onChange={e => setInputText(e.target.value)}
                  className="w-full h-56 bg-white/[0.02] border border-white/10 rounded-[45px] p-10 text-white text-xl font-medium outline-none focus:border-cyan-500/50 transition-all resize-none shadow-2xl placeholder:text-white/5"
                  placeholder="Describe transaction or ask anything..."
                  autoFocus 
                />
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-5 text-white/30 font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[2] py-5 bg-white text-black font-black rounded-3xl text-[11px] uppercase tracking-[4px] shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  {isProcessing ? "Processing..." : "Execute Logic"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            /* ২. এআই এন্ট্রি এডিট ও রিভিউ প্যানেল */
            <motion.div key="review-zone" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-[50px] p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="text-5xl mb-6">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              <h2 className="text-sm font-black text-white uppercase tracking-[5px] mb-8 italic">Review Fragment</h2>

              <div className="space-y-4 text-left">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-1">Value</p>
                  <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-3xl font-black text-white outline-none w-full" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black text-white/30 uppercase mb-1">Wallet</p>
                      <select value={aiResponse.walletId} onChange={e=>setAiResponse({...aiResponse, walletId: e.target.value})} className="bg-transparent text-[10px] font-bold text-cyan-400 outline-none w-full uppercase">
                        {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black text-white/30 uppercase mb-1">Sector</p>
                      <span className="text-[10px] font-bold text-white uppercase">{aiResponse.category}</span>
                   </div>
                </div>

                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-white/30 uppercase mb-1">Comment</p>
                  <input type="text" value={aiResponse.note} onChange={e=>setAiResponse({...aiResponse, note: e.target.value})} className="bg-transparent text-xs font-medium text-white/80 outline-none w-full" />
                </div>
              </div>

              <button onClick={finalizeSave} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl mt-10 uppercase text-[11px] tracking-[4px] shadow-xl">Confirm Inject</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Discard</button>
            </motion.div>
          ) : (
            /* ৩. এআই অ্যাসিস্ট্যান্ট রিপ্লাই */
            <motion.div key="chat-zone" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-[50px] p-10 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">🤖</div>
              <div className="bg-white/5 p-6 rounded-[35px] mb-8 border border-white/5">
                <p className="text-white text-sm leading-relaxed font-bold italic">"{assistantReply}"</p>
              </div>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[11px] tracking-[4px]">Clear Feed</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};