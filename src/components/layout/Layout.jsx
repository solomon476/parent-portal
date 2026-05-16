import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CreditCard, PieChart, MessageSquare, LogOut, ChevronDown, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistant } from '../AIAssistant';

export const Layout = () => {
  const { data, parentChildren, activeChild, currentParent, language, t, switchChild, toggleLanguage, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const unreadCount = data.messages.filter(m => !m.read).length;

  return (
    <div className="app-container">
      {/* Top Nav */}
      <header className="top-nav">
        <h1 className="app-brand">
          Somobloom
        </h1>
        <div className="nav-actions">
          <button className="lang-switch" onClick={toggleLanguage}>
            {language === 'en' ? 'SW' : 'EN'}
          </button>

          {/* Profile button */}
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(v => !v)}
            aria-label="Open profile menu"
          >
            <span className="profile-avatar">{currentParent?.avatar}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      {/* Profile dropdown */}
      <AnimatePresence>
        {showProfileMenu && (
          <>
            <motion.div
              className="profile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileMenu(false)}
            />
            <motion.div
              className="profile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="profile-menu-header">
                <span className="profile-avatar-lg">{currentParent?.avatar}</span>
                <div>
                  <div className="profile-name">{currentParent?.name}</div>
                  <div className="profile-email">{currentParent?.email}</div>
                  <div className="profile-phone">{currentParent?.phone}</div>
                </div>
                <button className="close-menu-btn" onClick={() => setShowProfileMenu(false)}>
                  <X size={16} />
                </button>
              </div>
              <hr className="menu-divider" />
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Child Selector */}
      <div className="child-selector">
        <div className="child-selector-label">Viewing progress for:</div>
        <select
          className="child-select"
          value={activeChild?.id}
          onChange={(e) => switchChild(e.target.value)}
        >
          {parentChildren.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} — {child.grade}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div style={{ position: 'relative' }}>
              <item.icon size={24} />
              {item.path === '/messages' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

