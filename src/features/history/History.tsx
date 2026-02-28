import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../transactions/transactionService';

const History = ({ user }: { user: any }) => {
  const [transactions, setTransactions] = useState < any[] > ([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = transactionService.subscribeTransactions(user.uid, (data: any[]) => {
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user.uid]);
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* ১. হেডার */}
      <div className="px-8 pt-12 pb-6 flex items-center justify-between z-30 bg-black/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
          ←
        </button>
        <h2 className="text-sm font-black uppercase tracking-[4px] text-white/80 italic">Transaction Vault</h2>
        <div className="w-10 h-10 opacity-0" /> {/* ব্যালেন্স করার জন্য */}
      </div>

      {/* ২. লিস্ট সেকশন */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10">
        <div className="space-y-6 pt-4">
          {transactions.length === 0 ? (
            <div className="py-20 text-center text-white/20 italic text-sm">No records found in this universe.</div>
          ) : (
            transactions.map((t, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={t.id} 
                className="group relative"
              >
                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[35px] flex justify-between items-center hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                      {t.category?.split(' ')[0] || '💰'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[2px] mb-1">
                        {t.category?.split(' ').slice(1).join(' ') || 'General'}
                      </p>
                      <h4 className="text-sm font-bold text-white/90 line-clamp-1">{t.note || 'Untitled Expense'}</h4>
                      <p className="text-[9px] text-white/20 uppercase font-bold mt-1 tracking-widest">
                        {t.date?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-red-500/80">-{t.amount} ৳</p>
                    <p className="text-[8px] text-white/10 font-bold uppercase mt-1">
                      {t.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ৩. বটম ডেকোরেশন */}
      <div className="h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default History;