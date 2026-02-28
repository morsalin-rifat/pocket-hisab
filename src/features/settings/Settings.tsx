import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../auth/authService';

const Settings = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const budget = localStorage.getItem('userBudget') || '5000';
  
  return (
    <div className="h-screen bg-black p-8 text-white flex flex-col overflow-hidden">
       <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 text-xl">←</button>
       
       <h2 className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-2">Control Center</h2>
       <h1 className="text-3xl font-black italic mb-12">System Settings</h1>

       <div className="space-y-4">
         {/* প্রোফাইল তথ্য */}
         <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[35px] flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black font-black text-2xl">{user?.displayName?.[0]}</div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[2px]">Authorized User</p>
              <h3 className="text-lg font-bold text-white tracking-tight">{user?.displayName}</h3>
            </div>
         </div>

         {/* বাজেট সেটিংস */}
         <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[35px] flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[2px]">Default Budget</p>
              <h3 className="text-lg font-bold text-white">{budget} BDT</h3>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-cyan-400">Change</button>
         </div>

         {/* ডেঞ্জার জোন */}
         <div className="mt-12 pt-12 border-t border-white/5">
           <button onClick={() => alert("Wipe utility coming soon in v6.0")} 
             className="w-full py-5 border border-red-900/30 bg-red-900/10 text-red-500 font-black rounded-[25px] text-[10px] uppercase tracking-[4px] active:bg-red-500 active:text-white transition-all"
           >
             Emergency Data Wipe
           </button>
         </div>
       </div>

       <p className="mt-auto text-center text-[8px] font-black text-white/10 uppercase tracking-[5px] pb-4">Pocket Hisab v5.0.0 Galactic</p>
    </div>
  );
};
export default Settings;