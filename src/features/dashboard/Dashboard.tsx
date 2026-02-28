import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';
import { ManualEntry } from '../transactions/ManualEntry'; // ইম্পোর্ট করুন

const Dashboard = ({ user }: { user: any }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* ১. হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-bold">
            {user?.displayName?.[0] || 'U'}
          </div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">System Ready</p>
            <h1 className="text-lg font-bold tracking-tight italic">Hi, {user?.displayName?.split('_')[1] || 'User'}</h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 pt-4">
        <LiquidBalance percentage={75} amount="12,500.00" />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 text-center flex-1 ml-10">Asset Stacks</h3>
            <span className="text-[9px] font-bold text-cyan-500 animate-pulse uppercase">Switch</span>
          </div>
          <SwipableCards />
        </div>

        <div className="mt-10">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6 px-2 text-center underline decoration-cyan-500/20 underline-offset-8">Activity Feed</h3>
          <div className="py-12 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-white/10">
            No history recorded.
          </div>
        </div>
      </div>

      {/* ২. ফ্লোটিং ডক (পজিশন এবং নাম আপডেট) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[88%] z-40">
        <div className="bg-white/5 backdrop-blur-3xl p-2 rounded-[35px] flex items-center justify-between border border-white/10 shadow-2xl">
          {/* Manual Button */}
          <button 
            onClick={() => setIsManualOpen(true)}
            className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400"
          >
            Manual
          </button>
          
          {/* AI Center Button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-cyan-500/20 -mt-10 border-[5px] border-black text-2xl"
          >
            ✨
          </motion.button>

          {/* History Button */}
          <button className="flex-1 py-3 text-[9px] font-black tracking-[2px] text-white/40 uppercase text-center active:text-cyan-400">
            History
          </button>
        </div>
      </div>

      {/* ৩. ম্যানুয়াল এন্ট্রি পপ-আপ (Fade-In) */}
      <AnimatePresence>
        {isManualOpen && (
          <ManualEntry isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;