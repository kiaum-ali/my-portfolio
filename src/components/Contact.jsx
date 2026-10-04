import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Firebase imports (doc and onSnapshot added)
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Icons using clean SVGs to avoid any package conflicts
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

// Phone Icon (Newly added)
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const Contact = () => {
  // Firebase থেকে ডাইনামিক ডাটা রাখার জন্য স্টেট
  const [contactInfo, setContactInfo] = useState({
    title: 'Get In Touch',
    subtitle: "Have a project in mind or want to collaborate? Send me a message and let's create something extraordinary together.",
    email: 'your@email.com',
    phone: '',
    location: 'Dhaka, Bangladesh'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Firebase থেকে Real-time Data Fetch
  useEffect(() => {
    const docRef = doc(db, 'settings', 'contact');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContactInfo(prev => ({
          title: data.title || prev.title,
          subtitle: data.subtitle || prev.subtitle,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          location: data.location || prev.location
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Save message to Firebase Firestore 'messages' collection
      await addDoc(collection(db, 'messages'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
        status: 'Unread',
        createdAt: serverTimestamp()
      });

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. I will get back to you soon.'
      });

      // Clear the form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please check your internet connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // টাইটেলের শেষ শব্দটি Gradient করার জন্য হেল্পার ফাংশন
  const renderTitle = (fullTitle) => {
    const words = fullTitle.split(' ');
    if (words.length <= 1) return fullTitle;
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} <span className="text-gradient">{lastWord}</span>
      </>
    );
  };

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {renderTitle(contactInfo.title)}
          </motion.h2>
          <p className="text-text-muted max-w-xl mx-auto text-base whitespace-pre-line">
            {contactInfo.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Let's Talk</h3>
              <p className="text-text-muted leading-relaxed">
                I am open to freelance projects, engineering consultancies, IoT development, and full-time opportunities.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Dynamic Email */}
              <div className="flex items-center gap-4 glass-card p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <MailIcon />
                </div>
                <div>
                  <h4 className="text-sm text-text-muted font-medium">Email Address</h4>
                  <a href={`mailto:${contactInfo.email}`} className="text-white hover:text-primary transition-colors font-medium break-all">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Dynamic Phone (Only shows if phone number exists in database) */}
              {contactInfo.phone && (
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <PhoneIcon />
                  </div>
                  <div>
                    <h4 className="text-sm text-text-muted font-medium">Phone Number</h4>
                    <a href={`tel:${contactInfo.phone}`} className="text-white hover:text-primary transition-colors font-medium">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Dynamic Location */}
              <div className="flex items-center gap-4 glass-card p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <MapPinIcon />
                </div>
                <div>
                  <h4 className="text-sm text-text-muted font-medium">Location</h4>
                  <p className="text-white font-medium">
                    {contactInfo.location}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Side: Contact Form (Unchanged functionality) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-5">
              
              {/* Status Banner */}
              {status.message && (
                <div 
                  className={`p-4 rounded-xl text-sm border ${
                    status.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm text-text-muted font-medium">Your Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="John Doe"
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-xl p-3 text-white placeholder:text-text-muted/40 outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-text-muted font-medium">Your Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="john@example.com"
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full bg-surface border border-border rounded-xl p-3 text-white placeholder:text-text-muted/40 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-muted font-medium">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Project Collaboration"
                  value={formData.subject} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl p-3 text-white placeholder:text-text-muted/40 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-muted font-medium">Message *</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  required 
                  placeholder="Tell me about your project..."
                  value={formData.message} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl p-3 text-white placeholder:text-text-muted/40 outline-none focus:border-primary transition-colors custom-scrollbar"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full justify-center !py-3.5 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SendIcon />
                    Send Message
                  </span>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;