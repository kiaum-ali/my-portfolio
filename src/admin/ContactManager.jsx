import React, { useState, useEffect } from 'react';
import { Save, MapPin, Mail, Phone, MessageSquare } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const ContactManager = () => {
  const [loading, setLoading] = useState(false);
  
  const [contactData, setContactData] = useState({
    title: 'Get In Touch',
    subtitle: 'Have a project in mind or want to collaborate? Feel free to reach out!',
    email: '',
    phone: '',
    location: ''
  });

  // Firebase থেকে ডাটা Fetch করা
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactData({
            title: data.title || 'Get In Touch',
            subtitle: data.subtitle || 'Have a project in mind or want to collaborate? Feel free to reach out!',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || ''
          });
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };
    fetchContactData();
  }, []);

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  // Firebase এ সেভ করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact'), contactData);
      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Error saving contact data:", error);
      alert("Failed to update contact info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Contact Manager</h2>
        <p className="text-text-muted text-sm">Update your email, phone number, location, and contact section text.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Contact Details */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Contact Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm text-text-muted flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email" name="email" value={contactData.email} onChange={handleChange} required 
                placeholder="your.email@example.com" 
                className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm text-text-muted flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </label>
              <input 
                type="text" name="phone" value={contactData.phone} onChange={handleChange} required 
                placeholder="+880 1XXX XXXXXX" 
                className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
              />
            </div>

            {/* Location */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm text-text-muted flex items-center gap-2">
                <MapPin size={16} /> Location / Address
              </label>
              <input 
                type="text" name="location" value={contactData.location} onChange={handleChange} required 
                placeholder="Dhaka, Bangladesh" 
                className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Header Texts */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Section Header Texts</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-text-muted">Section Title</label>
              <input 
                type="text" name="title" value={contactData.title} onChange={handleChange} required 
                placeholder="Get In Touch" 
                className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-muted">Section Subtitle / Description</label>
              <textarea 
                name="subtitle" value={contactData.subtitle} onChange={handleChange} required 
                placeholder="Have a project in mind..."
                rows="3" 
                className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary custom-scrollbar"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className={`btn-primary px-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Save size={18} />
            <span>{loading ? 'Saving Data...' : 'Save Contact Info'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default ContactManager;