import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, FileText, Plus, Trash2, BarChart2, Image as ImageIcon } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const AboutManager = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop');
  
  const [aboutData, setAboutData] = useState({
    bio: '',
    image: '',
    stats: []
  });

  // নতুন Stat যুক্ত করার জন্য স্টেট
  const [newStat, setNewStat] = useState({ count: '', label: '', icon: 'Award' });

  // Firebase থেকে ডাটা Fetch করা
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData({
            bio: data.bio || '',
            image: data.image || '',
            stats: data.stats || []
          });
          if (data.image) setImagePreview(data.image);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  // Cloudinary Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "rsulfaqk"); // Your Cloudinary preset
    data.append("cloud_name", "jws9pq7j");    // Your Cloudinary cloud name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/jws9pq7j/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      
      setAboutData(prev => ({ ...prev, image: uploadedImage.secure_url }));
      setImagePreview(uploadedImage.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Stat Add Handler
  const handleAddStat = () => {
    if (!newStat.count || !newStat.label) {
      alert("Please fill both count and label!");
      return;
    }
    setAboutData({
      ...aboutData,
      stats: [...aboutData.stats, { ...newStat, id: Date.now() }]
    });
    setNewStat({ count: '', label: '', icon: 'Award' }); // Reset form
  };

  // Stat Delete Handler
  const handleDeleteStat = (id) => {
    setAboutData({
      ...aboutData,
      stats: aboutData.stats.filter(stat => stat.id !== id)
    });
  };

  // Firebase এ সেভ করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'about'), aboutData);
      alert("About section updated successfully!");
    } catch (error) {
      console.error("Error saving about data:", error);
      alert("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">About Manager</h2>
        <p className="text-text-muted text-sm">Manage your About section's image, bio, and statistics.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Image and Bio */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <FileText size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Image & Biography</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Upload */}
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
              <input 
                type="file" accept="image/*" ref={fileInputRef} 
                onChange={handleImageChange} className="hidden" disabled={uploadingImage}
              />
              <div 
                onClick={() => !uploadingImage && fileInputRef.current.click()} 
                className={`w-48 h-48 rounded-xl border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center overflow-hidden relative group transition-colors ${uploadingImage ? 'opacity-50' : 'cursor-pointer hover:border-primary'}`}
              >
                <img src={imagePreview} alt="About" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-background/60 flex flex-col items-center justify-center transition-opacity ${uploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  ) : (
                    <Upload size={24} className="text-white mb-2" />
                  )}
                  <span className="text-xs text-white">{uploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                </div>
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="w-full md:w-2/3">
              <label className="text-sm text-text-muted block mb-2">About Me (Bio)</label>
              <textarea 
                value={aboutData.bio} 
                onChange={(e) => setAboutData({...aboutData, bio: e.target.value})} 
                placeholder="Write about yourself..."
                rows="8" 
                className="w-full bg-surface border border-border p-4 rounded-lg text-white outline-none focus:border-primary custom-scrollbar"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 2: Statistics Manager */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <BarChart2 size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Statistics (e.g., Projects, Tech)</h3>
          </div>

          {/* Add New Stat Form */}
          <div className="flex flex-wrap items-end gap-4 mb-6 bg-surface/50 p-4 rounded-lg border border-border">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-text-muted mb-1 block">Count (e.g. 10+)</label>
              <input 
                type="text" value={newStat.count} onChange={(e) => setNewStat({...newStat, count: e.target.value})}
                className="w-full bg-surface border border-border p-2 rounded text-white outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-text-muted mb-1 block">Label (e.g. Projects)</label>
              <input 
                type="text" value={newStat.label} onChange={(e) => setNewStat({...newStat, label: e.target.value})}
                className="w-full bg-surface border border-border p-2 rounded text-white outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-text-muted mb-1 block">Icon</label>
              <select 
                value={newStat.icon} onChange={(e) => setNewStat({...newStat, icon: e.target.value})}
                className="w-full bg-surface border border-border p-2 rounded text-white outline-none focus:border-primary"
              >
                <option className="bg-gray-900 text-white" value="Award">Award</option>
                <option className="bg-gray-900 text-white" value="Cpu">Technology (CPU)</option>
                <option className="bg-gray-900 text-white" value="BookOpen">Book / Education</option>
                <option className="bg-gray-900 text-white" value="Users">Users / Clients</option>
                <option className="bg-gray-900 text-white" value="Star">Star</option>
              </select>
            </div>
            <button onClick={handleAddStat} className="btn-primary !py-2 !px-4 h-[42px]">
              <Plus size={18} /> Add
            </button>
          </div>

          {/* Current Stats List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {aboutData.stats.map((stat) => (
              <div key={stat.id} className="bg-surface border border-border p-4 rounded-lg flex justify-between items-center group">
                <div>
                  <h4 className="text-xl font-bold text-white">{stat.count}</h4>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
                <button onClick={() => handleDeleteStat(stat.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {aboutData.stats.length === 0 && (
              <p className="text-text-muted text-sm col-span-full">No statistics added yet.</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading || uploadingImage} className={`btn-primary px-8 ${(loading || uploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save About Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;