import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const walletData = [
  { id: 1, name: 'Cash In Hand', balance: '1,200', color: 'bg-[#065f46]', icon: '💵', brand: 'CASH' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'bg-[#d1105a]', icon: '📱', brand: 'MFS' },
  { id: 3, name: 'Main Bank', balance: '45,200', color: 'bg-[#1e1e1e]', icon: '🏛️', brand: 'VISA' },
];

export const SwipableCards = () => {
  const [cards, setCards] = useState(walletData);
  
  const moveToEnd = (id: number) => {
    setCards((prev) => {
      const remaining = prev.filter(c => c.id !== id);
      const moved = prev.find(c => c.id === id);
      return [...remaining, moved!];
    });
  };
  
  return (
    <div className="relative h-56 w-full flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (Math.abs(info.offset.x) > 100) moveToEnd(card.id);
            }}
            style={{ x: 0 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1 - index * 0.06, 
              y: index * 14, 
              zIndex: 10 - index,
              opacity: 1 - index * 0.2,
              rotateX: index * -2,
            }}
            exit={{ 
              x: 300, 
              opacity: 0, 
              rotate: 20,
              transition: { duration: 0.4 } 
            }}
            className={`absolute top-0 w-full h-44 ${card.color} rounded-[40px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between border border-white/10 cursor-grab active:cursor-grabbing overflow-hidden`}
          >
            {/* কার্ড কন্টেন্ট */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                {card.icon}
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[8px] font-black tracking-widest">{card.brand}</div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[3px] opacity-40 mb-1">{card.name}</p>
              <h3 className="text-3xl font-black tracking-tight">{card.balance} <span className="text-sm">৳</span></h3>
            </div>

            {/* গ্লস এবং চিপ ইফেক্ট */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};