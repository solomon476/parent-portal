import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Parent Helper. How can I help you interpret your child\'s progress, fees, or messages today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { activeChild, t } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Logic Mock
    setTimeout(() => {
      let aiResponse = "I'm not sure about that. Try asking about your child's progress or fee balance.";
      const lowerInput = userText.toLowerCase();

      if (lowerInput.includes('progress') || lowerInput.includes('doing') || lowerInput.includes('grade')) {
        if (activeChild) {
          const subjects = Object.entries(activeChild.progress).map(([sub, level]) => `${sub} (${level})`).join(', ');
          aiResponse = `${activeChild.name} is currently working on: ${subjects}. If a subject says "Developing", it means they are still grasping the basics and could use some practice at home.`;
        }
      } else if (lowerInput.includes('fee') || lowerInput.includes('balance') || lowerInput.includes('pay')) {
        if (activeChild) {
          aiResponse = `The current fee balance for ${activeChild.name} is ${activeChild.fees.currency} ${activeChild.fees.totalBalance.toLocaleString()}. You can pay this from the 'Pay Fees' section.`;
        }
      } else if (lowerInput.includes('message') || lowerInput.includes('teacher')) {
        aiResponse = `You can communicate with the teachers in the Messages section. You currently have a few unread announcements.`;
      } else if (lowerInput.includes('developing') || lowerInput.includes('proficient')) {
         aiResponse = `"Beginning" means starting to learn. "Developing" means they are getting there but need practice. "Proficient" means they understand it well. "Exemplary" means they excel at it!`;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
         aiResponse = `Hi there! Ask me anything about ${activeChild?.name || 'your child'}'s school information.`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="ai-fab"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="ai-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} />
                <span style={{ fontWeight: 600 }}>AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
                <X size={20} />
              </button>
            </div>

            <div className="ai-chat-body">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-message-wrapper ${msg.sender}`}>
                  {msg.sender === 'ai' && <div className="ai-avatar"><Bot size={14} /></div>}
                  <div className={`ai-message ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="ai-message-wrapper ai">
                  <div className="ai-avatar"><Bot size={14} /></div>
                  <div className="ai-message ai typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="ai-chat-footer" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask about progress, fees..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
