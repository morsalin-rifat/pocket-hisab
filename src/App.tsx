import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './features/auth/authService';

const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard')); // নতুন ইম্পোর্ট

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
  
  if (loading) return <div className="bg-[#020617] h-screen flex items-center justify-center text-blue-500 font-bold tracking-widest animate-pulse">SYSTEM INITIALIZING...</div>;
  
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="text-white flex items-center justify-center h-full">Loading Space...</div>}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <IntroScreen />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;