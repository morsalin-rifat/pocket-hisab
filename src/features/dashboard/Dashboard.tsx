import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { WalletCard } from './components/WalletCard';
import { LiquidBalance } from './components/LiquidBalance';

const Dashboard = ({ user }: { user: any }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  
  return (
    <div className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      
      {/* ১. এলিট হেডার */}
      <div className="p-6 pt-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-sm shadow-2xl">
            {user?.displayName?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white/90">{greeting}, {user?.displayName?.split(' ')[0]}! 👋</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Ready for your financial audit?</p>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full premium-glass flex items-center justify-center opacity-60">
           ✕
        </button>
      </div>

      {/* ২. মেইন ফিড (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        
        {/* লিকুইড ভিজ্যুয়ালাইজার বক্স */}
        <div className="mt-4 mb-10">
          <LiquidBalance percentage={75} amount="0.00" />
        </div>

        {/* এসেটস / ওয়ালেটস গ্রিড */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">Wealth Vaults</h3>
            <button className="text-[10px] font-bold text-blue-500">+ ADD CARD</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            <WalletCard name="Physical Cash" balance={0} icon="💳" color="#3b82f6" />
            <WalletCard name="MFS Wallet" balance={0} icon="📱" color="#ec4899" />
            <WalletCard name="Vault" balance={0} icon="🏛️" color="#10b981" />
          </div>
        </div>

        {/* রিসেন্ট অ্যাক্টিভিটি টাইটেল */}
        <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500 mb-6 px-1 text-center">Recent System Activity</h3>
        <div className="text-center py-12 opacity-20 italic text-sm">No transactions to analyze yet...</div>
      </div>

      {/* ৩. ফ্লোটিং গ্লাস ডক (The Elite Dock) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <div className="premium-glass p-3 rounded-[35px] flex items-center justify-between shadow-2xl">
          <button className="flex-1 flex flex-col items-center py-2 group">
             <span className="text-xl opacity-40 group-hover:opacity-100 transition-all">📝</span>
             <span className="text-[8px] font-bold uppercase tracking-[2px] text-gray-500 mt-1">Manual</span>
          </button>
          
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.4)] -mt-12 border-[6px] border-black transition-transform active:scale-90">
             <span className="text-2xl">🏠</span>
          </div>

          <button className="flex-1 flex flex-col items-center py-2 group">
             <span className="text-xl opacity-40 group-hover:opacity-100 transition-all">✨</span>
             <span className="text-[8px] font-bold uppercase tracking-[2px] text-gray-500 mt-1">AI Entry</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;