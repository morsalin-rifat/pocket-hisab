import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from './authService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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
  
  // ৩ডি ট্রানজিশন ভেরিয়েন্টস
  const cardVariants = {
    initial: (isLogin: boolean) => ({
      opacity: 0,
      x: isLogin ? -100 : 100,
      rotateY: isLogin ? -25 : 25,
      scale: 0.9
    }),
    animate: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: (isLogin: boolean) => ({
      opacity: 0,
      x: isLogin ? 100 : -100,
      rotateY: isLogin ? 25 : -25,
      scale: 0.9,
      transition: { duration: 0.3 }
    })
  };
  
  return (
    <div className="relative min-h-full w-full bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden perspective-1000">
      
      {/* ব্যাকগ্রাউন্ড ডায়নামিক নিবুলা */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-[60%] bg-emerald-500/10 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait" custom={isLogin}>
        {!showSpamNotice ? (
          <motion.div
            key={isLogin ? "login" : "signup"}
            custom={isLogin}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-[400px]"
          >
            {/* মেইন সাই-ফাই গ্লাস কার্ড */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              
              <div className="flex flex-col items-center mb-10">
                <motion.div 
                  layoutId="icon"
                  className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(59,130,246,0.5)] mb-6"
                >
                  {isLogin ? "🔐" : "👤"}
                </motion.div>
                <h2 className="text-3xl font-black text-white italic tracking-tight">
                  {isLogin ? "Access Portal" : "New Profile"}
                </h2>
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* নাম ইনপুট - শুধুমাত্র সাইন আপের জন্য */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, mb: 0 }}
                      animate={{ opacity: 1, height: 'auto', mb: 16 }}
                      exit={{ opacity: 0, height: 0, mb: 0 }}
                    >
                      <input 
                        type="text" 
                        placeholder="Your Full Name" 
                        className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input 
                  type="email" 
                  placeholder="E-mail Address" 
                  className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Security Key" 
                  className="w-full py-4 px-6 bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40 mt-4 overflow-hidden relative"
                  disabled={loading}
                >
                  {loading ? "INITIALIZING..." : (isLogin ? "VERIFY & ENTER" : "CREATE ACCOUNT")}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                </motion.button>
              </form>

              {/* গেস্ট ও সোশ্যাল গেটওয়ে */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] font-bold text-slate-600">AUTHENTICATION</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => authService.loginAsGuest()}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-[10px] font-black text-slate-400 tracking-widest uppercase"
                  >
                    Guest Identity
                  </button>
                  <button 
                    onClick={() => authService.loginWithGoogle()}
                    className="py-3 bg-white text-black rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G"/>
                    Google
                  </button>
                </div>
              </div>

              <p className="mt-10 text-center text-slate-500 text-sm font-medium">
                {isLogin ? "Need a new access?" : "Have an identity?"} 
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors underline decoration-cyan-400/30 underline-offset-4"
                >
                  {isLogin ? "Create Profile" : "Login Now"}
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          /* স্প্যাম নোটিশ স্ক্রিন */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            className="relative z-10 w-full max-w-[380px] bg-white/[0.03] backdrop-blur-3xl border border-blue-500/20 rounded-[45px] p-10 text-center"
          >
            <div className="text-7xl mb-6">📩</div>
            <h2 className="text-2xl font-black text-white mb-4 italic">Verify Email!</h2>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed mb-8">
              <p>আমরা একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি।</p>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 font-bold text-xs">⚠️ মেইল না পেলে Spam বা Junk ফোল্ডার চেক করুন।</p>
              </div>
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