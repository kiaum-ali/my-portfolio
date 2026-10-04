import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Firebase imports
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // আপনার ফায়ারবেস কনফিগারেশনের পাথ

const Skills = () => {
  // Firebase থেকে ডাটা রাখার জন্য স্টেট
  const [skills, setSkills] = useState([]);

  // রিয়েল-টাইম ডাটা Fetch করার জন্য useEffect
  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSkills(skillsData);
    });

    // Clean up function
    return () => unsubscribe();
  }, []);

  return (
    <section id="skills" className="py-20 bg-surface/10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Skills</h2>
          <p className="text-text-muted">Technologies and tools I work with to build solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.id} // index এর পরিবর্তে id ব্যবহার করা হয়েছে (React এর বেস্ট প্র্যাকটিস)
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-white">{skill.name}</span>
                <span className="text-primary text-sm">{skill.level}%</span>
              </div>
              <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-primary h-full rounded-full"
                />
              </div>
              <p className="text-xs text-text-muted mt-3">{skill.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;