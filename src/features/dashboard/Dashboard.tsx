import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { BudgetModal } from './components/BudgetModal';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budget, setBudget] = useState(Number(localStorage.getItem('userBudget')) || 5000);
  const [balances, setBalances] = useState({ Cash: 0, bKash: 0, Bank: 0 });
  
  // ইভেন্ট মোড স্টেট
  const [activeEvent, setActiveEvent] = useState<any>(null); // আপাতত ম্যানুয়াল, পরে DB থেকে আসবে

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
  
  // বাজেট ক্যালকুলেশন: ইভেন্ট বাদে সাধারণ খরচ
  const monthlyNormalExpenses = transactions
    .filter(t => t.type === 'expense' && !t.eventId && t.date.toDate() >= firstDayOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = Math.max(0, budget - monthlyNormalExpenses);
  const budgetPercent = (remainingBudget / budget) * 100;
  const totalAssets = balances.Cash + balances.bKash + balances.Bank;

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* ১. ব্রাইট হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3" onClick={() => setIsBudgetOpen(true)}>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             {user.displayName?.[0]}
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[3px]">Net Capital</p>
            <h1 className="text-xl font-black tracking-tighter text-white">{totalAssets.toLocaleString()} ৳</h1>
          </div>
        </div>
        
        {/* ইভেন্ট মোড ইন্ডিকেটর */}
        <button 
          onClick={() => setActiveEvent(activeEvent ? null : { id: 'temp_trip', name: 'Trip Mode' })}
          className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${activeEvent ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeEvent ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
          <span className="text-[8px] font-black text-white uppercase tracking-widest">{activeEvent ? 'Event Active' : 'Normal'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        {/* লিকুইড ট্যাঙ্ক */}
        <LiquidBalance percentage={budgetPercent} amount={remainingBudget.toLocaleString()} label={activeEvent ? "Main Budget (Paused)" : "Spending Limit"} />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/50 flex-1 text-center ml-10">Wealth Vaults</h3>
            <span className="text-[9px] font-black text-cyan-400 animate-pulse">SWIPE</span>
          </div>
          <SwipableCards walletBalances={balances} />
        </div>

        {/* লাইভ ফিড */}
        <div className="mt-8 pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/30 mb-8 px-2 text-center">Data Stream</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className={`p-6 bg-white/[0.03] border rounded-[35px] flex justify-between items-center ${t.eventId ? 'border-blue-500/30' : 'border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">{t.type === 'income' ? '💰' : (t.type === 'transfer' ? '🔄' : (t.category?.split(' ')[0] || '💸'))}</div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{t.type === 'income' ? 'Received' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</h4>
                    <p className="text-[9px] text-white/40 font-bold tracking-tight line-clamp-1">{t.note}</p>
                    {t.eventId && <span className="text-[7px] font-black text-blue-400 uppercase">Trip Expense</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`} ৳</p>
                  <p className="text-[7px] text-white/20 uppercase font-black">{t.walletId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ফ্লোটিং ডক */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-zinc-900/90 backdrop-blur-3xl p-3 rounded-[40px] flex items-center justify-between border border-white/20 shadow-2xl">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3 text-[10px] font-black tracking-[3px] text-white uppercase text-center active:text-cyan-400">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3 text-[10px] font-black tracking-[3px] text-white uppercase text-center active:text-cyan-400">History</button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} activeEvent={activeEvent} />}
        {isMagicOpen && <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} activeEvent={activeEvent} />}
        {isBudgetOpen && <BudgetModal isOpen={isBudgetOpen} currentBudget={budget} onSave={(v:any)=>{setBudget(v); localStorage.setItem('userBudget',v.toString()); setIsBudgetOpen(false);}} onClose={() => setIsBudgetOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;