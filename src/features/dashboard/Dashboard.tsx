import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import WalletCard from './components/WalletCard';

const Dashboard = ({ user }: { user: any }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="relative min-h-full w-full bg-[#020617] text-white flex flex-col p-6 overflow-hidden">
      
      {/* ১. ব্যাকগ্রাউন্ড কসমিক ডাস্ট (Background Interactivity) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0], 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{ top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}
          />
        ))}
      </div>

      {/* ২. প্রিমিয়াম হেডার */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 flex items-center justify-between mb-8 mt-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[3px]">{greeting}</h2>
          </div>
          <h1 className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-500">
            {user?.displayName || "Commander"}
          </h1>
        </div>
        <motion.button 
          whileHover={{ rotate: 90, scale: 1.1 }}
          onClick={() => authService.logout()}
          className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-2xl backdrop-blur-xl"
        >
          ⚙️
        </motion.button>
      </motion.div>

      {/* ৩. হলোগ্রাফিক মেইন ব্যালেন্স কার্ড (The Josh Card) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
        className="relative w-full p-8 bg-gradient-to-br from-blue-600/30 via-indigo-900/40 to-slate-900/60 border border-white/10 rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-10 glass-card"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px] mb-3">Net Worth Portfolio</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-5xl font-black tracking-tighter italic drop-shadow-2xl">
            00.00
          </h2>
          <span className="text-xl font-bold text-blue-400/80 italic">BDT</span>
        </div>
        {/* রিয়েল টাইম পালস */}
        <div className="mt-6 flex items-center gap-2">
           <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" 
              />
           </div>
           <span className="text-[9px] font-bold text-slate-500">SYSTEM ACTIVE</span>
        </div>
      </motion.div>

      {/* ৪. ডায়নামিক ওয়ালেট হাব */}
      <div className="mb-10 relative z-10">
        <div className="flex justify-between items-center mb-5 px-2">
          <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Wealth Vaults</h3>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="text-[10px] font-black bg-blue-600/20 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest"
          >
            + New
          </motion.button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           <WalletCard name="Physical Cash" balance={0} icon="💵" color="#3b82f6" />
           <WalletCard name="bKash Money" balance={0} icon="📱" color="#e11d48" />
           <WalletCard name="Bank Vault" balance={0} icon="🏦" color="#10b981" />
        </div>
      </div>

      {/* ৫. আল্ট্রা-মডার্ন অ্যাকশন বাটনস (Multi-Hover & Glow) */}
      <div className="grid grid-cols-2 gap-5 mt-auto pb-8 relative z-10">
         <motion.button 
           whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
           whileTap={{ scale: 0.95 }}
           className="group py-5 bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 transition-all"
         >
           <span className="text-2xl group-hover:scale-125 transition-transform duration-300">📝</span>
           <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 group-hover:text-white">Manual</span>
         </motion.button>

         <motion.button 
           whileHover={{ y: -5, boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}
           whileTap={{ scale: 0.95 }}
           className="group py-5 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-[28px] flex flex-col items-center justify-center gap-2 relative overflow-hidden shadow-xl"
         >
           <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">✨</span>
           <span className="text-[10px] font-black uppercase tracking-[2px]">AI Entry</span>
           {/* ইন্টারনাল গ্লো */}
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         </motion.button>
      </div>

    </div>
  );
};

export default Dashboard;