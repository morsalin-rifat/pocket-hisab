import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidTank } from './components/LiquidTank';
import { WalletDeck } from './components/WalletDeck';

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      
      {/* হেডার */}
      <div className="px-8 pt-14 pb-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-xs">
            {user?.displayName?.[0] || 'C'}
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">{user?.displayName?.split(' ')[0]}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[2px]">Core Online</p>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40 active:scale-90 transition-all">
          ✕
        </button>
      </div>

      {/* স্ক্রল এরিয়া */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32">
        <LiquidTank percentage={75} amount="12,500.00" />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500">Asset Stack</h3>
            <span className="text-[9px] text-cyan-500 font-bold tracking-widest">SWIPE TO ROTATE</span>
          </div>
          <WalletDeck />
        </div>

        <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-6">Recent Log</h3>
        <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-[45px] opacity-20 italic text-sm">
          Empty Sector
        </div>
      </div>

      {/* আল্ট্রা-স্লিক ডক */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] z-40">
        <div className="bg-white/5 backdrop-blur-3xl p-3 rounded-[35px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button className="flex-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">History</button>
          
          <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#06b6d4] -mt-12 border-[8px] border-black active:scale-90 transition-all">
             <span className="text-3xl">✨</span>
          </div>

          <button className="flex-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Manual</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;