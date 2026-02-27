import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // বাইরের ব্যাকগ্রাউন্ড (ডেস্কটপের জন্য ডার্ক ও ব্লার)
    <div className="min-h-screen w-full bg-[#0a0f1e] flex justify-center items-center font-sans overflow-hidden">
      
      {/* মেইন অ্যাপ কন্টেইনার (মোবাইলে ফুল, ডেস্কটপে ফিক্সড সাইজ) */}
      <div className="relative w-full max-w-md h-screen md:h-[90vh] bg-[#0d1425] shadow-2xl md:rounded-3xl border border-slate-800 overflow-y-auto overflow-x-hidden">
        
        {/* অ্যাপের কন্টেন্ট এখানে লোড হবে */}
        {children}
        
      </div>
    </div>
  );
};

export default Layout;