import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [transactions, setTransactions] = useState < any[] > ([]);
  const [totalExpense, setTotalExpense] = useState(0);
  
  // আপনার মাসিক বাজেট (এটি পরে ডাইনামিক করা যাবে)
  const budget = 25000;
  
  useEffect(() => {
    // ১. রিয়েল-টাইম ট্রানজেকশন ডাটা লোড
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data: any[]) => {
      setTransactions(data);
      const total = data.reduce((sum, item) => sum + item.amount, 0);
      setTotalExpense(total);
    });
    return () => unsubscribe();
  }, [user.uid]);
  
  // লিকুইড ক্যালকুলেশন
  const remainingPercent = Math.max(0, ((budget - totalExpense) / budget) * 100);
  const remainingAmount = (budget - totalExpense).toLocaleString();
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden selection:bg-cyan-500/30">
      
      {/* ১. প্রিমিয়াম হেডার সেকশন */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold shadow-xl overflow-hidden"
          >
             {user.photoURL ? <img src={user.photoURL} alt="P" className="w-full h-full object-cover" /> : user.displayName?.[0]}
          </motion.div>
          <div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[3px]">System Active</p>
            <h1 className="text-lg font-bold tracking-tight italic text-white/90">
              Hi, {user.displayName?.split('_')[1] || user.displayName?.split(' ')[0]}
            </h1>
          </div>
        </div>
        
        <button 
          onClick={() => authService.logout()} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40 hover:opacity-100 hover:bg-red-500/10 transition-all active:scale-90"
        >
          ✕
        </button>
      </div>

      {/* ২. মেইন স্ক্রলযোগ্য বডি */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        
        {/* লিকুইড ভিজ্যুয়ালাইজার (বাজেট ট্র্যাকার) */}
        <LiquidBalance percentage={remainingPercent} amount={remainingAmount} />

        {/* ওয়ালেট স্ট্যাক (কার্ড সিস্টেম) */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 flex-1 ml-8">Portfolio Stacks</h3>
            <span className="text-[8px] font-bold text-cyan-500 animate-pulse uppercase tracking-widest">Swipe</span>
          </div>
          <SwipableCards />
        </div>

        {/* রিসেন্ট অ্যাক্টিভিটি টাইমলাইন */}
        <div className="mt-8 pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-8 px-2 text-center underline decoration-cyan-500/20 underline-offset-[12px]">
            Activity Timeline
          </h3>
          
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="py-16 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-white/10">
                Waiting for your first entry...
              </div>
            ) : (
              transactions.map((t) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={t.id} 
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-[32px] flex justify-between items-center group hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                      {t.category?.split(' ')[0] || '💰'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white/80 tracking-wide">
                        {t.category?.split(' ').slice(1).join(' ') || t.category}
                      </p>
                      <p className="text-[9px] text-white/20 uppercase tracking-[2px] mt-1 line-clamp-1">
                        {t.note || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-500/80">-{t.amount} ৳</p>
                    <p className="text-[8px] text-white/10 uppercase font-bold mt-1">
                       {t.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ৩. ফ্লোটিং অ্যাকশন ডক (উন্নত পজিশন ও ডিজাইন) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-zinc-900/80 backdrop-blur-3xl p-2.5 rounded-[40px] flex items-center justify-between border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Manual Entry Button */}
          <button 
            onClick={() => setIsManualOpen(true)}
            className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center hover:text-cyan-400 transition-colors active:scale-90"
          >
            Manual
          </button>
          
          {/* AI Magic Center Button */}
          <motion.button 
            onClick={() => setIsMagicOpen(true)}
            whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl shadow-cyan-500/20 transition-all relative overflow-hidden group"
          >
            <span className="relative z-10 group-hover:animate-pulse">✨</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>

          {/* Records/History Button */}
          <button className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center hover:text-cyan-400 transition-colors active:scale-90">
            History
          </button>
        </motion.div>
      </div>

      {/* ৪. পপ-আপ মোডালসমূহ (Manual & AI) */}
      <AnimatePresence>
        {isManualOpen && (
          <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        )}
        {isMagicOpen && (
          <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;