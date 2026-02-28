import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SwipableCards = ({ walletBalances }: { walletBalances: any }) => {
  const walletData = [
    { id: 'Cash', name: 'Physical Cash', balance: walletBalances.Cash, color: 'bg-emerald-800', icon: '💵', brand: 'CASH' },
    { id: 'bKash', name: 'bKash Wallet', balance: walletBalances.bKash, color: 'bg-rose-700', icon: '📱', brand: 'MFS' },
    { id: 'Bank', name: 'Main Bank', balance: walletBalances.Bank, color: 'bg-zinc-900', icon: '🏛️', brand: 'VISA' },
  ];
  
  const [cards, setCards] = useState(walletData);
  
  const rotateCards = () => {
    setCards((prev) => {
      const next = [...prev];
      const first = next.shift();
      if (first) next.push(first);
      return next;
    });
  };
  
  return (
    <div className="relative h-64 w-full flex items-center justify-center pt-6">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={index === 0 ? rotateCards : undefined}
            whileHover={index === 0 ? { y: -10, rotateX: 5 } : {}}
            whileTap={{ scale: 0.95 }}
            layout
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1 - index * 0.08, 
              y: index * 18, 
              zIndex: 10 - index,
              opacity: 1 - index * 0.25,
            }}
            exit={{ x: 300, rotate: 20, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className={`absolute top-0 w-full h-44 ${card.color} rounded-[40px] p-8 shadow-2xl flex flex-col justify-between border border-white/10 cursor-pointer overflow-hidden transition-all duration-300`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5">{card.icon}</div>
              <div className="px-3 py-1 bg-black/20 rounded-lg text-[8px] font-black tracking-widest uppercase border border-white/5">{card.brand}</div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40 mb-1">{card.name}</p>
              <h3 className="text-3xl font-black tracking-tight">{card.balance.toLocaleString()} <span className="text-sm">৳</span></h3>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};