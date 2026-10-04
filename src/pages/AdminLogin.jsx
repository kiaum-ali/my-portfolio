import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Firebase Authentication Login
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error(err);
      // Firebase errors provide detailed messages, but we show a clean one
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      
      {/* Background Glowing Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 md:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-text-muted text-sm">Secure access to dashboard</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm text-text-muted font-medium ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-text-muted/50 outline-none focus:border-primary transition-colors"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm text-text-muted font-medium ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-10 text-white placeholder:text-text-muted/50 outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full justify-center mt-4 !py-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-text-muted hover:text-primary transition-colors">
            &larr; Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;