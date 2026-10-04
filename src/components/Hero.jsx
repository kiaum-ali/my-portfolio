import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowDown, Code2, Cpu, Zap } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Custom Typewriter Effect Hook
const Typewriter = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const typeSpeed = isDeleting ? 50 : 100;
    const delay = isDeleting && currentText === '' ? 500 : 
                  !isDeleting && currentText === words[currentWordIndex] ? 2000 : typeSpeed;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === words[currentWordIndex]) {
        setIsDeleting(true);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        const nextText = isDeleting 
          ? words[currentWordIndex].substring(0, currentText.length - 1)
          : words[currentWordIndex].substring(0, currentText.length + 1);
        setCurrentText(nextText);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-gradient font-semibold">
      {currentText}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
};

// Custom SVG Icons to avoid Lucide export errors
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7.1a5.1 5.1 0 0 0-1.5-3.89 4.9 4.9 0 0 0-.1-3.82s-1.13-.36-3.8 1.46a13.3 13.3 0 0 0-7 0C6.27 2.15 5.1 2.5 5.1 2.5a4.9 4.9 0 0 0-.1 3.82 5.1 5.1 0 0 0-1.5 3.89c0 5.7 3.36 6.75 6.5 7.1a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Live Data from Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'profile'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsub(); // Cleanup listener on unmount
  }, []);

  // Process dynamic data or use fallbacks
  const defaultTitles = ["Web Developer", "Electrical Engineer"];
  const titles = profile?.title 
    ? profile.title.split(',').map(t => t.trim()).filter(Boolean) 
    : defaultTitles;

  const socialLinks = [];
  if (profile?.github) socialLinks.push({ icon: <GithubIcon />, link: profile.github });
  if (profile?.linkedin) socialLinks.push({ icon: <LinkedinIcon />, link: profile.linkedin });
  if (profile?.facebook) socialLinks.push({ icon: <FacebookIcon />, link: profile.facebook });
  if (profile?.email) socialLinks.push({ icon: <Mail size={20} />, link: `mailto:${profile.email}` });

  // If initial load is happening, you can show a subtle loading state or keep previous UI
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      {/* Background Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-6 text-center lg:text-left z-10"
          >
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-primary font-medium tracking-wider text-sm md:text-base uppercase"
            >
              Hello, I'm
            </motion.p>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main capitalize">
              {profile?.name || "Md Kiaum Ali"}
            </h1>
            
            <div className="text-2xl md:text-3xl h-10">
              <Typewriter words={titles} />
            </div>
            
            <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {profile?.bio || "I build modern web applications, digital experiences, and intelligent IoT solutions that bridge the gap between hardware and software."}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#projects" className="btn-primary">
                View My Work
              </a>
              {/* Dynamic CV Download Link */}
              <a href={profile?.cv || "/cv.pdf"} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Download CV
              </a>
            </div>
            
            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center lg:justify-start gap-5 pt-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Content - Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center items-center lg:justify-end mt-10 lg:mt-0"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Animated Glowing Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-purple-500/30"
              />
              
              {/* Dynamic Profile Image */}
              <div className="absolute inset-2 rounded-full overflow-hidden bg-surface border border-border shadow-glow">
                <img 
                  src={profile?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"} 
                  alt={profile?.name || "Profile"} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Floating Badges */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 md:-left-10 glass-card p-3 rounded-2xl flex items-center gap-2"
              >
                <Code2 className="text-blue-400" size={24} />
                <span className="text-sm font-semibold hidden md:block">Web Dev</span>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 -right-6 md:-right-10 glass-card p-3 rounded-2xl flex items-center gap-2"
              >
                <Cpu className="text-purple-400" size={24} />
                <span className="text-sm font-semibold hidden md:block">IoT/ESP32</span>
              </motion.div>

              <motion.div 
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 left-20 glass-card p-3 rounded-2xl flex items-center gap-2"
              >
                <Zap className="text-yellow-400" size={24} />
                <span className="text-sm font-semibold hidden md:block">Electronics</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-10 hidden md:flex"
      >
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-primary" />
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;