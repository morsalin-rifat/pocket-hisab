import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from './authService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSpamNotice, setShowSpamNotice] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.signUp(email, password);
        setShowSpamNotice(true);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative min-h-full w-full bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* ১. ইন্টারঅ্যাক্টিভ ব্যাকগ্রাউন্ড (Animated Nebula) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-[100%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-[100%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {!showSpamNotice ? (
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -30 : 30, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: isLogin ? 30 : -30, rotateY: -15 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative z-10 w-full max-w-[380px] perspective-1000"
          >
            {/* ২. মেইন সাই-ফাই কার্ড (Glassmorphism) */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* হেডার ও লোগো এনিমেশন */}
              <div className="flex flex-col items-center mb-10">
                <motion.div 
                  layoutId="auth-icon"
                  className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6"
                >
                  {isLogin ? "🔐" : "🚀"}
                </motion.div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isLogin ? "Identity Link" : "Initialize Account"}
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[3px] mt-2">
                  System Protocol v1.0
                </p>
              </div>

              {/* ফর্ম সেকশন */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="group relative">
                  <input 
                    type="email" 
                    placeholder="E-mail Address" 
                    className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="group relative">
                  <input 
                    type="password" 
                    placeholder="Access Key" 
                    className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 active:shadow-none transition-all flex items-center justify-center gap-2 overflow-hidden relative"
                  disabled={loading}
                >
                  {loading ? (
                     <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="tracking-widest uppercase">{isLogin ? "Verify & Enter" : "Activate System"}</span>
                  )}
                  {/* স্ক্যানিং এনিমেশন */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                </motion.button>
              </form>

              {/* ৩. সোশ্যাল ও গেস্ট গেটওয়ে */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] font-bold">OR</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => authService.loginAsGuest()}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-[10px] font-black text-slate-300 tracking-widest uppercase transition-all"
                  >
                    Guest Mode
                  </button>
                  <button 
                    onClick={() => authService.loginWithGoogle()}
                    className="py-3 bg-white text-black rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
                    Google
                  </button>
                </div>
              </div>

              {/* লগ-ইন/সাইন-আপ টগল */}
              <p className="mt-10 text-center text-slate-500 text-sm font-medium">
                {isLogin ? "New to the system?" : "Already verified?"} 
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors underline decoration-blue-400/30 underline-offset-4"
                >
                  {isLogin ? "Create One" : "Log In"}
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          /* ৪. স্প্যাম নোটিশ (Verified UI) */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-[380px] bg-white/[0.03] backdrop-blur-3xl border border-blue-500/20 rounded-[45px] p-10 text-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              📩
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-4 italic">Check Your Inbox!</h2>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed mb-8">
              <p>আমরা একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি।</p>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 font-bold text-xs">⚠️ মেইলটি না পেলে Spam বা Junk ফোল্ডার চেক করুন।</p>
              </div>
              <p className="text-[10px] uppercase tracking-wider">মেইলটি পেলে "Not Spam" হিসেবে মার্ক করুন।</p>
            </div>
            <button 
              onClick={() => setShowSpamNotice(false)}
              className="w-full py-4 border border-white/20 rounded-2xl text-white font-bold hover:bg-white/5 transition-all"
            >
              Back to System
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Login;