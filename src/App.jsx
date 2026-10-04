import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Firebase Auth ইম্পোর্ট করা হলো
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config.js'; // আপনার ফায়ারবেস কনফিগারেশনের পাথ

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// ProtectedRoute কম্পোনেন্ট তৈরি করা হলো
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ফায়ারবেস থেকে ইউজার লগিন স্ট্যাটাস চেক করা হচ্ছে
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // চেক করা শেষ হলে লোডিং ফলস হবে
    });

    return () => unsubscribe();
  }, []);

  // চেক করার সময় একটি লোডিং স্পিনার দেখাবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // যদি ইউজার লগিন করা না থাকে, তবে লগিন পেজে রিডাইরেক্ট করে দেবে
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // যদি লগিন করা থাকে, তবে ড্যাশবোর্ড দেখাবে
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background min-h-screen font-sans selection:bg-primary/30 text-text-main">
        <Routes>
          {/* Public Route (মূল ওয়েবসাইট) */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Dashboard Routes (Protected) */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;