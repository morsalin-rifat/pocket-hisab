import React from 'react';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';

const Dashboard = ({ user }: { user: any }) => {
  // সময় অনুযায়ী উইশ করার লজিক
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="relative min-h-full w-full bg-[#020617] text-white flex flex-col p-6 overflow-x-hidden">
      
      {/* ১. টপ হেডার ও ইউজার উইশ */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{greeting},</h2>
          <h1 className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {user?.displayName || "Commander"}
          </h1>
        </div>
        <button 
          onClick={() => authService.logout()}
          className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg active:scale-90 transition-all"
        >
          🚪
        </button>
      </div>

      {/* ২. টোটাল ব্যালেন্স গ্লাস কার্ড */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full p-8 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Net Worth</p>
        <h2 className="text-4xl font-black tracking-tighter italic">00.00 <span className="text-lg text-blue-400">৳</span></h2>
      </motion.div>

      {/* ৩. ওয়ালেট হাব (স্লাইডার আসবে এখানে) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">My Wallets</h3>
          <button className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-tighter hover:bg-white/10">
            + Add New
          </button>
        </div>
        
        {/* টেম্পোরারি ওয়ালেট প্লেসহোল্ডার */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           <div className="min-w-[140px] p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-3">
              <span className="text-2xl">💵</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Cash</p>
              <h4 className="font-bold">0.0 ৳</h4>
           </div>
           <div className="min-w-[140px] p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-3">
              <span className="text-2xl">📱</span>
              <p className="text-[10px] font-bold text-slate-500 uppercase">bKash</p>
              <h4 className="font-bold">0.0 ৳</h4>
           </div>
        </div>
      </div>

      {/* ৪. কুইক অ্যাকশন বাটনস (Sleek Design) */}
      <div className="grid grid-cols-2 gap-4 mt-auto pb-6">
         <button className="py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all border-b-2 border-b-blue-500">
           📝 Manual
         </button>
         <button className="py-4 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
           ✨ AI Entry
         </button>
      </div>

    </div>
  );
};

export default Dashboard;