import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../auth/authService';
import { WalletCard } from './components/WalletCard';
import { TransactionItem } from './components/TransactionItem';

const Dashboard = ({ user }: { user: any }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="relative h-full w-full bg-[#050505] flex flex-col overflow-hidden">
      
      {/* ১. স্মার্ট হেডার */}
      <div className="p-6 pt-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
             {user?.displayName?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{user?.displayName?.split(' ')[0]}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{greeting}</p>
          </div>
        </div>
        <button onClick={() => authService.logout()} className="opacity-40 hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>

      {/* ২. মেইন কন্টেন্ট (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        
        {/* ব্যালেন্স কার্ড */}
        <div className="mt-4 mb-10">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mb-2">Total Balance</p>
          <h2 className="text-5xl font-light tracking-tighter">0.00 <span className="text-sm font-bold text-blue-500">BDT</span></h2>
        </div>

        {/* ওয়ালেট স্ট্যাক */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">My Wallets</h3>
            <button className="text-[10px] text-blue-500 font-bold">+ NEW</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <WalletCard name="Cash" balance={0} icon="💵" color="#3b82f6" />
            <WalletCard name="bKash" balance={0} icon="📱" color="#e11d48" />
            <WalletCard name="Bank" balance={0} icon="🏦" color="#10b981" />
          </div>
        </div>

        {/* ৩. রিসেন্ট ট্রানজেকশন (Activity Feed) */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500 mb-6">Recent Activity</h3>
          
          {/* যদি কোনো লেনদেন না থাকে */}
          <div className="text-center py-10 opacity-20">
            <p className="text-sm italic">No transactions yet.</p>
          </div>

          {/* ডামি ট্রানজেকশন (টেস্ট করার জন্য) */}
          <TransactionItem title="Tea & Snacks" amount={40} time="10:30 AM" category="Food" icon="☕" />
          <TransactionItem title="Rickshaw" amount={60} time="09:15 AM" category="Transport" icon="🚲" />
        </div>
      </div>

      {/* ৪. ফ্লোটিং অ্যাকশন ডক (The Hub) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-30">
        <div className="glass-panel p-3 rounded-[35px] flex items-center justify-between shadow-2xl border border-white/10">
          <button className="flex-1 flex flex-col items-center py-2 gap-1 group">
             <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">📝</span>
             <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Manual</span>
          </button>
          
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 -mt-10 border-4 border-[#050505] active:scale-90 transition-all">
             <span className="text-2xl text-white">🏠</span>
          </div>

          <button className="flex-1 flex flex-col items-center py-2 gap-1 group">
             <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">✨</span>
             <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">AI Entry</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;