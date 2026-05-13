import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockData, translations } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(mockData);
  const [activeChildId, setActiveChildId] = useState(mockData.children[0].id);
  const [language, setLanguage] = useState('en');
  const [currentParent, setCurrentParent] = useState(() => {
    const saved = sessionStorage.getItem('eduportal_parent');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState('');

  const isAuthenticated = !!currentParent;

  // Filter children to only those belonging to the logged-in parent
  const parentChildren = isAuthenticated
    ? data.children.filter(c => currentParent.childIds.includes(c.id))
    : [];

  const activeChild = parentChildren.find(c => c.id === activeChildId) || parentChildren[0];

  useEffect(() => {
    // When parent logs in, default to their first child
    if (currentParent && parentChildren.length > 0) {
      setActiveChildId(parentChildren[0].id);
    }
  }, [currentParent?.id]);

  const t = translations[language];

  const login = (email, password) => {
    setLoginError('');
    // Basic validation: need a valid email format and password of at least 4 characters
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 4) {
      setLoginError('Password must be at least 4 characters.');
      return false;
    }
    // Build initials from the email username
    const username = email.split('@')[0];
    const initials = username.slice(0, 2).toUpperCase();
    const parent = {
      id: 'parent-session',
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: email,
      phone: '',
      avatar: initials,
      childIds: mockData.children.map(c => c.id)
    };
    setCurrentParent(parent);
    sessionStorage.setItem('eduportal_parent', JSON.stringify(parent));
    return true;
  };

  const logout = () => {
    setCurrentParent(null);
    sessionStorage.removeItem('eduportal_parent');
  };

  const switchChild = (id) => setActiveChildId(id);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'sw' : 'en');

  const addPayment = (childId, amount, method) => {
    setData(prev => {
      const newData = { ...prev, children: prev.children.map(c => ({ ...c })) };
      const childIndex = newData.children.findIndex(c => c.id === childId);
      if (childIndex !== -1) {
        newData.children[childIndex] = {
          ...newData.children[childIndex],
          fees: {
            ...newData.children[childIndex].fees,
            history: [
              {
                id: `tx-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount: Number(amount),
                ref: `${method.toUpperCase()}-${Math.floor(Math.random() * 90000 + 10000)}`,
                status: 'Successful'
              },
              ...newData.children[childIndex].fees.history
            ],
            totalBalance: Math.max(0, newData.children[childIndex].fees.totalBalance - Number(amount))
          }
        };
      }
      return newData;
    });
  };

  const markMessageRead = (msgId) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === msgId ? { ...m, read: true } : m)
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      activeChild,
      parentChildren,
      currentParent,
      language,
      t,
      isAuthenticated,
      loginError,
      login,
      logout,
      switchChild,
      toggleLanguage,
      addPayment,
      markMessageRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
