import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Bell, Calendar, Send, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MessagesHub = () => {
  const { data, t, markMessageRead, sendMessage, activeChild } = useAppContext();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replySent, setReplySent] = useState(false);
  const [replyValue, setReplyValue] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingStatus, setMeetingStatus] = useState('idle'); // idle | loading | success

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyValue) return;

    // Use quick reply label mapping
    const quickReplies = {
      received: 'Message received, thank you.',
      working: 'We will work on this at home.',
      meeting: "I'd like to schedule a meeting to discuss.",
      acknowledged: "Acknowledged. We'll follow up."
    };
    const replyText = quickReplies[replyValue] || replyValue;

    const recipientId = selectedMsg.senderId;
    setReplySent(true);

    const success = await sendMessage(recipientId, replyText, `Re: ${selectedMsg.subject || 'Direct Message'}`);
    if (success) {
      setTimeout(() => {
        setSelectedMsg(null);
        setReplySent(false);
        setReplyValue('');
      }, 2000);
    } else {
      setReplySent(false);
    }
  };

  const handleRequestSlot = async (e) => {
    e.preventDefault();
    if (!meetingDate) return;

    if (!activeChild || !activeChild.teacherUserId) {
      alert('No teacher assigned to this child yet.');
      return;
    }

    setMeetingStatus('loading');

    const messageText = `Hello ${activeChild.teacherName || 'Teacher'}, I would like to request a parent-teacher meeting regarding ${activeChild.name} on ${meetingDate}. Please let me know if this slot is convenient for you.`;

    const success = await sendMessage(activeChild.teacherUserId, messageText, 'Parent-Teacher Meeting Request');
    if (success) {
      setMeetingStatus('success');
      setTimeout(() => {
        setMeetingStatus('idle');
        setMeetingDate('');
      }, 3000);
    } else {
      setMeetingStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          <Mail size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'text-bottom' }} />
          {t.inbox}
          {data.messages.filter(m => !m.read).length > 0 && (
            <span className="tab-badge">{data.messages.filter(m => !m.read).length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <Bell size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'text-bottom' }} />
          {t.announcements}
        </button>
      </div>

      {/* Inbox */}
      {activeTab === 'inbox' && (
        <div className="msg-list">
          {data.messages.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <p>No messages yet.</p>
            </div>
          ) : (
            data.messages.map(msg => (
              <motion.div
                key={msg.id}
                className={`msg-item ${!msg.read ? 'unread' : ''}`}
                onClick={() => {
                  if (!msg.read) markMessageRead(msg.id);
                  setSelectedMsg(msg);
                }}
                style={{ cursor: 'pointer' }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {!msg.read && <span className="unread-dot" />}
                    <span style={{ fontWeight: 600 }}>{msg.sender}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.date}</span>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.text}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Announcements */}
      {activeTab === 'announcements' && (
        <div>
          <div className="announcements-list">
            {data.announcements.map(ann => (
              <div key={ann.id} className="msg-item" style={{ borderLeft: '4px solid var(--warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{ann.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>{ann.details}</p>
              </div>
            ))}
          </div>

          {/* Meeting Request Form */}
          <div style={{ marginTop: '1.5rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Calendar size={20} color="var(--primary)" />
              Request a Meeting
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Choose a preferred date and we will confirm your slot with the class teacher.
            </p>

            {meetingStatus === 'success' ? (
              <motion.div
                className="success-banner"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check size={20} />
                Meeting request sent! The teacher will confirm within 24 hours.
              </motion.div>
            ) : (
              <form onSubmit={handleRequestSlot}>
                <div className="form-group">
                  <label className="meeting-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={meetingStatus === 'loading'}
                >
                  {meetingStatus === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="login-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                      Sending Request...
                    </span>
                  ) : (
                    <>
                      <Calendar size={16} />
                      Request Slot
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedMsg.sender}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedMsg.date}</span>
                </div>
              </div>
              <p style={{ margin: '1rem 0 1.5rem 0', lineHeight: 1.7, color: 'var(--text-main)' }}>
                {selectedMsg.text}
              </p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Quick Reply</h4>

                {replySent ? (
                  <motion.div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 600 }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check size={20} /> Reply sent successfully!
                  </motion.div>
                ) : (
                  <form onSubmit={handleReply}>
                    <div className="form-group">
                      <select
                        className="form-control"
                        value={replyValue}
                        onChange={e => setReplyValue(e.target.value)}
                        required
                      >
                        <option value="">Select a response...</option>
                        <option value="received">Message received, thank you.</option>
                        <option value="working">We will work on this at home.</option>
                        <option value="meeting">I'd like to schedule a meeting to discuss.</option>
                        <option value="acknowledged">Acknowledged. We'll follow up.</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => { setSelectedMsg(null); setReplyValue(''); }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        <Send size={16} /> Send
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
