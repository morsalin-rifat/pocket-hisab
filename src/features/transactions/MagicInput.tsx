import React, { useState, useEffect, useRef } from 'react';
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
  
  const examples = [
    "বাস ভাড়া ৫০ টাকা...",
    "বিকাশে ২০০০ বেতন পেলাম...",
    "গত সপ্তাহে কত খরচ হলো?",
    "Lunch bill 250 BDT..."
  ];
  
  const [exampleIdx, setExampleIdx] = useState(0);
  
  // ইনসাইড-বক্স টাইপিং এনিমেশন লজিক
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
        }, 1500);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [isOpen, exampleIdx, inputText]);
  
  if (!isOpen) return null;
  
  const handleExecute = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      const isQuestion = inputText.includes("?") || inputText.includes("বলো") || inputText.length > 25;
      if (isQuestion) {
        const reply = await geminiService.askAssistant(inputText, transactions);
        setAssistantReply(reply);
      } else {
        const data = await geminiService.analyzeInput(inputText);
        setAiResponse(data);
      }
    } catch (e) {
      alert("Neural Link Interrupted! Try again.");
    }
    setIsProcessing(false);
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!aiResponse && !assistantReply ? (
            <motion.div key="input" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-5xl font-black text-white italic tracking-[-2px] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">NEURAL INPUT</h2>
                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[6px] opacity-70">AI Transaction Engine</p>
              </div>

              <div className="relative overflow-hidden rounded-[50px] border border-white/10 bg-white/[0.02] shadow-[0_0_50px_rgba(0,0,0,1)]">
                {/* Ghost Text Overlay (Typing Animation) */}
                {!inputText && (
                  <div className="absolute top-12 left-12 text-white/10 text-3xl font-black italic pointer-events-none select-none">
                    {ghostText}<span className="animate-pulse border-r-4 border-cyan-500 ml-1" />
                  </div>
                )}
                
                <textarea 
                  value={inputText} onChange={e => setInputText(e.target.value)}
                  className="w-full h-72 bg-transparent p-12 text-white text-3xl font-black italic outline-none resize-none transition-all placeholder:text-transparent"
                  autoFocus 
                />
                
                {isProcessing && <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />}
              </div>

              <div className="flex gap-6">
                <button onClick={onClose} className="flex-1 py-6 text-white/20 font-black text-xs uppercase tracking-widest active:scale-90 transition-all">Cancel</button>
                <button onClick={handleExecute} disabled={isProcessing} className="flex-[3] py-6 bg-white text-black font-black rounded-3xl text-sm uppercase tracking-[4px] shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all">
                  {isProcessing ? "PROCESSING DATA..." : "EXECUTE COMMAND"}
                </button>
              </div>
            </motion.div>
          ) : aiResponse ? (
            /* এআই রেজাল্ট রিভিউ */
            <motion.div key="result" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-[#0a0a0a] border-2 border-cyan-500/20 rounded-[60px] p-12 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse shadow-[0_0_20px_#06b6d4]" />
              <div className="text-7xl mb-8 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">{aiResponse.type === 'income' ? '💎' : '☄️'}</div>
              
              <div className="space-y-6 mb-12 text-left">
                <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
                   <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[4px] mb-2">Value Detected</p>
                   <input type="number" value={aiResponse.amount} onChange={e=>setAiResponse({...aiResponse, amount: Number(e.target.value)})} className="bg-transparent text-5xl font-black text-white outline-none w-full tracking-tighter" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-[30px] border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-2">Wallet</p>
                    <select value={aiResponse.walletId} onChange={e=>setAiResponse({...aiResponse, walletId: e.target.value})} className="bg-transparent text-sm font-black text-white outline-none w-full">
                      {['Cash', 'bKash', 'Bank'].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="bg-white/5 p-6 rounded-[30px] border border-white/5 flex flex-col justify-center">
                    <p className="text-[9px] font-black text-white/30 uppercase mb-1">Sector</p>
                    <span className="text-sm font-black text-cyan-400">{aiResponse.category}</span>
                  </div>
                </div>
              </div>

              <button onClick={async () => { await transactionService.addTransaction(auth.currentUser!.uid, aiResponse); onClose(); }} className="w-full py-6 bg-cyan-600 text-white font-black rounded-[30px] uppercase text-xs tracking-[6px] shadow-lg shadow-cyan-900/50">Inject into Universe</button>
              <button onClick={()=>{setAiResponse(null); setInputText('');}} className="mt-8 text-[10px] font-black text-white/20 uppercase tracking-[4px]">Erase Fragment</button>
            </motion.div>
          ) : (
            /* অ্যাসিস্ট্যান্ট চ্যাট */
            <motion.div key="chat" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#050505] border border-white/10 rounded-[60px] p-12 text-center" >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">🤖</div>
              <div className="bg-white/5 p-10 rounded-[50px] mb-10 border border-white/5">
                <p className="text-white text-xl font-black italic leading-tight tracking-tight">"{assistantReply}"</p>
              </div>
              <button onClick={()=>{setAssistantReply(''); setInputText('');}} className="w-full py-6 bg-white text-black font-black rounded-[30px] uppercase text-xs tracking-[4px]">Clear Signal</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};