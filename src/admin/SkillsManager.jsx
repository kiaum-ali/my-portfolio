import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';
// Firebase imports
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // আপনার ফায়ারবেস কনফিগারেশনের পাথ অনুযায়ী ঠিক করে নিন

// আগে থেকে থাকা ক্যাটাগরিগুলো
const predefinedCategories = ['Frontend', 'Backend', 'Database', 'Hardware', 'Tools'];

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Frontend', level: 50 });
  const [editId, setEditId] = useState(null);

  // কাস্টম ক্যাটাগরি ট্র‍্যাক করার জন্য নতুন স্টেট
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dropdownCategory, setDropdownCategory] = useState('Frontend');

  // Firebase থেকে ডাটা Fetch করার জন্য useEffect
  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSkills(skillsData);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setFormData({ name: skill.name, category: skill.category, level: skill.level });
      setEditId(skill.id);
      
      // চেক করা হচ্ছে স্কিলের ক্যাটাগরিটা কি ডিফল্ট নাকি কাস্টম
      if (predefinedCategories.includes(skill.category)) {
        setIsCustomCategory(false);
        setDropdownCategory(skill.category);
      } else {
        setIsCustomCategory(true);
        setDropdownCategory('Custom');
      }
    } else {
      setFormData({ name: '', category: 'Frontend', level: 50 });
      setEditId(null);
      setIsCustomCategory(false);
      setDropdownCategory('Frontend');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', category: 'Frontend', level: 50 });
    setEditId(null);
    setIsCustomCategory(false);
    setDropdownCategory('Frontend');
  };

  // Firebase এ ডাটা Save এবং Update করার লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const skillRef = doc(db, 'skills', editId);
        await updateDoc(skillRef, formData);
        alert("Skill updated successfully!");
      } else {
        await addDoc(collection(db, 'skills'), {
          ...formData,
          createdAt: new Date()
        });
        alert("Skill saved successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving skill: ", error);
      alert("Something went wrong!");
    }
  };

  // Firebase থেকে ডাটা Delete করার লজিক
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteDoc(doc(db, 'skills', id));
      } catch (error) {
        console.error("Error deleting skill: ", error);
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Skills Manager</h2>
          <p className="text-text-muted text-sm">Add, update, and organize your technical skills.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <motion.div 
            key={skill.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-t-2 border-primary group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                <span className="text-xs bg-surface border border-border text-text-muted px-2 py-1 rounded-full mt-2 inline-block">
                  {skill.category}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(skill)} className="text-blue-400 hover:text-blue-300 p-1">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-muted">Proficiency</span>
                <span className="text-primary font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                <div 
                  className="bg-gradient-primary h-full rounded-full" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                <div className="flex items-center gap-2 text-white">
                  <Star size={20} className="text-primary" />
                  <h3 className="text-xl font-bold">{editId ? 'Edit Skill' : 'Add New Skill'}</h3>
                </div>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form id="skillForm" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-text-muted">Skill Name</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. React.js, ESP32"
                      className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  {/* Category Selection with Custom Option */}
                  <div className="space-y-1">
                    <label className="text-sm text-text-muted">Category</label>
                    <select 
                      className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary"
                      value={dropdownCategory} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setDropdownCategory(val);
                        if (val === 'Custom') {
                          setIsCustomCategory(true);
                          setFormData({ ...formData, category: '' }); // কাস্টম ইনপুটের জন্য ক্লিয়ার করা হলো
                        } else {
                          setIsCustomCategory(false);
                          setFormData({ ...formData, category: val });
                        }
                      }}
                    >
                      <option className="bg-gray-900 text-white" value="Frontend">Frontend</option>
                      <option className="bg-gray-900 text-white" value="Backend">Backend</option>
                      <option className="bg-gray-900 text-white" value="Database">Database</option>
                      <option className="bg-gray-900 text-white" value="Hardware">Hardware / IoT</option>
                      <option className="bg-gray-900 text-white" value="Tools">Tools & Others</option>
                      <option className="bg-gray-900 text-white font-bold text-primary" value="Custom">+ Custom (Type your own)</option>
                    </select>

                    {/* Custom Category Input Field (Smooth Animation) */}
                    <AnimatePresence>
                      {isCustomCategory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2"
                        >
                          <input 
                            type="text" required 
                            placeholder="Enter custom category name"
                            className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-text-muted">Proficiency Level</label>
                      <span className="text-primary font-bold">{formData.level}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" step="5"
                      className="w-full accent-primary"
                      value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-surface/50 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="btn-outline !py-2">Cancel</button>
                <button type="submit" form="skillForm" className="btn-primary !py-2">Save Skill</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SkillsManager;