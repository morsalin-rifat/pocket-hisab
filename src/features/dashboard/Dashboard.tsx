import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { BudgetModal } from './components/BudgetModal';
import { CategoryChart } from './components/CategoryChart';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budget, setBudget] = useState(Number(localStorage.getItem('userBudget')) || 5000);
  const [balances, setBalances] = useState({ Cash: 0, bKash: 0, Bank: 0 });

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data) => {
      const sorted = [...data].sort((a, b) => b.date.seconds - a.date.seconds);
      setTransactions(sorted);

      let cash = 0, bkash = 0, bank = 0;
      data.forEach(t => {
        const amt = Number(t.amount);
        const fee = Number(t.fee || 0);
        const w = t.walletId || "Cash";

        if (t.type === 'income') {
          if (w === 'Cash') cash += amt; if (w === 'bKash') bkash += amt; if (w === 'Bank') bank += amt;
        } else if (t.type === 'expense') {
          if (w === 'Cash') cash -= amt; if (w === 'bKash') bkash -= amt; if (w === 'Bank') bank -= amt;
        } else if (t.type === 'transfer') {
          bkash -= (amt + fee); cash += amt;
        }
      });
      setBalances({ Cash: cash, bKash: bkash, Bank: bank });
    });
    return () => unsubscribe();
  }, [user.uid]);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.toDate() >= firstDayOfMonth).reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = Math.max(0, budget - monthlyExpenses);
  const budgetPercent = (remainingBudget / budget) * 100;
  const totalAssets = balances.Cash + balances.bKash + balances.Bank;

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3" onClick={() => setIsBudgetOpen(true)}>
          <motion.div whileHover={{ rotate: 10 }} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm shadow-xl overflow-hidden">
             {user.photoURL ? <img src={user.photoURL} alt="P" className="w-full h-full object-cover" /> : user.displayName?.[0]}
          </motion.div>
          <div><p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">Net Worth</p>
          <h1 className="text-lg font-bold tracking-tight text-emerald-400">{totalAssets.toLocaleString()} ৳</h1></div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40 transition-all">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        <LiquidBalance percentage={budgetPercent} amount={remainingBudget.toLocaleString()} label="Monthly Limit" />
        <div className="mb-14 text-center">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 mb-8">Asset Portfolios</h3>
          <SwipableCards walletBalances={balances} />
        </div>
        <CategoryChart transactions={transactions} />
        
        <div className="mt-8 pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-8 px-2 text-center underline decoration-white/5 underline-offset-8">Live Feed</h3>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[32px] flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">{t.type === 'income' ? '💰' : (t.category?.split(' ')[0] || '💸')}</div>
                  <div>
                    <p className="text-xs font-black text-white/80">{t.type === 'income' ? 'Cash In' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-[1px] line-clamp-1">{t.note || 'Synced'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-red-500/80'}`}>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`} ৳</p>
                  <p className="text-[7px] text-white/10 uppercase font-bold">{t.walletId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-zinc-900/80 backdrop-blur-3xl p-2.5 rounded-[40px] flex items-center justify-between border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:scale-90 transition-all">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl transition-all relative overflow-hidden group">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3.5 text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center active:scale-90 transition-all">History</button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />}
        {isMagicOpen && <MagicInput isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} />}
        {isBudgetOpen && <BudgetModal isOpen={isBudgetOpen} currentBudget={budget} onSave={(v:any)=>{setBudget(v); localStorage.setItem('userBudget',v.toString()); setIsBudgetOpen(false);}} onClose={() => setIsBudgetOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;