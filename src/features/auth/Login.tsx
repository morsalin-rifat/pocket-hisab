import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from './authService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSpamNotice, setShowSpamNotice] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await authService.login(email, password);
        // সরাসরি ড্যাশবোর্ডে যাবে (লজিক আমরা পরে App.tsx এ হ্যান্ডেল করব)
      } else {
        await authService.signUp(email, password);
        setShowSpamNotice(true); // ভেরিফিকেশন মেইল পাঠানোর পর নোটিশ দেখাবে
      }
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  return (
    <div className="relative min-h-full w-full bg-[#050505] text-white p-8 flex flex-col justify-center overflow-y-auto">
      
      <AnimatePresence mode="wait">
        {!showSpamNotice ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-8"
          >
            {/* হেডার */}
            <div className="text-center">
              <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                {isLogin ? "Welcome Back" : "Create Vault"}
              </h2>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest">Pocket Hisab v1.0</p>
            </div>

            {/* মেইন ফর্ম */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 transition-all outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Secure Password" 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 transition-all outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all">
                {isLogin ? "INITIALIZE ACCESS" : "CREATE IDENTITY"}
              </button>
            </form>

            <div className="flex items-center gap-4">
               <div className="flex-1 h-[1px] bg-white/10" />
               <span className="text-xs text-slate-600 uppercase font-bold">OR</span>
               <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            {/* গেস্ট ও গুগল বাটন (নিচে) */}
            <div className="space-y-3">
              <button 
                onClick={() => authService.loginAsGuest()}
                className="w-full py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider"
              >
                🕵️ Enter as Guest
              </button>
              
              <button 
                onClick={() => authService.loginWithGoogle()}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                Google Network
              </button>
            </div>

            <p className="text-center text-sm text-slate-500">
              {isLogin ? "Need a new vault?" : "Already have access?"} 
              <span 
                className="ml-2 text-blue-400 font-bold cursor-pointer underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </motion.div>
        ) : (
          /* স্প্যাম নোটিশ স্ক্রিন */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl animate-bounce">📧</div>
            <h2 className="text-2xl font-bold">Check Your Email!</h2>
            <div className="p-6 bg-blue-600/10 border border-blue-500/30 rounded-[32px] space-y-4">
               <p className="text-slate-300 text-sm leading-relaxed">
                  আমরা একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। সেটি খুঁজে না পেলে দয়া করে আপনার <span className="text-red-400 font-bold underline">Spam বা Junk</span> ফোল্ডারটি চেক করুন।
               </p>
               <p className="text-xs text-slate-500 italic">
                  মেইলটি পেলে "Not Spam" হিসেবে মার্ক করুন যাতে পরে দ্রুত মেইল পান।
               </p>
            </div>
            <button 
              onClick={() => setShowSpamNotice(false)}
              className="px-8 py-3 bg-white text-black font-bold rounded-full"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;