import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wallets = [
  { id: 1, name: 'Main Bank', balance: '45,200', color: 'bg-indigo-600', icon: '🏛️' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'bg-pink-600', icon: '📱' },
  { id: 3, name: 'Physical Cash', balance: '1,200', color: 'bg-emerald-600', icon: '💵' },
];

export const WalletStack = () => {
  const [cards, setCards] = useState(wallets);
  
  const rotateStack = () => {
    const newCards = [...cards];
    const firstCard = newCards.shift();
    if (firstCard) newCards.push(firstCard);
    setCards(newCards);
  };
  
  return (
    <div className="relative h-48 w-full mt-4" onClick={rotateStack}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ 
              scale: 1 - index * 0.05, 
              y: index * 15, 
              zIndex: wallets.length - index,
              opacity: 1 - index * 0.2
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute top-0 left-0 w-full h-40 ${card.color} rounded-[35px] p-6 shadow-2xl flex flex-col justify-between border border-white/20 cursor-pointer overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl">{card.icon}</span>
              <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{card.name}</p>
              <h3 className="text-2xl font-bold">{card.balance} <span className="text-xs">৳</span></h3>
            </div>
            {/* কার্ডের ভেতর হালকা গ্লস */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};