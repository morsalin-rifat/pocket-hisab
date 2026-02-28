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
  
  // বাজেট লজিক: লোকাল স্টোরেজ থেকে নেওয়া
  const [budget, setBudget] = useState(Number(localStorage.getItem('userBudget')) || 25000);

  // ওয়ালেট ব্যালেন্স স্টেট
  const [balances, setBalances] = useState({ Cash: 5000, bKash: 10000, Bank: 50000 });

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data) => {
      const sorted = [...data].sort((a, b) => b.date.seconds - a.date.seconds);
      setTransactions(sorted);

      // স্মার্ট ওয়ালেট ক্যালকুলেশন
      let cash = 5000, bkash = 10000, bank = 50000; // স্টার্টিং ব্যালেন্স (পরবর্তীতে এটিও ডাইনামিক করা যাবে)
      
      data.forEach(t => {
        const amt = Number(t.amount);
        const fee = Number(t.fee || 0);

        if (t.type === 'expense') {
          if (t.walletId === 'Cash') cash -= amt;
          if (t.walletId === 'bKash') bkash -= amt;
          if (t.walletId === 'Bank') bank -= amt;
        } else if (t.type === 'transfer') {
          // স্পেশাল লজিক: bKash থেকে Cash এ ট্রান্সফার
          bkash -= (amt + fee);
          cash += amt;
        }
      });
      setBalances({ Cash: cash, bKash: bkash, Bank: bank });
    });
    return () => unsubscribe();
  }, [user.uid]);

  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, i) => s + i.amount, 0);
  const remainingPercent = Math.max(0, ((budget - totalExpense) / budget) * 100);

  const updateBudget = (newVal: number) => {
    setBudget(newVal);
    localStorage.setItem('userBudget', newVal.toString());
    setIsBudgetOpen(false);
  };

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3" onClick={() => setIsBudgetOpen(true)}>
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm shadow-xl">
             {user.displayName?.[0]}
          </div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">System Master</p>
            <h1 className="text-lg font-bold tracking-tight italic">Hi, {user.displayName?.split('_')[1] || user.displayName?.split(' ')[0]} ⚙️</h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        <LiquidBalance percentage={remainingPercent} amount={(budget - totalExpense).toLocaleString()} />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 flex-1 ml-10">Live Assets</h3>
            <span className="text-[8px] font-bold text-cyan-500 animate-pulse uppercase">Swipe</span>
          </div>
          <SwipableCards walletBalances={balances} />
        </div>

        <div className="mt-8">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-8 px-2 text-center underline decoration-cyan-500/20 underline-offset-8">Activity Feed</h3>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((t) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={t.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[32px] flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/5">{t.type === 'transfer' ? '🔄' : (t.category?.split(' ')[0] || '💰')}</div>
                  <div>
                    <p className="text-xs font-black text-white/80">{t.type === 'transfer' ? 'Transfer' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-[1px]">{t.note || 'Regular Entry'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'transfer' ? 'text-blue-400' : 'text-red-500/80'}`}>{t.type === 'transfer' ? 'Synced' : `-${t.amount} ৳`}</p>
                  <p className="text-[8px] text-white/10 mt-1 uppercase">{t.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-zinc-900/80 backdrop-blur-3xl p-2.5 rounded-[40px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 rounded-[28px] flex items-center justify-center shadow-lg -mt-14 border-[5px] border-black text-3xl shadow-2xl transition-all">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">History</button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />}
        {isMagicOpen && <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} />}
        {isBudgetOpen && <BudgetModal isOpen={isBudgetOpen} currentBudget={budget} onSave={updateBudget} onClose={() => setIsBudgetOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;