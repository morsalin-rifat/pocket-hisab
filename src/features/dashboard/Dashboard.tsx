import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [transactions, setTransactions] = useState < any[] > ([]);
  const [totalExpense, setTotalExpense] = useState(0);
  
  const monthlyBudget = 25000;
  
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data) => {
      setTransactions(data);
      const total = data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setTotalExpense(total);
    });
    
    return () => unsubscribe();
  }, [user.uid]);
  
  const currentBalance = monthlyBudget - totalExpense;
  const remainingPercent = Math.max(0, (currentBalance / monthlyBudget) * 100);
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden selection:bg-cyan-500/30">
      
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold shadow-xl">
             {user.displayName?.[0] || 'U'}
          </div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">Financial Engine</p>
            <h1 className="text-lg font-bold tracking-tight italic text-white/90">
              Hi, {user.displayName?.split('_')[1] || user.displayName?.split(' ')[0]}
            </h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40">✕</button>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        <LiquidBalance percentage={remainingPercent} amount={currentBalance.toLocaleString()} />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 flex-1 ml-8">Portfolio</h3>
            <span className="text-[8px] font-bold text-cyan-500 animate-pulse">SWIPE</span>
          </div>
          <SwipableCards />
        </div>

        {/* রিসেন্ট ফিড */}
        <div className="mt-8">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-8 px-2 text-center underline decoration-cyan-500/20 underline-offset-[12px]">Activity Feed</h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="py-16 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-white/10 tracking-widest">ZERO ACTIVITY</div>
            ) : (
              transactions.slice(0, 10).map((t) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={t.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[32px] flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">{t.category?.split(' ')[0] || '💰'}</div>
                    <div>
                      <p className="text-xs font-black text-white/80">{t.category?.split(' ').slice(1).join(' ') || t.category}</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-[2px] line-clamp-1">{t.note || 'No description'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-500/80">-{t.amount} ৳</p>
                    <p className="text-[8px] text-white/10 uppercase mt-1">{t.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ফ্লোটিং ডক */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-zinc-900/80 backdrop-blur-3xl p-2.5 rounded-[40px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl shadow-cyan-500/20">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">History</button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />}
        {isMagicOpen && <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;