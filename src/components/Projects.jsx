import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Custom SVG Icons
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7.1a5.1 5.1 0 0 0-1.5-3.89 4.9 4.9 0 0 0-.1-3.82s-1.13-.36-3.8 1.46a13.3 13.3 0 0 0-7 0C6.27 2.15 5.1 2.5 5.1 2.5a4.9 4.9 0 0 0-.1 3.82 5.1 5.1 0 0 0-1.5 3.89c0 5.7 3.36 6.75 6.5 7.1a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore Listener
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-text-muted">Explore my latest work and technical solutions.</p>
        </motion.div>

        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="text-center text-text-muted py-12">
            <p className="text-lg">No projects found. Check back later!</p>
          </div>
        ) : (
          // Projects Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} // optimized delay
                viewport={{ once: true }} // animate only once for performance
                className="glass-card overflow-hidden group flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden shrink-0">
                  <img 
                    src={project.img} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-primary text-xs font-bold uppercase">{project.category}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-2">{project.title}</h3>
                  <p className="text-text-muted text-sm mb-4 flex-1">{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags && project.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-background px-2 py-1 rounded border border-border text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mt-auto">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-sm text-white hover:text-primary transition-colors"
                      >
                        <GithubIcon/> Code
                      </a>
                    )}
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-sm text-white hover:text-primary transition-colors"
                      >
                        <ExternalLinkIcon/> Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;