import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Clean SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Real-time Firestore Listener
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Format Timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }
    return 'Recent';
  };

  // Open Message and Mark as Read in Firestore
  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'Unread') {
      try {
        await updateDoc(doc(db, 'messages', msg.id), {
          status: 'Read'
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleCloseMessage = () => setSelectedMessage(null);

  // Delete message from Firestore
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message permanently?")) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message.");
      }
    }
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Message Inbox</h2>
        <p className="text-text-muted text-sm">
          Live real-time messages received from your portfolio contact form.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 mb-6 flex items-center gap-3">
        <div className="text-text-muted">
          <SearchIcon />
        </div>
        <input 
          type="text"
          placeholder="Search messages by sender name, email, or subject..."
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-text-muted/50 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Messages Content */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-text-muted">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading messages from database...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center text-text-muted">
            <p className="text-lg text-white mb-1">No messages found</p>
            <p className="text-sm">When visitors submit the contact form, their inquiries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-xs font-semibold text-text-muted uppercase">
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject & Preview</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {filteredMessages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => handleOpenMessage(msg)}
                    className={`hover:bg-surface/40 transition-colors cursor-pointer ${
                      msg.status === 'Unread' ? 'bg-primary/5 font-medium' : 'text-text-muted'
                    }`}
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">{msg.name}</div>
                      <div className="text-xs text-text-muted">{msg.email}</div>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="text-white truncate">{msg.subject || 'No Subject'}</div>
                      <div className="text-xs text-text-muted truncate">{msg.message}</div>
                    </td>
                    <td className="p-4 text-xs whitespace-nowrap">
                      {formatDate(msg.createdAt)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {msg.status === 'Unread' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          <MailIcon /> Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface text-text-muted border border-border">
                          <CheckCircleIcon /> Read
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => handleDelete(msg.id, e)}
                        title="Delete permanently"
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors inline-flex"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl overflow-hidden border border-border"
            >
              {/* Modal Top Header */}
              <div className="p-6 border-b border-border flex items-start justify-between bg-surface/50">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedMessage.subject || 'No Subject'}
                  </h3>
                  <p className="text-sm text-text-muted">
                    From: <span className="text-white font-medium">{selectedMessage.name}</span> ({selectedMessage.email})
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Received on: {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                <button 
                  onClick={handleCloseMessage} 
                  className="p-1.5 text-text-muted hover:text-white rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-6 min-h-[180px] max-h-[50vh] overflow-y-auto custom-scrollbar">
                <p className="text-white whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-4 md:p-6 border-t border-border bg-surface/50 flex items-center justify-between gap-4">
                <button 
                  onClick={(e) => handleDelete(selectedMessage.id, e)}
                  className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 hover:border-red-500 transition-colors inline-flex items-center gap-2"
                >
                  <TrashIcon />
                  <span>Delete</span>
                </button>

                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="btn-primary !py-2 !px-5 text-sm"
                >
                  <MailIcon />
                  <span>Reply via Email</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MessageManager;