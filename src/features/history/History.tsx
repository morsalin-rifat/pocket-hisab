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
  
  const handleDelete = async (id: string) => {
    if (window.confirm("মুছে ফেলতে চান? এটি বাজেট ও ব্যালেন্স অটো-অ্যাডজাস্ট করবে।")) {
      await transactionService.deleteTransaction(id);
    }
  };
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      <div className="px-8 pt-12 pb-6 flex items-center justify-between z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">←</button>
        <h2 className="text-[10px] font-black uppercase tracking-[4px] text-white/80">Transaction Vault</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10">
        <div className="space-y-4 pt-6">
          <AnimatePresence>
            {transactions.map((t, index) => (
              <motion.div 
                key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-white/[0.03] border border-white/5 rounded-[35px] flex justify-between items-center group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-xl">{t.type === 'income' ? '💰' : (t.category?.split(' ')[0] || '💸')}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90">{t.type === 'income' ? 'Cash In' : (t.category?.split(' ').slice(1).join(' ') || t.category)}</h4>
                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">{t.date?.toDate().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-red-500/80'}`}>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`} ৳</p>
                    <button onClick={() => handleDelete(t.id)} className="text-[8px] font-bold text-red-500 uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Delete Record</button>
                  </div>
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