import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-[#000] flex justify-center items-center font-sans">
      <div className="relative w-full max-w-[420px] h-screen md:h-[850px] bg-[#050505] md:rounded-[40px] md:border-[8px] border-[#1a1a1a] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;