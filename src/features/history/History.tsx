import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../transactions/transactionService';

const History = ({ user }: { user: any }) => {
  const [transactions, setTransactions] = useState < any[] > ([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data) => {
      const sorted = [...data].sort((a, b) => b.date.seconds - a.date.seconds);
      setTransactions(sorted);
    });
    return () => unsubscribe();
  }, [user.uid]);
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      <div className="px-8 pt-12 pb-6 flex items-center justify-between z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:text-cyan-400 transition-all">←</button>
        <h2 className="text-[10px] font-black uppercase tracking-[4px] text-white/80 italic flex-1 text-center">Data Repository</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10">
        <div className="space-y-4 pt-6">
          <AnimatePresence>
            {transactions.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="p-6 bg-white/[0.02] border border-white/5 rounded-[35px] flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">{t.type === 'income' ? '💰' : (t.type === 'transfer' ? '🔄' : (t.category?.split(' ')[0] || '💸'))}</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white/90 uppercase">{t.type === 'income' ? 'Income' : (t.type === 'transfer' ? 'Transfer' : (t.category?.split(' ').slice(1).join(' ') || t.category))}</h4>
                    <p className="text-[9px] text-white/30 italic line-clamp-1">{t.note}</p>
                    <div className="flex gap-2 mt-1 uppercase font-black text-[7px] text-cyan-500">
                      <span>{t.walletId} {t.toWalletId && `→ ${t.toWalletId}`}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-400' : (t.type === 'transfer' ? 'text-blue-400' : 'text-red-500/80')}`}>
                    {t.type === 'income' ? `+${t.amount}` : (t.type === 'transfer' ? 'OK' : `-${t.amount}`)} ৳
                  </p>
                  <button onClick={() => transactionService.deleteTransaction(t.id)} className="text-[7px] font-bold text-red-500/30 hover:text-red-500 uppercase mt-2">Delete</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default History;