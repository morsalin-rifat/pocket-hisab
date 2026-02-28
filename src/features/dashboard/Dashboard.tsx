import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* টপ বার - মিনিমালিস্ট */}
      <div className="px-8 pt-12 pb-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">
            {user?.displayName?.[0] || 'U'}
          </div>
          <h1 className="text-lg font-medium tracking-tight">Hi, {user?.displayName?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs opacity-50 hover:opacity-100 transition-all">
          ✕
        </button>
      </div>

      {/* স্ক্রল ফিড */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32">
        
        {/* লিকুইড ভিজ্যুয়ালাইজার (স্মুথ ফিজিক্স) */}
        <LiquidBalance percentage={70} amount="12,500.00" />

        {/* সোয়াইপ কার্ডস */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-white/30">My Assets</h3>
            <span className="text-[9px] text-cyan-400 font-bold">SWIPE CARDS</span>
          </div>
          <SwipableCards />
        </div>

        {/* রিসেন্ট লেনদেন টাইটেল */}
        <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Activity Timeline</h3>
        <div className="py-12 text-center rounded-[40px] border border-white/5 bg-white/[0.02] text-white/20 text-xs italic">
          No records found in this cycle.
        </div>
      </div>

      {/* ফ্লোটিং ডক (The Minimal Dock) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-40">
        <div className="glass-container p-2 rounded-full flex items-center justify-between shadow-2xl">
          <button className="flex-1 py-3 text-[10px] font-bold tracking-widest text-white/40">SCRIBE</button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/40 -mt-10 border-[6px] border-black text-2xl"
          >
            ✨
          </motion.button>

          <button className="flex-1 py-3 text-[10px] font-bold tracking-widest text-white/40">NEXUS</button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;