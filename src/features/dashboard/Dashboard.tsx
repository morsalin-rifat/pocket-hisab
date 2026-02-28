import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { WeeklyReport } from './components/WeeklyReport';
import { EventHub } from './components/EventHub';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { BudgetModal } from './components/BudgetModal';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isEventHubOpen, setIsEventHubOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budget, setBudget] = useState(Number(localStorage.getItem('userBudget')) || 5000);
  const [balances, setBalances] = useState({ Cash: 0, bKash: 0, Bank: 0 });
  const [activeEvent, setActiveEvent] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data) => {
      const sorted = [...data].sort((a, b) => b.date.seconds - a.date.seconds);
      setTransactions(sorted);

      let cash = 0, bkash = 0, bank = 0;
      data.forEach(t => {
        const amt = Number(t.amount);
        const fee = Number(t.fee || 0);
        const wFrom = t.walletId;
        const wTo = t.toWalletId;
        if (t.type === 'income') {
          if (wFrom === 'Cash') cash += amt; if (wFrom === 'bKash') bkash += amt; if (wFrom === 'Bank') bank += amt;
        } else if (t.type === 'expense') {
          if (wFrom === 'Cash') cash -= amt; if (wFrom === 'bKash') bkash -= amt; if (wFrom === 'Bank') bank -= amt;
        } else if (t.type === 'transfer') {
          if (wFrom === 'Cash') cash -= (amt + fee); if (wFrom === 'bKash') bkash -= (amt + fee); if (wFrom === 'Bank') bank -= (amt + fee);
          if (wTo === 'Cash') cash += amt; if (wTo === 'bKash') bkash += amt; if (wTo === 'Bank') bank += amt;
        }
      });
      setBalances({ Cash: cash, bKash: bkash, Bank: bank });
    });
    return () => unsubscribe();
  }, [user.uid]);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyNormalExpenses = transactions.filter(t => t.type === 'expense' && !t.eventId && t.date.toDate() >= firstDayOfMonth).reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = Math.max(0, budget - monthlyNormalExpenses);
  const budgetPercent = (remainingBudget / budget) * 100;
  const totalAssets = balances.Cash + balances.bKash + balances.Bank;

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden selection:bg-white/20">
      
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3" onClick={() => setIsBudgetOpen(true)}>
          <div className="w-12 h-12 rounded-2xl bg-white border border-white/10 flex items-center justify-center font-black text-black text-sm shadow-2xl shadow-white/10">{user.displayName?.[0]}</div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[3px]">Capital Base</p>
            <h1 className="text-xl font-black text-white tracking-tighter">{totalAssets.toLocaleString()} ৳</h1>
          </div>
        </div>
        <button onClick={() => setIsEventHubOpen(true)} className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${activeEvent ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
          {activeEvent ? 'Event: Active' : 'Normal Universe'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        <LiquidBalance percentage={budgetPercent} amount={remainingBudget.toLocaleString()} label={activeEvent ? "Main Budget Locked" : "Current Budget"} />
        
        {/* সাপ্তাহিক রিপোর্ট কার্ড */}
        <WeeklyReport transactions={transactions} />

        <div className="mb-14 text-center">
          <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-8">Asset Portfolio</h3>
          <SwipableCards walletBalances={balances} />
        </div>

        <div className="mt-8 pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/20 mb-8 px-2 text-center">Live Feed</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-[35px] flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">{t.type === 'income' ? '💰' : (t.category?.split(' ')[0] || '💸')}</div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{t.type === 'income' ? 'Cash In' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</h4>
                    <p className="text-[9px] text-white/50 font-bold tracking-tight line-clamp-1">{t.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`} ৳</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ফ্লোটিং ডক */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-[#0f0f0f]/95 backdrop-blur-3xl p-3 rounded-[40px] flex items-center justify-between border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3 text-[10px] font-black text-white/40 hover:text-white uppercase text-center active:scale-90 transition-all">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-white text-black rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl transition-all">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3 text-[10px] font-black text-white/40 hover:text-white uppercase text-center active:scale-90 transition-all">History</button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} activeEvent={activeEvent} />}
        {isMagicOpen && <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} activeEvent={activeEvent} />}
        {isBudgetOpen && <BudgetModal isOpen={isBudgetOpen} currentBudget={budget} onSave={(v:any)=>{setBudget(v); localStorage.setItem('userBudget',v.toString()); setIsBudgetOpen(false);}} onClose={() => setIsBudgetOpen(false)} />}
        {isEventHubOpen && <EventHub isOpen={isEventHubOpen} userId={user.uid} onClose={() => setIsEventHubOpen(false)} onEventSelect={(e:any)=>setActiveEvent(e)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;