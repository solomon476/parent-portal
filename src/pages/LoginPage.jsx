import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, GraduationCap, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { login, loginError } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password) return;
    setIsLoading(true);
    
    const success = await login(email, password);
    setIsLoading(false);
    if (success) navigate('/');
  };



  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap size={32} />
          </div>
          <h1 className="login-title">Somobloom</h1>
          <p className="login-subtitle">Parent Access Portal</p>
          <p className="login-tagline">Sign in to monitor your child's learning journey</p>
        </div>

        {/* Error Banner */}
        {loginError && (
          <motion.div
            className="login-error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle size={18} />
            <span>{loginError}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">Email Address</label>
            <div className={`login-input-wrap ${touched.email && !email ? 'has-error' : ''}`}>
              <Mail size={18} className="field-icon" />
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                autoComplete="email"
              />
            </div>
            {touched.email && !email && <span className="field-error">Email is required</span>}
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <div className={`login-input-wrap ${touched.password && !password ? 'has-error' : ''}`}>
              <Lock size={18} className="field-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Your password (min. 4 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && !password && <span className="field-error">Password is required</span>}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>



        <p className="login-footer">
          Somobloom School Management System &copy; 2026
        </p>
      </motion.div>
    </div>
  );
};
