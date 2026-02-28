import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { WalletCard } from './components/WalletCard';
import { ManualEntry } from '../transactions/ManualEntry';
import { transactionService } from '../transactions/transactionService';

const Dashboard = ({ user }: { user: any }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  
  const budget = 30000; // আপনি চাইলে পরে এটি ডাটাবেস থেকে নিতে পারবেন

  useEffect(() => {
    const unsubTrans = transactionService.subscribeTransactions(user.uid, (data: any[]) => {
      setTransactions(data);
      setTotalExpense(data.reduce((sum, item) => sum + item.amount, 0));
    });
    
    const unsubWallets = transactionService.subscribeWallets(user.uid, (data: any[]) => {
      setWallets(data);
    });

    return () => { unsubTrans(); unsubWallets(); };
  }, [user.uid]);

  const remainingPercent = Math.max(0, ((budget - totalExpense) / budget) * 100);
  const remainingAmount = (budget - totalExpense).toLocaleString();

  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      {/* ১. হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold shadow-xl overflow-hidden">
             {user.photoURL ? <img src={user.photoURL} alt="P" /> : user.displayName?.[0]}
          </div>
          <div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[3px]">Financial Pulse</p>
            <h1 className="text-lg font-bold tracking-tight italic text-white/90">Hi, {user.displayName?.split(' ')[0]}</h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40 hover:opacity-100 hover:bg-red-500/10 transition-all">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        {/* ২. লিকুইড ভিজ্যুয়ালাইজার */}
        <LiquidBalance percentage={remainingPercent} amount={remainingAmount} />

        {/* ৩. ওয়ালেট সেকশন (ডাইনামিক) */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30">Asset Vaults</h3>
            <button 
              onClick={async () => {
                // স্যাম্পল ওয়ালেট অ্যাড করার টেস্ট (পরে আমরা এটার জন্য ফর্ম বানাবো)
                await transactionService.addWallet(user.uid, { name: 'Cash', balance: 5000, icon: '💵', color: '#10b981' });
              }}
              className="text-[9px] font-bold text-cyan-500 hover:text-cyan-400"
            >
              + QUICK ADD
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
             {wallets.length === 0 ? (
               <div className="text-[10px] text-white/10 italic">No wallets added. Tap + to start.</div>
             ) : (
               wallets.map(w => <WalletCard key={w.id} name={w.name} balance={w.balance} icon={w.icon} color={w.color} />)
             )}
          </div>
        </div>

        {/* ৪. রিসেন্ট ট্রানজেকশন */}
        <div className="mt-4">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6 px-2 text-center underline decoration-white/5 underline-offset-8">Activity Feed</h3>
          <div className="space-y-4">
            {transactions.map((t) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={t.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[30px] flex justify-between items-center hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center gap-4">
                  <span className="text-xl group-hover:scale-125 transition-transform">{t.category.split(' ')[0]}</span>
                  <div>
                    <p className="text-xs font-bold text-white/80">{t.category.split(' ')[1]}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest">{t.note || 'No Note'}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-red-500/80">-{t.amount} ৳</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ৫. ফ্লোটিং ডক (পজিশন ফিক্সড ও গ্রেডিয়েন্ট হোভার) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[88%] z-40">
        <div className="bg-zinc-900/80 backdrop-blur-3xl p-2 rounded-[35px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button 
            onClick={() => setIsManualOpen(true)}
            className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            Manual
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 25px rgba(6, 182, 212, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[22px] flex items-center justify-center -mt-12 border-[5px] border-black text-2xl shadow-xl transition-all"
          >
            ✨
          </motion.button>

          <button className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center hover:text-white hover:bg-white/5 rounded-2xl transition-all">
            History
          </button>
        </div>
      </div>

      <AnimatePresence>{isManualOpen && <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />}</AnimatePresence>
    </div>
  );
};

export default Dashboard;