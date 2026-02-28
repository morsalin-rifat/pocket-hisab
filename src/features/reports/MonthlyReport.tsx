import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../transactions/transactionService';

const MonthlyReport = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState < any > ({ totalSpent: 0, breakdown: {}, grade: 'N/A' });
  const budget = Number(localStorage.getItem('userBudget')) || 5000;
  
  useEffect(() => {
    const unsub = transactionService.subscribeTransactions(user.uid, (data) => {
      const now = new Date();
      const thisMonth = data.filter(t => t.type === 'expense' && t.date.toDate().getMonth() === now.getMonth());
      const total = thisMonth.reduce((s, i) => s + i.amount, 0);
      
      const cats = thisMonth.reduce((acc: any, t: any) => {
        const n = t.category.split(' ')[1] || t.category;
        acc[n] = (acc[n] || 0) + t.amount;
        return acc;
      }, {});
      
      // গ্রেডিং লজিক
      let g = 'F';
      const ratio = total / budget;
      if (ratio < 0.8) g = 'A+';
      else if (ratio <= 1.0) g = 'B';
      
      setStats({ totalSpent: total, breakdown: cats, grade: g });
    });
    return () => unsub();
  }, [user.uid, budget]);
  
  return (
    <div className="h-screen bg-black p-8 text-white flex flex-col overflow-y-auto no-scrollbar">
       <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 text-xl">←</button>
       
       <h2 className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-2">Monthly Command</h2>
       <h1 className="text-3xl font-black italic mb-10">Economic Status</h1>

       {/* গ্রেড কার্ড */}
       <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
         className="w-full bg-white/[0.03] border border-white/10 rounded-[50px] p-10 text-center mb-10 shadow-[0_20px_50px_rgba(0,0,0,1)] relative overflow-hidden"
       >
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
         <p className="text-[9px] font-black text-white/40 uppercase tracking-[4px] mb-4">Performance Grade</p>
         <div className="text-8xl font-black italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 mb-4">{stats.grade}</div>
         <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[2px]">
           {stats.grade === 'A+' ? 'Financial Mastermind' : stats.grade === 'B' ? 'Safe Zone Player' : 'Budget Destroyer! 👀'}
         </p>
       </motion.div>

       {/* ক্যাটাগরি ব্রেকডাউন */}
       <div className="space-y-8 mb-20">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 px-2">Spending Sectors</h3>
          {Object.entries(stats.breakdown).map(([name, amt]: any) => (
            <div key={name} className="space-y-3">
              <div className="flex justify-between items-center text-white font-black uppercase text-[10px] tracking-widest px-1">
                <span>{name}</span>
                <span>{amt.toLocaleString()} ৳</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(amt/stats.totalSpent)*100}%` }}
                  className="h-full bg-white rounded-full" />
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};
export default MonthlyReport;