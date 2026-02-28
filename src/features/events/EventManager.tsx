import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventManager = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-black p-8 text-white flex flex-col overflow-hidden">
       {/* হেডার */}
       <div className="flex items-center gap-4 mb-10 pt-4">
         <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all">←</button>
         <h2 className="text-[10px] font-black uppercase tracking-[5px] text-white/80">Tour & Events</h2>
       </div>

       {/* প্লেসহোল্ডার কন্টেন্ট */}
       <div className="flex-1 flex flex-col items-center justify-center space-y-6">
         <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl">🏝️</div>
         <div className="text-center space-y-2 px-8">
            <h3 className="text-lg font-black italic tracking-tight text-white/90 underline decoration-blue-500/20 underline-offset-8">Universe Manager</h3>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[2px] leading-loose">
               No active event silos found in this timeline. 
               <br/>Initialize your first trip from the dashboard.
            </p>
         </div>
       </div>

       {/* কুইক এড বাটন (ডিজাইন অনলি) */}
       <button className="mt-auto py-5 bg-white text-black font-black rounded-[25px] text-[10px] uppercase tracking-[4px] shadow-xl active:scale-95 transition-all">
         Create New Universe
       </button>
    </div>
  );
};

export default EventManager;