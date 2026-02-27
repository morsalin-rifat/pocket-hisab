import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from './authService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // নতুন নাম স্টেট
  const [loading, setLoading] = useState(false);
  const [showSpamNotice, setShowSpamNotice] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.signUp(email, password, displayName);
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
      
      {/* এনিমেটেড ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!showSpamNotice ? (
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 w-full max-w-[380px]"
          >
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-2xl">
              
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4">
                  {isLogin ? "🔐" : "👤"}
                </div>
                <h2 className="text-2xl font-black text-white italic">
                  {isLogin ? "Identity Link" : "Create Profile"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* সাইন আপ হলে নাম ইনপুট দেখাবে */}
                {!isLogin && (
                  <motion.input 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    type="text" placeholder="Full Name (e.g. Shakib)" 
                    className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500"
                    onChange={(e) => setDisplayName(e.target.value)} required
                  />
                )}

                <input type="email" placeholder="E-mail" 
                  className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500"
                  onChange={(e) => setEmail(e.target.value)} required />

                <input type="password" placeholder="Access Key" 
                  className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500"
                  onChange={(e) => setPassword(e.target.value)} required />

                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all" disabled={loading}>
                  {loading ? "Processing..." : (isLogin ? "VERIFY & ENTER" : "ACTIVATE ACCOUNT")}
                </button>
              </form>

              <div className="mt-8 space-y-3">
                <button onClick={() => authService.loginAsGuest()} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-300 tracking-widest uppercase">
                  🕵️ Enter as Guest
                </button>
                <button onClick={() => authService.loginWithGoogle()} className="w-full py-3 bg-white text-black rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
                  Google Access
                </button>
              </div>

              <p className="mt-8 text-center text-slate-500 text-sm">
                {isLogin ? "New user?" : "Existing user?"} 
                <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-400 font-bold underline">
                  {isLogin ? "Join System" : "Log In"}
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center p-10 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Email! 📩</h2>
            <p className="text-slate-400 text-sm mb-6">আমরা ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। না পেলে <span className="text-red-400 font-bold">Spam</span> চেক করুন।</p>
            <button onClick={() => setShowSpamNotice(false)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Back to Login</button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;