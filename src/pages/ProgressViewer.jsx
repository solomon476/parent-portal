import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Image as ImageIcon, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProgressViewer = () => {
  const { activeChild, t } = useAppContext();
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeTab, setActiveTab] = useState('progress'); // progress or gallery

  if (!activeChild) return null;

  const getTagClass = (skill) => {
    switch (skill) {
      case 'Beginning': return 'beginning';
      case 'Developing': return 'developing';
      case 'Proficient': return 'proficient';
      case 'Exemplary': return 'exemplary';
      default: return 'developing';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          {t.subjectProgress}
        </button>
        <button 
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          {t.schoolwork}
        </button>
      </div>

      {activeTab === 'progress' && (
        <div className="progress-grid">
          {Object.entries(activeChild.progress).map(([subject, level]) => (
            <div key={subject} className="progress-card">
              <div className="progress-header">
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{subject}</h3>
                <span className={`skill-tag ${getTagClass(level)}`}>{level}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: 'var(--primary)', 
                    width: level === 'Beginning' ? '25%' : level === 'Developing' ? '50%' : level === 'Proficient' ? '75%' : '100%' 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="schoolwork-gallery">
          {activeChild.schoolwork.length > 0 ? (
            activeChild.schoolwork.map(sw => (
              <div key={sw.id} className="sw-item" onClick={() => setSelectedWork(sw)}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                  {sw.type === 'image' ? <ImageIcon size={48} /> : <FileText size={48} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{sw.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{sw.date}</div>
                <span className={`skill-tag ${getTagClass(sw.skill)}`}>{sw.skill}</span>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No schoolwork uploaded yet.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{selectedWork.title}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedWork.date}</div>
                </div>
                <button onClick={() => setSelectedWork(null)} style={{ padding: '0.5rem' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: 'var(--bg-color)', height: '250px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                {selectedWork.imageUrl ? (
                  <img 
                    src={selectedWork.imageUrl.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8787'}${selectedWork.imageUrl}` : selectedWork.imageUrl} 
                    alt={selectedWork.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    {selectedWork.type === 'image' ? <ImageIcon size={64} color="var(--text-muted)" /> : <FileText size={64} color="var(--text-muted)" />}
                    <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>Preview Not Available</span>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Teacher Feedback</h4>
                <p style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)', margin: 0 }}>
                  "{selectedWork.feedback}"
                </p>
              </div>

              <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.875rem', color: '#D97706', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={16} /> Ways to Support at Home
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400E' }}>
                  Ask {activeChild.name} to explain what they learned. Practice related activities together for 10 minutes a day.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
