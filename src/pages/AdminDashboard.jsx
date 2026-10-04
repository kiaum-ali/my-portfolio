import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Firebase imports for real-time counts
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';

import Sidebar from '../components/admin/Sidebar';
import ProjectManager from '../admin/ProjectManager';
import MessageManager from '../admin/MessageManager';
import ProfileManager from '../admin/ProfileManager';
import SkillsManager from '../admin/SkillsManager';
import ExperienceManager from '../admin/ExperienceManager';
import AboutManager from '../admin/AboutManager'; 
import ContactManager from '../admin/ContactManager'; 

// Dashboard Overview (Home) Component
const DashboardHome = () => {
  // Firebase থেকে ডাটা কাউন্ট রাখার জন্য স্টেট
  const [projectCount, setProjectCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // রিয়েল-টাইম ডাটা Fetch করার জন্য useEffect
  useEffect(() => {
    // Projects Count
    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjectCount(snapshot.size); // কালেকশনে কতগুলো প্রোজেক্ট আছে তার সংখ্যা নিবে
    });

    // Messages Count
    const unsubscribeMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      setMessageCount(snapshot.size); // কালেকশনে কতগুলো মেসেজ আছে তার সংখ্যা নিবে
    });

    // Clean up functions
    return () => {
      unsubscribeProjects();
      unsubscribeMessages();
    };
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-t-4 border-t-primary">
          <h3 className="text-text-muted mb-2">Total Projects</h3>
          <p className="text-4xl font-bold text-white">{projectCount}</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-green-500">
          <h3 className="text-text-muted mb-2">Total Messages</h3>
          <p className="text-4xl font-bold text-white">{messageCount}</p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-purple-500">
          <h3 className="text-text-muted mb-2">Profile Views</h3>
          <p className="text-4xl font-bold text-white">1.2K</p> {/* এটি স্ট্যাটিক রাখা হয়েছে */}
        </div>
      </div>
    </div>
  );
};

// Coming Soon Placeholder for unfinished pages
const ComingSoon = ({ title }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
    <h2 className="text-3xl font-bold text-gradient mb-2">{title} Manager</h2>
    <p className="text-text-muted">This module is under development...</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-end px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-glow">
              A
            </div>
          </div>
        </div>

        {/* Dashboard Routes nested within /admin */}
        <div className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/messages" element={<MessageManager />} />
            <Route path="/profile" element={<ProfileManager />} />
            <Route path="/skills" element={<SkillsManager />} />
            <Route path="/experience" element={<ExperienceManager />} />
            <Route path="/about" element={<AboutManager />} />
            <Route path="/contact" element={<ContactManager />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;