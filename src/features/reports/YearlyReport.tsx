import React from 'react';
import { useNavigate } from 'react-router-dom';

const YearlyReport = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-black p-8 text-white flex flex-col overflow-hidden">
       {/* হেডার */}
       <div className="flex items-center gap-4 mb-10 pt-4">
         <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all">←</button>
         <h2 className="text-[10px] font-black uppercase tracking-[5px] text-white/80">Yearly Archives</h2>
       </div>

       {/* প্লেসহোল্ডার কন্টেন্ট */}
       <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[50px] bg-white/[0.01]">
         <div className="text-4xl mb-6 opacity-20 italic font-black uppercase tracking-[10px]">2026</div>
         <p className="text-[10px] font-bold text-white/20 uppercase tracking-[3px] text-center px-10">
           Annual financial simulation is being processed. 
           <br/><span className="italic mt-4 block text-cyan-500/40">Data loading...</span>
         </p>
       </div>
    </div>
  );
};

export default YearlyReport;