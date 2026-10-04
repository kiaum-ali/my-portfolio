import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Cpu, Star } from 'lucide-react'; // Star আইকন যুক্ত করা হয়েছে
// Firebase imports
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const About = () => {
  // Firebase থেকে ডাটা রাখার জন্য স্টেট (ডিফল্ট ডাটা দেওয়া আছে)
  const [aboutData, setAboutData] = useState({
    bio: 'I am a passionate Electrical Engineer and Web Developer with a deep interest in IoT. I love building solutions that merge physical hardware with digital intelligence. My goal is to create scalable, efficient, and user-centric applications that solve real-world problems.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    stats: [
      { id: 1, icon: 'Award', count: "10+", label: "Projects" },
      { id: 2, icon: 'Cpu', count: "5+", label: "Technologies" },
      { id: 3, icon: 'BookOpen', count: "IoT", label: "Projects" },
      { id: 4, icon: 'Users', count: "100%", label: "Passion" },
    ]
  });

  // রিয়েল-টাইম ডাটা Fetch করার জন্য useEffect (এখন 'about' ডকুমেন্ট থেকে ডাটা আসবে)
  useEffect(() => {
    const docRef = doc(db, 'settings', 'about');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutData((prev) => ({
          bio: data.bio || prev.bio,
          image: data.image || prev.image,
          // যদি ফায়ারবেসে stats থাকে এবং খালি না হয়, তবে সেটি নিবে
          stats: data.stats && data.stats.length > 0 ? data.stats : prev.stats,
        }));
      }
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  // স্ট্রিং আইকন নামকে আসল কম্পোনেন্টে পরিবর্তন করার হেল্পার ফাংশন
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu size={24} />;
      case 'BookOpen': return <BookOpen size={24} />;
      case 'Users': return <Users size={24} />;
      case 'Star': return <Star size={24} />;
      case 'Award':
      default: return <Award size={24} />;
    }
  };

  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden glass-card p-2">
              <img 
                src={aboutData.image} // ফায়ারবেস থেকে আসা ডাইনামিক ইমেজ
                alt="About Me" 
                className="w-full h-auto rounded-2xl shadow-glow"
              />
            </div>
            {/* Floating decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">About Me</h2>
            <p className="text-text-muted text-lg mb-6 leading-relaxed whitespace-pre-line">
              {aboutData.bio} {/* ফায়ারবেস থেকে আসা ডাইনামিক বায়ো */}
            </p>

            {/* Statistics (ডাইনামিক রেন্ডারিং) */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {aboutData.stats.map((stat) => (
                <div key={stat.id || stat.label} className="glass-card p-4 flex items-center gap-3 group hover:border-primary/50 transition-colors">
                  <div className="text-primary group-hover:scale-110 transition-transform">
                    {getIconComponent(stat.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{stat.count}</h3>
                    <p className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;