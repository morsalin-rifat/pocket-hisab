import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const walletData = [
  { id: 1, name: 'Main Bank', balance: '45,200', color: 'bg-[#1e1e1e]', icon: '🏛️' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'bg-[#d1105a]', icon: '📱' },
  { id: 3, name: 'Cash', balance: '1,200', color: 'bg-[#065f46]', icon: '💵' },
];

export const SwipableCards = () => {
  const [cards, setCards] = useState(walletData);
  
  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      const newCards = [...cards];
      const movedCard = newCards.shift();
      if (movedCard) newCards.push(movedCard);
      setCards(newCards);
    }
  };
  
  return (
    <div className="relative h-44 w-full flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card, index) => (
          index < 3 && (
            <motion.div
              key={card.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1 - index * 0.05, 
                y: index * 12, 
                zIndex: 10 - index,
                opacity: 1 - index * 0.2
              }}
              exit={{ x: 200, opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute top-0 w-full h-40 ${card.color} rounded-[40px] p-6 shadow-2xl flex flex-col justify-between border border-white/10 cursor-grab active:cursor-grabbing overflow-hidden`}
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl">{card.icon}</span>
                <div className="w-10 h-6 bg-white/10 rounded-lg border border-white/10 flex items-center justify-center text-[8px] font-bold">VISA</div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{card.name}</p>
                <h3 className="text-2xl font-bold tracking-tight">{card.balance} ৳</h3>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};