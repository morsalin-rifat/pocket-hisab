import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './features/auth/authService';

const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const History = lazy(() => import('./features/history/History'));
const MonthlyReport = lazy(() => import('./features/reports/MonthlyReport'));
const YearlyReport = lazy(() => import('./features/reports/YearlyReport'));
const EventManager = lazy(() => import('./features/events/EventManager'));

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedInBefore] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((u: any) => { setUser(u); setLoading(false); });
    return () => unsubscribe();
  }, []);

  if (loading && hasLoggedInBefore) {
    return <div className="bg-black h-screen flex items-center justify-center text-white font-black tracking-[10px] animate-pulse italic">POCKET HISAB</div>;
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <IntroScreen />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/monthly-report" element={user ? <MonthlyReport user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/yearly-report" element={user ? <YearlyReport user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/events" element={user ? <EventManager user={user} /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;