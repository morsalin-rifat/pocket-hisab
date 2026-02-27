import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { WalletCard } from './components/WalletCard';

const Dashboard = ({ user }: { user: any }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="relative min-h-full w-full bg-black flex flex-col p-6 overflow-hidden">
      
      {/* ১. টপ প্রিমিয়াম বার */}
      <div className="flex items-center justify-between mb-10 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-sm font-bold shadow-2xl">
            {user?.displayName?.[0] || 'C'}
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[2px]">{greeting}</p>
            <h1 className="text-lg font-semibold tracking-tight">{user?.displayName?.split(' ')[0]}</h1>
          </div>
        </div>
        <button 
          onClick={() => authService.logout()}
          className="w-10 h-10 rounded-full premium-glass flex items-center justify-center text-sm active:scale-90 transition-all"
        >
          <span className="opacity-60">✕</span>
        </button>
      </div>

      {/* ২. মেইন ব্যালেন্স - হাই কন্ট্রাস্ট ডিজাইন */}
      <div className="mb-12">
        <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mb-4">Available Capital</p>
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-5xl font-light tracking-tighter">0.00</span>
          <span className="text-sm font-bold text-blue-500 tracking-widest">BDT</span>
        </div>
        <div className="flex justify-center mt-6">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        </div>
      </div>

      {/* ৩. ওয়ালেটস গ্রিড */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">Assets</h3>
          <button className="text-[9px] font-bold text-gray-400 hover:text-white transition-colors">EDIT CARDS</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           <WalletCard name="Liquid Cash" balance={0} icon="💳" color="#3b82f6" />
           <WalletCard name="MFS Wallet" balance={0} icon="📱" color="#ec4899" />
           <WalletCard name="Vault" balance={0} icon="🏛️" color="#10b981" />
        </div>
      </div>

      {/* ৪. কুইক একশনস (Minimalist Floating Dock) */}
      <div className="mt-auto grid grid-cols-2 gap-4 pb-4">
         <motion.button 
           whileTap={{ scale: 0.98 }}
           className="h-[70px] premium-glass rounded-[24px] flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-all group"
         >
           <span className="text-xs font-bold tracking-[2px] uppercase opacity-40 group-hover:opacity-100">Manual</span>
         </motion.button>

         <motion.button 
           whileTap={{ scale: 0.98 }}
           className="h-[70px] bg-blue-600 rounded-[24px] flex flex-col items-center justify-center gap-1 shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:shadow-none transition-all group"
         >
           <span className="text-xs font-bold tracking-[2px] uppercase">AI Entry</span>
         </motion.button>
      </div>

    </div>
  );
};

export default Dashboard;