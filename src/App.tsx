import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './features/auth/authService';

const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));

function App() {
  const [user, setUser] = useState < any > (null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedInBefore] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // প্রিমিয়াম স্প্ল্যাশ স্ক্রিন (বিরক্তি কমাতে এটি ২ সেকেন্ডের বেশি থাকবে না)
  if (loading && hasLoggedInBefore) {
    return (
      <div className="bg-[#020617] h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(37,99,235,0.3)] animate-pulse">
           💰
        </div>
        <div className="mt-8 flex gap-1">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="h-screen bg-[#020617]" />}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <IntroScreen />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;