import React from 'react';
import { motion } from 'framer-motion';

const Login = () => {
  
  const handleLogin = () => {
    // এখানে আমরা পরে Firebase Google Auth কানেক্ট করব
    console.log("Initializing Secure Login...");
  };
  
  return (
    <div className="relative h-full w-full bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড এনিমেটেড গ্লো */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      {/* মেইন ভল্ট কার্ড */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex flex-col items-center shadow-2xl"
      >
        {/* সিকিউরিটি আইকন (Pulsing Shield) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotateY: [0, 360] 
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotateY: { duration: 5, repeat: Infinity, ease: "linear" }
          }}
          className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
        >
          🛡️
        </motion.div>

        {/* টেক্সট কন্টেন্ট */}
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          Secure Access
        </h2>
        <p className="text-slate-400 text-center text-sm leading-relaxed mb-10 px-4">
          Verify your identity to initialize your private financial workspace.
        </p>

        {/* গুগল লগ-ইন বাটন */}
        <button 
          onClick={handleLogin}
          className="group relative w-full py-4 bg-white hover:bg-slate-100 text-black font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl overflow-hidden"
        >
          {/* গুগল আইকন (সিম্পল এনিমেটেড) */}
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span className="tracking-wide text-sm uppercase">Continue with Google</span>
          
          {/* গ্লস ইফেক্ট */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        {/* সিকিউরিটি নোট */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[2px]">
          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
          End-to-End Encrypted System
        </div>
      </motion.div>

      {/* নিচের ফুটার টেক্সট */}
      <p className="absolute bottom-10 text-slate-600 text-[11px] tracking-widest uppercase">
        Pocket Hisab v1.0.0
      </p>
    </div>
  );
};

export default Login;