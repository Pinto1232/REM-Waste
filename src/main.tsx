import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppProvider } from './context/AppProvider';
import { initializePerformanceMonitoring } from './utils/performance';
import { logger } from './utils/logger';

if (import.meta.env.PROD) {
  initializePerformanceMonitoring();
}

logger.info('Application starting', {
  version: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.MODE,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
