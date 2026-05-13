import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, PieChart, MessageSquare, Bell, Upload, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { activeChild, data, t } = useAppContext();
  const navigate = useNavigate();

  if (!activeChild) return null;

  const unreadMessagesCount = data.messages.filter(m => !m.read).length;
  const uploadsCount = activeChild.schoolwork.length;
  const deadlinesCount = data.announcements.length;

  const stats = [
    { label: t.currentBalance, value: `${activeChild.fees.currency} ${activeChild.fees.totalBalance.toLocaleString()}`, icon: CreditCard, color: 'var(--danger)' },
    { label: t.unreadMessages, value: unreadMessagesCount, icon: MessageSquare, color: 'var(--warning)' },
    { label: t.recentUploads, value: uploadsCount, icon: Upload, color: 'var(--secondary)' },
    { label: t.upcomingDeadlines, value: deadlinesCount, icon: Calendar, color: 'var(--primary)' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <stat.icon size={16} style={{ color: stat.color }} />
              {stat.label}
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button className="btn-primary" onClick={() => navigate('/pay')}>
          <CreditCard size={24} />
          {t.payFees}
        </button>
        <button className="btn-secondary" onClick={() => navigate('/progress')}>
          <PieChart size={24} />
          {t.progress}
        </button>
        <button className="btn-secondary" onClick={() => navigate('/messages')}>
          <MessageSquare size={24} />
          {t.messages}
        </button>
      </div>

      <h2 className="section-title">{t.activityFeed}</h2>
      <div className="activity-list">
        {activeChild.schoolwork.map(sw => (
          <div key={sw.id} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/progress')}>
            <div className="activity-icon">
              <Upload size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>New Upload: {sw.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sw.date}</div>
            </div>
          </div>
        ))}
        {data.announcements.map(ann => (
          <div key={ann.id} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/messages')}>
            <div className="activity-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{ann.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{ann.date}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
