import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { WalletCard } from './components/WalletCard';
import { LiquidCard } from './components/LiquidCard';

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div className="relative h-full w-full bg-black flex flex-col p-6 overflow-hidden">
      
      {/* ১. এলিট হেডার */}
      <div className="flex items-center justify-between mt-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg border border-white/10">
            <span className="font-black text-white">{user?.displayName?.[0] || 'C'}</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none mb-1">
              {user?.displayName?.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Session</p>
            </div>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all btn-glow">
          ✕
        </button>
      </div>

      {/* ২. লিকুইড ভিজ্যুয়ালাইজার (বাজেট ৮০% ধরলাম টেস্টের জন্য) */}
      <div className="mb-10">
        <LiquidCard balance={15450} percent={80} />
      </div>

      {/* ৩. অ্যাসেটস (ওয়ালেট) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[3px] text-gray-500">Wealth Vaults</h3>
          <button className="text-[10px] text-blue-500 font-bold hover:underline tracking-tighter">+ MANAGE</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           <WalletCard name="Cash" balance={5000} icon="💵" color="#3b82f6" />
           <WalletCard name="bKash" balance={2450} icon="📱" color="#e11d48" />
           <WalletCard name="Bank" balance={8000} icon="🏦" color="#10b981" />
        </div>
      </div>

      {/* ৪. ফ্লোটিং অ্যাকশন হাব (Josh Buttons) */}
      <div className="mt-auto pb-4 flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[28px] text-[10px] font-black uppercase tracking-[2.5px] text-gray-400 hover:text-white hover:bg-white/10 transition-all btn-glow"
        >
          📝 Manual
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-5 bg-blue-600 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[2.5px] shadow-2xl relative overflow-hidden group"
        >
          <span className="relative z-10 font-black">✨ AI Entry</span>
          {/* গ্লস স্লাইডিং এনিমেশন */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
      </div>

    </div>
  );
};

export default Dashboard;