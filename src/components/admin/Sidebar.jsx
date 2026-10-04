import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Mail, User, Star, List, Settings, LogOut, Info, Phone } from 'lucide-react'; // Phone আইকন যুক্ত করা হয়েছে
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
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
    { path: '/admin/contact', name: 'Contact', icon: <Phone size={20} /> }, // নতুন Contact মেনু যুক্ত করা হয়েছে
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
    <aside className="w-64 bg-surface border-r border-border min-h-screen hidden md:flex flex-col sticky top-0 left-0">
      
      {/* Admin Logo */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold tracking-wider">
          <span className="text-white">ADMIN </span>
          <span className="text-primary">PANEL</span>
        </h2>
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
  );
};

export default Sidebar;