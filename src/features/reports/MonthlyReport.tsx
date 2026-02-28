import React from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlyReport = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-black p-8 text-white flex flex-col">
       <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10">←</button>
       <h2 className="text-sm font-black uppercase tracking-[5px] text-white/80">Monthly Insights</h2>
       <div className="mt-20 text-center opacity-20 italic">Generating monthly spending patterns...</div>
    </div>
  );
};
export default MonthlyReport;