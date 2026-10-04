import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// X (Close) আইকন ইম্পোর্ট করা হয়েছে মোবাইলে মেনু কাটার জন্য
import { LayoutDashboard, Briefcase, Mail, User, Star, List, Settings, LogOut, Info, Phone, X } from 'lucide-react'; 
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

// isOpen এবং setIsOpen প্রপসগুলো রিসিভ করা হয়েছে
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dashboard Menu Items
  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/projects', name: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/admin/messages', name: 'Messages', icon: <Mail size={20} /> },
    { path: '/admin/profile', name: 'Profile', icon: <User size={20} /> },
    { path: '/admin/about', name: 'About', icon: <Info size={20} /> },
    { path: '/admin/skills', name: 'Skills', icon: <Star size={20} /> },
    { path: '/admin/experience', name: 'Experience', icon: <List size={20} /> },
    { path: '/admin/contact', name: 'Contact', icon: <Phone size={20} /> },
    { path: '/admin/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay - মেনু ওপেন থাকলে ব্যাকগ্রাউন্ডে একটি ব্লার ইফেক্ট দেখাবে এবং সেখানে ক্লিক করলে মেনু বন্ধ হবে */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - স্লাইডিং অ্যানিমেশন এবং রেসপন্সিভ ডিজাইন যুক্ত করা হয়েছে */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 w-64 h-screen bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        
        {/* Admin Logo & Close Button */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-wider">
            <span className="text-white">ADMIN </span>
            <span className="text-primary">PANEL</span>
          </h2>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-text-muted hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Check if current route matches the link
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} // মোবাইলে কোনো লিংকে ক্লিক করলে মেনু অটো বন্ধ হয়ে যাবে
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-text-muted hover:bg-surfaceHover hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        
      </aside>
    </>
  );
};

export default Sidebar;