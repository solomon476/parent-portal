import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { translations } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentParent, setCurrentParent] = useState(null);
  const [parentChildren, setParentChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [data, setData] = useState({ messages: [], announcements: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [language, setLanguage] = useState('en');

  const token = localStorage.getItem('parent_token');
  const isAuthenticated = !!token;

  const fetchParentData = useCallback(async () => {
    const activeToken = localStorage.getItem('parent_token');
    if (!activeToken) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/parent/me');
      const { students } = await api.get('/parent/students');
      
      const enrichedStudents = await Promise.all((students || []).map(async (student) => {
        let portfolio = [];
        try {
          const res = await api.get(`/parent/students/${student.id}/portfolio`);
          portfolio = res.portfolio || [];
        } catch (err) {
          console.warn(`Failed to fetch portfolio for student ${student.id}:`, err);
        }
        
        return {
          ...student,
          schoolwork: portfolio.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type === 'Assignment' ? 'pdf' : 'image',
            date: item.createdAt.split('T')[0],
            skill: item.tags && item.tags.length > 0 ? (item.tags[0] === 'EE' ? 'Exemplary' : item.tags[0] === 'ME' ? 'Proficient' : item.tags[0] === 'AE' ? 'Developing' : 'Beginning') : 'Proficient',
            feedback: item.description || 'No feedback yet.',
            imageUrl: item.imageUrl
          }))
        };
      }));

      setCurrentParent(profile);
      setParentChildren(enrichedStudents);
      if (students.length > 0 && !activeChildId) {
        setActiveChildId(students[0].id);
      }

      // Fetch live messages & announcements
      const [msgRes, annRes] = await Promise.all([
        api.get('/messages'),
        api.get('/parent/announcements')
      ]);

      setData(prev => ({
        ...prev,
        messages: msgRes.messages || [],
        announcements: annRes.announcements || []
      }));
    } catch (err) {
      console.error('Failed to fetch parent data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeChildId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchParentData();
    } else {
      setCurrentParent(null);
      setParentChildren([]);
      setData({ messages: [], announcements: [] });
    }
  }, [isAuthenticated, fetchParentData]);

  const activeChild = parentChildren.find(c => c.id === activeChildId) || parentChildren[0];
  const t = translations[language] || translations.en;

  const login = async (email, password) => {
    setLoginError('');
    try {
      const result = await api.post('/auth/login', { email, password });
      localStorage.setItem('parent_token', result.token);
      await fetchParentData();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setCurrentParent(null);
    setParentChildren([]);
    setData({ messages: [], announcements: [] });
    localStorage.removeItem('parent_token');
  };

  const switchChild = (id) => setActiveChildId(id);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'sw' : 'en');

  const markMessageRead = async (msgId) => {
    const activeToken = localStorage.getItem('parent_token');
    if (!activeToken) return;

    try {
      await api.put(`/messages/${msgId}/read`);
      setData(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === msgId ? { ...m, read: true } : m)
      }));
    } catch (err) {
      console.error('Failed to mark message read:', err);
    }
  };

  const sendMessage = async (receiverId, content, subject = 'Parent Communication') => {
    const activeToken = localStorage.getItem('parent_token');
    if (!activeToken) return false;

    try {
      const res = await api.post('/messages', {
        receiverId,
        subject,
        content
      });
      if (res.sentMessage) {
        setData(prev => ({
          ...prev,
          messages: [res.sentMessage, ...prev.messages]
        }));
      }
      return true;
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.message || 'Failed to send message');
      return false;
    }
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
      data,
      t,
      login,
      logout,
      switchChild,
      toggleLanguage,
      markMessageRead,
      sendMessage,
      refreshData: fetchParentData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
