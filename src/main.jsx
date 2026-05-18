import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('[PWA] Parent Portal Service Worker registered successfully: ', registration);
    }).catch(registrationError => {
      console.log('[PWA] Parent Portal Service Worker registration failed: ', registrationError);
    });
  });
}
