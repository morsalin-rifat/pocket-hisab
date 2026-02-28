import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/authService';

export const Sidebar = ({ isOpen, onClose, user }: any) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Monthly Report', icon: '📊', path: '/monthly-report' },
    { label: 'Yearly Archive', icon: '📅', path: '/yearly-report' },
    { label: 'Tour & Events', icon: '🏝️', path: '/events' },
    { label: 'History', icon: '📜', path: '/history' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ব্যাকড্রপ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          {/* মেনু প্যানেল */}
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] z-[300] bg-zinc-900 border-r border-white/10 p-8 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black font-black">{user?.displayName?.[0]}</div>
               <div>
                 <h2 className="text-white font-black text-sm tracking-tight">{user?.displayName}</h2>
                 <p className="text-[8px] text-white/40 uppercase tracking-[2px]">Authorized Access</p>
               </div>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <button key={item.path} onClick={() => { navigate(item.path); onClose(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-[3px] text-white/60 group-hover:text-white">{item.label}</span>
                </button>
              ))}
            </nav>

            <button onClick={() => authService.logout()} className="mt-auto p-4 flex items-center gap-4 text-red-500/60 hover:text-red-500 transition-colors">
               <span className="text-xl">🚪</span>
               <span className="text-[10px] font-black uppercase tracking-[3px]">System Logout</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};