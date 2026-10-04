import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState(''); // State to hold dynamic CV URL

  // Fetch Live CV Data from Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'profile'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.cv) {
          setCvUrl(data.cv);
        }
      }
    });

    return () => unsub(); // Cleanup listener on unmount
  }, []);

  // Scroll event listener for glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/70 backdrop-blur-glass border-b border-border shadow-glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="text-2xl font-bold tracking-tighter">
            <span className="text-text-main">Md Kiaum</span>
            <span className="text-gradient">Ali
            </span>
            <span className="text-primary">.</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Dynamic Download CV Button */}
            <a href={cvUrl || "/cv.pdf"} target="_blank" rel="noopener noreferrer" className="btn-primary py-2 px-5 text-sm">
              <Download size={16} />
              <span>Resume</span>
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-text-main p-2 hover:bg-surfaceHover rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-glass border-b border-border shadow-glass md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-muted hover:text-white hover:bg-surfaceHover p-3 rounded-lg transition-all duration-300 font-medium"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Dynamic Download CV Button for Mobile */}
              <a 
                href={cvUrl || "/cv.pdf"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary mt-2 justify-center"
              >
                <Download size={18} />
                <span>Download CV</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;