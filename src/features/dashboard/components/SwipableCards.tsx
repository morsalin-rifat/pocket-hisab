import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const walletData = [
  { id: 1, name: 'Cash In Hand', balance: '1,200', color: 'bg-[#065f46]', icon: '💵', brand: 'CASH' },
  { id: 2, name: 'bKash Wallet', balance: '5,300', color: 'bg-[#d1105a]', icon: '📱', brand: 'MFS' },
  { id: 3, name: 'Main Bank', balance: '45,200', color: 'bg-[#1e1e1e]', icon: '🏛️', brand: 'VISA' },
];

export const SwipableCards = () => {
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
    <div className="relative h-64 w-full flex items-center justify-center perspective-1000">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          // বৃত্তাকার পজিশন ক্যালকুলেশন
          const isFront = index === 0;
          return (
            <motion.div
              key={card.id}
              onClick={isFront ? rotateCards : undefined}
              drag={isFront ? "x" : false}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80) rotateCards();
              }}
              initial={{ scale: 0.7, opacity: 0, rotateY: 45 }}
              animate={{ 
                scale: 1 - index * 0.1, 
                y: index * 10,
                z: -index * 50,
                rotateX: index * -5,
                opacity: 1 - index * 0.3,
                zIndex: 10 - index,
              }}
              exit={{ 
                x: 150, 
                rotateY: 90, 
                scale: 0.5, 
                opacity: 0,
                transition: { duration: 0.4 } 
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`absolute top-0 w-full h-44 ${card.color} rounded-[40px] p-8 shadow-2xl flex flex-col justify-between border border-white/10 cursor-pointer overflow-hidden`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* কার্ডের ভেতরের ডিজাইন */}
              <div className="flex justify-between items-center relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  {card.icon}
                </div>
                <div className="px-3 py-1 bg-black/20 rounded-lg text-[8px] font-black tracking-widest border border-white/5">{card.brand}</div>
              </div>

              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[3px] text-white/30 mb-1">{card.name}</p>
                <h3 className="text-3xl font-black tracking-tighter">{card.balance} ৳</h3>
              </div>

              {/* থ্রিডি গ্লো ইফেক্ট */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};