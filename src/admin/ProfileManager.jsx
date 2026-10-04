import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, User, Link as LinkIcon, FileText } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // .js যুক্ত করা হয়েছে এরর এড়ানোর জন্য

const ProfileManager = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Image Upload State
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop');
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    email: '',
    location: '',
    bio: '',
    github: '',
    linkedin: '',
    facebook: '',
    image: ''
  });

  // Fetch existing profile data from Firebase on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          if (data.image) {
            setImagePreview(data.image);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Cloudinary Image Upload Function
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately for better UX
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
      
      // Update form data with the secure URL from Cloudinary
      setProfileData(prev => ({ ...prev, image: uploadedImage.secure_url }));
      setImagePreview(uploadedImage.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image to Cloudinary.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save or update the 'profile' document in 'settings' collection
      await setDoc(doc(db, 'settings', 'profile'), profileData, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Profile Manager</h2>
        <p className="text-text-muted text-sm">Update your personal information, bio, and social links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Image & Basic Info */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <User size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Basic Information</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Image Upload Area */}
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
              {/* Hidden File Input */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                disabled={uploadingImage}
              />
              
              <div 
                onClick={() => !uploadingImage && fileInputRef.current.click()} 
                className={`w-40 h-40 rounded-full border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center overflow-hidden relative group transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
              >
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover or loading */}
                <div className={`absolute inset-0 bg-background/60 flex flex-col items-center justify-center transition-opacity ${uploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  ) : (
                    <Upload size={24} className="text-white mb-2" />
                  )}
                  <span className="text-xs text-white">
                    {uploadingImage ? 'Uploading...' : 'Change Photo'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-muted text-center">Click to upload new photo</p>
            </div>

            {/* Input Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-text-muted">Full Name</label>
                <input type="text" name="name" value={profileData.name} onChange={handleChange} required placeholder="e.g. Md Kiaum Ali" className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-muted">Professional Title (Comma separated)</label>
                <input type="text" name="title" value={profileData.title} onChange={handleChange} required placeholder="e.g. Electrical Engineer, Web Developer" className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-text-muted">Email Address</label>
                  <input type="email" name="email" value={profileData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-text-muted">Location</label>
                  <input type="text" name="location" value={profileData.location} onChange={handleChange} required placeholder="Dhaka, Bangladesh" className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Bio */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <FileText size={20} className="text-primary" />
            <h3 className="text-xl font-bold">About Me (Bio)</h3>
          </div>
          <div className="space-y-1">
            <textarea 
              name="bio" 
              value={profileData.bio} 
              onChange={handleChange} 
              required 
              placeholder="I build modern web applications..."
              rows="5" 
              className="w-full bg-surface border border-border p-4 rounded-lg text-white outline-none focus:border-primary custom-scrollbar"
            ></textarea>
          </div>
        </div>

        {/* Section 3: Social Links */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-border pb-4">
            <LinkIcon size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Social Links</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-text-muted">GitHub URL</label>
              <input type="url" name="github" value={profileData.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-muted">LinkedIn URL</label>
              <input type="url" name="linkedin" value={profileData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-muted">Facebook URL</label>
              <input type="url" name="facebook" value={profileData.facebook} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full bg-surface border border-border p-3 rounded-lg text-white outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading || uploadingImage} className={`btn-primary px-8 ${(loading || uploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Save size={18} />
            <span>{loading ? 'Saving Data...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileManager;