import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CreditCard, PieChart, MessageSquare, LogOut, ChevronDown, User, Sun, Moon, Monitor, X, Edit3, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistant } from '../AIAssistant';
import SomoBloomLogo from './SomoBloomLogo';

export const Layout = () => {
  const { 
    data, 
    parentChildren, 
    activeChild, 
    currentParent, 
    language, 
    theme,
    t, 
    switchChild, 
    toggleLanguage, 
    updateTheme, 
    updateParentProfile,
    logout 
  } = useAppContext();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [newName, setNewName] = useState(currentParent?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t.dashboard },
    { path: '/pay', icon: CreditCard, label: t.payFees },
    { path: '/progress', icon: PieChart, label: t.progress },
    { path: '/messages', icon: MessageSquare, label: t.messages }
  ];

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsUpdating(true);
    const success = await updateParentProfile(newName.trim());
    setIsUpdating(false);
    if (success) {
      setShowEditProfileModal(false);
    }
  };

  const unreadCount = data.messages.filter(m => !m.read).length;

  return (
    <div className="app-container">
      
      {/* =========================================
         DESKTOP SIDEBAR (Visible > 768px)
         ========================================= */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">
          <SomoBloomLogo size={36} fontSize="20px" />
        </div>

        {/* Dynamic Child Selector Box */}
        <div className="child-selector-box">
          <div className="child-selector-label">{t.switchChild || "Viewing Progress For:"}</div>
          <div className="child-select-wrap">
            <select
              className="child-select"
              value={activeChild?.id || ''}
              onChange={(e) => switchChild(e.target.value)}
            >
              {parentChildren.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} — {child.grade}
                </option>
              ))}
            </select>
            <ChevronDown className="child-select-icon" size={16} />
          </div>
        </div>

        {/* Navigation Sidebar links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <item.icon size={20} />
                {item.path === '/messages' && unreadCount > 0 && (
                  <span className="nav-badge" style={{ right: '-12px', top: '-6px' }}>{unreadCount}</span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          {/* Theme switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', justifyContent: 'space-around' }}>
            <button 
              style={{ color: theme === 'light' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.4rem', borderRadius: '4px', background: theme === 'light' ? 'var(--surface)' : 'transparent', flex: 1, display: 'flex', justifyContent: 'center' }} 
              onClick={() => updateTheme('light')}
              title="Light Theme"
            >
              <Sun size={16} />
            </button>
            <button 
              style={{ color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.4rem', borderRadius: '4px', background: theme === 'dark' ? 'var(--surface)' : 'transparent', flex: 1, display: 'flex', justifyContent: 'center' }} 
              onClick={() => updateTheme('dark')}
              title="Dark Theme"
            >
              <Moon size={16} />
            </button>
            <button 
              style={{ color: theme === 'system' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.4rem', borderRadius: '4px', background: theme === 'system' ? 'var(--surface)' : 'transparent', flex: 1, display: 'flex', justifyContent: 'center' }} 
              onClick={() => updateTheme('system')}
              title="System Auto"
            >
              <Monitor size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="lang-switch" onClick={toggleLanguage} style={{ flex: 1, textAlign: 'center' }}>
              {language === 'en' ? 'SWA KISWAHILI' : 'ENG ENGLISH'}
            </button>
          </div>

          {/* Profile Widget */}
          <div className="sidebar-profile" onClick={() => setShowProfileMenu(v => !v)}>
            <div className="avatar-circle">
              {currentParent?.avatar || 'P'}
            </div>
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">{currentParent?.name || 'Parent Profile'}</div>
              <div className="sidebar-profile-role">{currentParent?.email || 'somobloom.com'}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />

            {/* Profile Context Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  className="profile-click-menu"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="profile-click-menu-header">
                    <div className="avatar-circle" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
                      {currentParent?.avatar || 'P'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{currentParent?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentParent?.phone || 'No Phone Registered'}</div>
                    </div>
                  </div>
                  <button className="profile-click-menu-btn" onClick={() => { setShowProfileMenu(false); setNewName(currentParent?.name || ''); setShowEditProfileModal(true); }}>
                    <Edit3 size={16} /> Edit Display Name
                  </button>
                  <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
                  <button className="profile-click-menu-btn logout" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* =========================================
         MOBILE TOP BAR (Visible < 768px)
         ========================================= */}
      <header className="top-nav">
        <SomoBloomLogo size={28} showText={true} fontSize="15px" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="lang-switch" onClick={toggleLanguage} style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>
            {language === 'en' ? 'SW' : 'EN'}
          </button>
          <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }} onClick={() => setShowProfileMenu(v => !v)}>
            {currentParent?.avatar || 'P'}
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                className="profile-click-menu"
                style={{ top: '4.5rem', right: '1rem', left: 'auto', bottom: 'auto' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="profile-click-menu-header">
                  <div className="avatar-circle" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                    {currentParent?.avatar || 'P'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{currentParent?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentParent?.email}</div>
                  </div>
                </div>
                
                {/* Mobile Child Switcher inside dropdown */}
                <div style={{ margin: '0.5rem 0 0.75rem 0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>STUDENT SELECTOR</div>
                  <select
                    className="child-select"
                    style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                    value={activeChild?.id || ''}
                    onChange={(e) => { switchChild(e.target.value); setShowProfileMenu(false); }}
                  >
                    {parentChildren.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', background: 'var(--bg-color)', padding: '0.2rem', borderRadius: '8px' }}>
                  <button style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', color: theme === 'light' ? 'var(--primary)' : 'var(--text-muted)', background: theme === 'light' ? 'var(--surface)' : 'transparent', borderRadius: '4px', display: 'flex', justifyContent: 'center' }} onClick={() => updateTheme('light')}><Sun size={12} /></button>
                  <button style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)', background: theme === 'dark' ? 'var(--surface)' : 'transparent', borderRadius: '4px', display: 'flex', justifyContent: 'center' }} onClick={() => updateTheme('dark')}><Moon size={12} /></button>
                  <button style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', color: theme === 'system' ? 'var(--primary)' : 'var(--text-muted)', background: theme === 'system' ? 'var(--surface)' : 'transparent', borderRadius: '4px', display: 'flex', justifyContent: 'center' }} onClick={() => updateTheme('system')}><Monitor size={12} /></button>
                </div>

                <button className="profile-click-menu-btn" onClick={() => { setShowProfileMenu(false); setNewName(currentParent?.name || ''); setShowEditProfileModal(true); }}>
                  <Edit3 size={14} /> Name Settings
                </button>
                <button className="profile-click-menu-btn logout" style={{ marginTop: '0.5rem' }} onClick={handleLogout}>
                  <LogOut size={14} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* =========================================
         MAIN APPLICATION AREA
         ========================================= */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* =========================================
         MOBILE BOTTOM NAV BAR (Visible < 768px)
         ========================================= */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              <item.icon size={22} />
              {item.path === '/messages' && unreadCount > 0 && (
                <span className="nav-badge" style={{ top: '-4px', right: '-8px' }}>{unreadCount}</span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* =========================================
         PROFILE EDIT DIALOG/MODAL
         ========================================= */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditProfileModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Edit Display Name</h3>
                <button onClick={() => setShowEditProfileModal(false)} style={{ padding: '0.25rem', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label>Full Display Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Solomon Makalio"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowEditProfileModal(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isUpdating || !newName.trim()}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant FAB and slide-drawer context */}
      <AIAssistant />
    </div>
  );
};
