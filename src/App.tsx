import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './features/auth/authService';

const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));

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
  
  if (loading) return <div className="bg-[#020617] h-screen flex items-center justify-center text-blue-500">Initializing...</div>;
  
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <Routes>
            {/* যদি ইউজার লগ-ইন থাকে, তবে তাকে ড্যাশবোর্ডে পাঠাবে (আপাতত লগ-আউট বাটন দেখাচ্ছি) */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <IntroScreen />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            
            <Route path="/dashboard" element={
              user ? (
                <div className="p-10 text-white text-center">
                  <h1 className="text-3xl font-bold mb-4">Welcome, {user.displayName}! ✨</h1>
                  <p className="text-slate-400 mb-8">Your unique ID: {user.uid.slice(-6)}</p>
                  <button onClick={() => authService.logout()} className="bg-red-500/20 text-red-400 px-6 py-2 rounded-xl border border-red-500/30">
                    System Logout
                  </button>
                </div>
              ) : <Navigate to="/login" />
            } />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;