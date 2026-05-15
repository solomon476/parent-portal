import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../lib/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentParent, setCurrentParent] = useState(null);
  const [parentChildren, setParentChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [language, setLanguage] = useState('en');

  const token = localStorage.getItem('parent_token');
  const isAuthenticated = !!token;

  const fetchParentData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/parent/me');
      const { students } = await api.get('/parent/students');
      
      setCurrentParent(profile);
      setParentChildren(students);
      if (students.length > 0 && !activeChildId) {
        setActiveChildId(students[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch parent data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchParentData();
    } else {
      setCurrentParent(null);
      setParentChildren([]);
    }
  }, [isAuthenticated]);

  const activeChild = parentChildren.find(c => c.id === activeChildId) || parentChildren[0];

  const login = async (email, password) => {
    setLoginError('');
    try {
      const result = await api.post('/auth/login', { email, password });
      localStorage.setItem('parent_token', result.token);
      await fetchParentData();
      return true;
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const logout = () => {
    setCurrentParent(null);
    setParentChildren([]);
    localStorage.removeItem('parent_token');
  };

  const switchChild = (id) => setActiveChildId(id);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'sw' : 'en');

  const markMessageRead = (msgId) => {
    // Logic for marking messages read can be added here
  };

  return (
    <AppContext.Provider value={{
      activeChild,
      parentChildren,
      currentParent,
      language,
      isAuthenticated,
      isLoading,
      loginError,
      login,
      logout,
      switchChild,
      toggleLanguage,
      markMessageRead,
      refreshData: fetchParentData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
