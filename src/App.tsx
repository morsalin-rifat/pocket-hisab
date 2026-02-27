import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// আলদা আলাদা পেজগুলো লোড করা হচ্ছে (Lazy Loading)
const IntroScreen = lazy(() => import('./features/intro/IntroScreen'));
const Login = lazy(() => import('./features/auth/Login'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Loading...</div>}>
          <Routes>
            {/* ১. ইন্ট্রো বা অনবোর্ডিং পেজ (ইংরেজি) */}
            <Route path="/" element={<IntroScreen />} />
            
            {/* ২. লগ-ইন পেজ */}
            <Route path="/login" element={<Login />} />
            
            {/* ভবিষ্যতে ড্যাশবোর্ড বা অন্যান্য পেজ এখানে আসবে */}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;