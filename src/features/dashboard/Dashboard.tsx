import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';
import { LiquidVisualizer } from './components/LiquidVisualizer';
import { WalletStack } from './components/WalletStack';

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div className="relative h-full w-full bg-[#010409] flex flex-col overflow-hidden">
      
      {/* ১. প্রিমিয়াম হেডার */}
      <div className="px-8 pt-12 pb-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-xs">
            {user?.displayName?.[0] || 'C'}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">{user?.displayName?.split(' ')[0]}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[2px]">System Online</p>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all">
          ✕
        </button>
      </div>

      {/* ২. মেইন স্ক্রল এরিয়া */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32">
        
        {/* দ্যা লিকুইড ভিজ্যুয়ালাইজার (১০০% বাজেট থেকে কমানোর টেস্ট হিসেবে ৮০% দেওয়া হলো) */}
        <LiquidVisualizer percentage={80} amount="12,500.00" />

        {/* ওয়ালেট স্ট্যাক (তাসের মতো কার্ড) */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">Wealth Stack</h3>
            <span className="text-[9px] text-blue-500 animate-pulse font-bold">TAP TO SWITCH</span>
          </div>
          <WalletStack />
        </div>

        {/* রিসেন্ট অ্যাক্টিভিটি টাইটেল */}
        <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500 mb-6">Recent Records</h3>
        <div className="py-10 text-center border border-dashed border-white/5 rounded-[40px] opacity-20 italic text-sm">
          No records in this sector.
        </div>
      </div>

      {/* ৩. ফ্লোটিং অ্যাকশন ডক */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-40">
        <div className="bg-white/5 backdrop-blur-2xl p-2 rounded-[32px] flex items-center justify-between border border-white/10 shadow-2xl">
          <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            Scribe
          </button>
          
          <div className="w-14 h-14 bg-blue-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-600/30 -mt-8 border-[6px] border-[#010409] rotate-45 active:rotate-[60deg] transition-all">
             <span className="text-2xl text-white -rotate-45">✨</span>
          </div>

          <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            Nexus
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;