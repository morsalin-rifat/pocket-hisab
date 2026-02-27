import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './features/auth/authService';

// ইমপোর্ট পাথগুলো একদম নিখুঁত হতে হবে (Case Sensitive)
const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));

function App() {
  const [user, setUser] = useState < any > (null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  if (loading) return (
    <div className="bg-[#020617] h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-500 font-black tracking-[4px] text-[10px] uppercase">System Initializing</p>
      </div>
    </div>
  );
  
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="h-screen bg-[#020617] flex items-center justify-center text-white italic tracking-widest animate-pulse">
            LOADING SPACE...
          </div>
        }>
          <Routes>
            {/* ১. রুট পাথ লজিক */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <IntroScreen />} />
            
            {/* ২. লগ-ইন পাথ */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            
            {/* ৩. ড্যাশবোর্ড পাথ */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            
            {/* ৪. ভুল পাথে গেলে হোম এ পাঠাবে */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;