import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialWallets = [
  { id: 1, name: 'Main Bank', balance: '45,200', color: 'from-blue-600 to-indigo-800', icon: '🏛️' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'from-pink-600 to-rose-800', icon: '📱' },
  { id: 3, name: 'Cash', balance: '1,200', color: 'from-emerald-500 to-teal-800', icon: '💵' },
];

export const WalletDeck = () => {
  const [cards, setCards] = useState(initialWallets);
  
  const moveToEnd = (id: number) => {
    setCards((prev) => {
      const card = prev.find(c => c.id === id);
      const remaining = prev.filter(c => c.id !== id);
      return card ? [...remaining, card] : prev;
    });
  };
  
  return (
    <div className="relative h-[220px] w-full flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 100) moveToEnd(card.id);
            }}
            animate={{
              scale: 1 - index * 0.06,
              y: index * 12,
              zIndex: cards.length - index,
              opacity: 1 - index * 0.2,
            }}
            className={`absolute w-full h-44 bg-gradient-to-br ${card.color} rounded-[40px] p-8 flex flex-col justify-between border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing`}
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl">{card.icon}</span>
              <div className="w-12 h-12 bg-black/20 rounded-2xl backdrop-blur-md border border-white/5 flex items-center justify-center">
                <div className="w-8 h-5 bg-yellow-500/40 rounded-sm border border-yellow-200/20" /> {/* Card Chip */}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{card.name}</p>
              <h3 className="text-3xl font-bold tracking-tight">{card.balance} <span className="text-sm font-normal">৳</span></h3>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};