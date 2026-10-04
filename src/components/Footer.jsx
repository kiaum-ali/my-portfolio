import React from 'react';

// Custom SVGs for Social Icons
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7.1a5.1 5.1 0 0 0-1.5-3.89 4.9 4.9 0 0 0-.1-3.82s-1.13-.36-3.8 1.46a13.3 13.3 0 0 0-7 0C6.27 2.15 5.1 2.5 5.1 2.5a4.9 4.9 0 0 0-.1 3.82 5.1 5.1 0 0 0-1.5 3.89c0 5.7 3.36 6.75 6.5 7.1a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-10 mt-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo / Name */}
        <div className="text-xl font-bold tracking-tighter">
          <span className="text-text-main">Md Kiaum</span>
          <span className="text-gradient">Ali</span>
          <span className="text-primary">.</span>
        </div>

        {/* Copyright Text */}
        <div className="text-center md:text-left text-text-muted text-sm">
          <p>© 2026 [Md Kiaum Ali]. All Rights Reserved.</p>
          <p className="mt-1 text-xs">Built with React & Tailwind CSS</p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
            <GithubIcon />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
            <LinkedinIcon />
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;