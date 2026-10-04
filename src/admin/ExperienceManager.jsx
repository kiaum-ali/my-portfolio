import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Briefcase } from 'lucide-react';
// Firebase imports
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // আপনার ফায়ারবেস কনফিগারেশনের পাথ

const ExperienceManager = () => {
  // Firebase থেকে রিয়েল-টাইম ডাটা আসবে, তাই শুরুতে এরে খালি রাখা হলো
  const [experiences, setExperiences] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', org: '', year: '', desc: '' });
  const [editId, setEditId] = useState(null);

  // Firebase থেকে ডাটা Fetch করার জন্য useEffect
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

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setFormData({ title: exp.title, org: exp.org, year: exp.year, desc: exp.desc });
      setEditId(exp.id);
    } else {
      setFormData({ title: '', org: '', year: '', desc: '' });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', org: '', year: '', desc: '' });
    setEditId(null);
  };

  // Firebase এ ডাটা Save এবং Update করার লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing experience
        const expRef = doc(db, 'experiences', editId);
        await updateDoc(expRef, formData);
        alert("Experience updated successfully!");
      } else {
        // Add new experience
        await addDoc(collection(db, 'experiences'), {
          ...formData,
          createdAt: new Date()
        });
        alert("Experience saved successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving experience: ", error);
      alert("Something went wrong!");
    }
  };

  // Firebase থেকে ডাটা Delete করার লজিক
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, 'experiences', id));
      } catch (error) {
        console.error("Error deleting experience: ", error);
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Experience & Education</h2>
          <p className="text-text-muted text-sm">Manage your career timeline, work experience, and educational background.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} />
          <span>Add New Timeline</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-primary group"
          >
            <div className="space-y-1">
              <span className="text-primary font-bold text-sm">{exp.year}</span>
              <h3 className="text-xl font-bold text-white">{exp.title}</h3>
              <h4 className="text-text-muted font-medium">{exp.org}</h4>
              <p className="text-text-muted text-sm max-w-2xl">{exp.desc}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleOpenModal(exp)}
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => handleDelete(exp.id)}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                <div className="flex items-center gap-2 text-white">
                  <Briefcase size={20} className="text-primary" />
                  <h3 className="text-xl font-bold">{editId ? 'Edit Timeline' : 'Add New Timeline'}</h3>
                </div>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Form */}
              <div className="p-6">
                <form id="expForm" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-text-muted">Title / Degree</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. Web Developer or B.Sc in CSE"
                      className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary"
                      value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-text-muted">Organization / Institute</label>
                      <input 
                        type="text" required 
                        placeholder="Company or University name"
                        className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary"
                        value={formData.org} onChange={(e) => setFormData({...formData, org: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-text-muted">Duration / Year</label>
                      <input 
                        type="text" required 
                        placeholder="e.g. 2022 - Present"
                        className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary"
                        value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-text-muted">Description</label>
                    <textarea 
                      rows="3" required
                      placeholder="Brief details about what you achieved or learned..."
                      className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary custom-scrollbar"
                      value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    ></textarea>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-surface/50 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="btn-outline !py-2">Cancel</button>
                <button type="submit" form="expForm" className="btn-primary !py-2">Save Timeline</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExperienceManager;