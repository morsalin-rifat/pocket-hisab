import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { Sidebar } from '../../components/Sidebar';
import { ManualEntry } from '../transactions/ManualEntry';
import { MagicInput } from '../transactions/MagicInput';
import { BudgetModal } from './components/BudgetModal';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      let c = 0, bk = 0, bnk = 0;
      data.forEach(t => {
        const a = Number(t.amount);
        if (t.type === 'income') {
           if (t.walletId === 'Cash') c += a; if (t.walletId === 'bKash') bk += a; if (t.walletId === 'Bank') bnk += a;
        } else if (t.type === 'expense') {
           if (t.walletId === 'Cash') c -= a; if (t.walletId === 'bKash') bk -= a; if (t.walletId === 'Bank') bnk -= a;
        } else if (t.type === 'transfer') {
           if (t.walletId === 'bKash') bk -= (a + (a * 0.0185)); if (t.toWalletId === 'Cash') c += a;
        }
      });
      setBalances({ Cash: c, bKash: bk, Bank: bnk });
    });
    return () => unsubscribe();
  }, [user.uid]);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.toDate() >= firstDay).reduce((s, t) => s + t.amount, 0);
  
  const remainingBudget = Math.max(0, budget - monthlyExpenses);
  const totalAssets = balances.Cash + balances.bKash + balances.Bank;

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
      
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-all">
          <div className="w-5 h-0.5 bg-white" /><div className="w-3 h-0.5 bg-white/50 self-start ml-3.5" /><div className="w-5 h-0.5 bg-white" />
        </button>
        <div className="text-center" onClick={() => setIsBudgetOpen(true)}>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">Total Balance</p>
          <h1 className="text-xl font-black text-emerald-400">{totalAssets.toLocaleString()} ৳</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white border border-white/20 flex items-center justify-center font-black text-black text-sm">{user.displayName?.[0]}</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        <LiquidBalance percentage={(remainingBudget / budget) * 100} amount={remainingBudget.toLocaleString()} label="Monthly Limit" />
        
        <div className="mb-14 text-center">
          <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-8">Asset Portfolios</h3>
          <SwipableCards walletBalances={balances} />
        </div>

        <div className="mt-8 pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[5px] text-white/20 mb-8 px-2 text-center underline decoration-cyan-500/20 underline-offset-8">Activity Flow</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-[35px] flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">{t.type === 'income' ? '💎' : (t.category?.split(' ')[0] || '💸')}</div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase">{t.type === 'income' ? 'Income' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</h4>
                    <p className="text-[8px] text-white/40 font-bold line-clamp-1">{t.note}</p>
                  </div>
                </div>
                <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`} ৳</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-[#0a0a0a]/95 backdrop-blur-3xl p-3 rounded-[40px] flex items-center justify-between border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,1)]">
          <button onClick={() => setIsManualOpen(true)} className="flex-1 py-3 text-[10px] font-black text-white/40 uppercase text-center active:scale-90 transition-all">Manual</button>
          <motion.button onClick={() => setIsMagicOpen(true)} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-white text-black rounded-[28px] flex items-center justify-center -mt-14 border-[6px] border-black text-3xl shadow-2xl transition-all">✨</motion.button>
          <button onClick={() => navigate('/history')} className="flex-1 py-3 text-[10px] font-black text-white/40 uppercase text-center active:scale-90 transition-all">History</button>
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