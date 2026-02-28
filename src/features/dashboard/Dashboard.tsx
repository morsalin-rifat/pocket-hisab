import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [transactions, setTransactions] = useState < any[] > ([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const budget = 20000; // আপাতত ফিক্সড বাজেট ২০,০০০ টাকা
  
  useEffect(() => {
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data: any[]) => {
      setTransactions(data);
      const total = data.reduce((sum, item) => sum + item.amount, 0);
      setTotalExpense(total);
    });
    return () => unsubscribe();
  }, [user.uid]);
  
  // পানির স্তর হিসেব করা (বাজেট থেকে কতটুকু বাকি আছে)
  const remainingPercent = Math.max(0, ((budget - totalExpense) / budget) * 100);
  const remainingAmount = (budget - totalExpense).toLocaleString();
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-bold">{user?.displayName?.[0] || 'U'}</div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">Financial Engine</p>
            <h1 className="text-lg font-bold tracking-tight italic">Hi, {user?.displayName?.split('_')[1] || user?.displayName}</h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        {/* লাইভ লিকুইড ব্যালেন্স */}
        <LiquidBalance percentage={remainingPercent} amount={remainingAmount} />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 text-center flex-1 ml-10">Asset Stacks</h3>
            <span className="text-[9px] font-bold text-cyan-500 animate-pulse uppercase">Switch</span>
          </div>
          <SwipableCards />
        </div>

        {/* ডাইনামিক অ্যাক্টিভিটি ফিড */}
        <div className="mt-10">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6 px-2 text-center underline decoration-cyan-500/20 underline-offset-8">Recent Activity</h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="py-12 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-white/10">No history recorded.</div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{t.category.split(' ')[0]}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{t.category.split(' ')[1]}</p>
                      <p className="text-[9px] text-white/30 uppercase">{t.note || 'No note'}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-red-400">-{t.amount} ৳</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ফ্লোটিং অ্যাকশন ডক */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[88%] z-40">
        <div className="bg-zinc-900/80 backdrop-blur-3xl p-2 rounded-[35px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">Manual</button>
          <button className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[22px] flex items-center justify-center shadow-lg -mt-12 border-[5px] border-black text-2xl">✨</button>
          <button className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">History</button>
        </div>
      </div>

      <AnimatePresence>{isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />}</AnimatePresence>
    </div>
  );
};

export default Dashboard;