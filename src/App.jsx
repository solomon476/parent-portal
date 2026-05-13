import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { PaymentFlow } from './pages/PaymentFlow';
import { ProgressViewer } from './pages/ProgressViewer';
import { MessagesHub } from './pages/MessagesHub';

// Guard component: redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route: redirects to / if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pay" element={<PaymentFlow />} />
            <Route path="progress" element={<ProgressViewer />} />
            <Route path="messages" element={<MessagesHub />} />
          </Route>
          {/* Catch all → go to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
