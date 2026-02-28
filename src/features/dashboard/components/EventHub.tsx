import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionService } from '../../transactions/transactionService';

export const EventHub = ({ isOpen, onClose, userId, onEventSelect }: any) => {
  const [name, setName] = useState('');
  const [ebudget, setEbudget] = useState('');
  
  if (!isOpen) return null;
  
  const handleCreate = async () => {
    if (!name || !ebudget) return alert("সব তথ্য দিন");
    await transactionService.createEvent(userId, name, Number(ebudget));
    alert("Event Created!");
    onClose();
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl p-8 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[50px] p-10 shadow-2xl">
        <h2 className="text-center text-white font-black tracking-[5px] uppercase mb-10 text-sm">Initialize Event</h2>
        <div className="space-y-6">
          <input type="text" placeholder="Event Name (e.g. Sajek Trip)" value={name} onChange={e=>setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:border-blue-500" />
          <input type="number" placeholder="Event Budget" value={ebudget} onChange={e=>setEbudget(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:border-blue-500" />
          <button onClick={handleCreate} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Activate Engine</button>
          <button onClick={onClose} className="w-full text-white/20 font-bold uppercase text-[9px] tracking-widest">Abort Mission</button>
        </div>
      </div>
    </motion.div>
  );
};