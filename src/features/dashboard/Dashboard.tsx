import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidBalance } from './components/LiquidBalance';
import { SwipableCards } from './components/SwipableCards';

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* হেডার */}
      <div className="px-8 pt-12 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold shadow-xl">
            {user?.displayName?.[0] || 'U'}
          </div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[3px]">Welcome back</p>
            <h1 className="text-lg font-bold tracking-tight italic">{user?.displayName?.split('_')[1] || 'Commander'}</h1>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-40 hover:opacity-100 transition-all">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 pt-4">
        <LiquidBalance percentage={75} amount="12,500.00" />

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 text-center flex-1 ml-10">Wallet Portfolio</h3>
            <span className="text-[9px] font-bold text-cyan-500 animate-pulse">SWIPE</span>
          </div>
          <SwipableCards />
        </div>

        <div className="mt-10">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6 px-2 text-center">Recent Activity</h3>
          <div className="py-12 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-white/20">
            Scanning for records...
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-40">
        <div className="bg-white/5 backdrop-blur-3xl p-2 rounded-[35px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button className="flex-1 py-3 text-[9px] font-black tracking-widest text-white/30 uppercase text-center">Scribe</button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-cyan-500/20 -mt-10 border-[5px] border-black text-2xl"
          >
            ✨
          </motion.button>

          <button className="flex-1 py-3 text-[9px] font-black tracking-widest text-white/30 uppercase text-center">Nexus</button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;