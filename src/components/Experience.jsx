import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Firebase imports
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // আপনার ফায়ারবেস কনফিগারেশনের পাথ

const Experience = () => {
  // Firebase থেকে ডাটা রাখার জন্য স্টেট
  const [experiences, setExperiences] = useState([]);

  // রিয়েল-টাইম ডাটা Fetch করার জন্য useEffect
  useEffect(() => {
    const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExperiences(expData);
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience & Education</h2>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id} // index এর পরিবর্তে Firebase এর id ব্যবহার করা হয়েছে
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-6 flex flex-col md:flex-row gap-4 border-l-4 border-primary"
            >
              <div className="md:w-1/4">
                <span className="text-primary font-bold">{exp.year}</span>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <h4 className="text-text-muted mb-2">{exp.org}</h4>
                <p className="text-text-muted text-sm">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;