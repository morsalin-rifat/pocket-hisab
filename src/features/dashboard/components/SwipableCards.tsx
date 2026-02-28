import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const walletData = [
  { id: 1, name: 'Cash In Hand', balance: '1,200', color: 'bg-emerald-800', icon: '💵', brand: 'CASH' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'bg-rose-700', icon: '📱', brand: 'MFS' },
  { id: 3, name: 'Main Bank', balance: '45,200', color: 'bg-zinc-900', icon: '🏛️', brand: 'VISA' },
];

export const SwipableCards = () => {
  const [cards, setCards] = useState(walletData);
  
  const handleSwipe = (id: number) => {
    setCards((prev) => {
      const remaining = prev.filter(c => c.id !== id);
      const moved = prev.find(c => c.id === id);
      return [...remaining, moved!];
    });
  };
  
  return (
    <div className="relative h-60 w-full flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 100) handleSwipe(card.id);
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1 - index * 0.05, 
              y: index * 15, 
              zIndex: 10 - index,
              opacity: 1 - index * 0.2,
            }}
            exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
            className={`absolute top-0 w-full h-44 ${card.color} rounded-[40px] p-8 shadow-2xl flex flex-col justify-between border border-white/10 cursor-grab active:cursor-grabbing overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                {card.icon}
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black tracking-widest uppercase">{card.brand}</div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40 mb-1">{card.name}</p>
              <h3 className="text-3xl font-black tracking-tight">{card.balance} <span className="text-sm">৳</span></h3>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};