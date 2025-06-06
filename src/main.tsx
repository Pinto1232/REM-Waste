import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppProvider } from './context/AppProvider';
import { initializePerformanceMonitoring } from './utils/performance';
import { initializeCompressionMonitoring } from './utils/compression-middleware';
import { logger } from './utils/logger';

if (import.meta.env.PROD) {
  initializePerformanceMonitoring();
}

initializeCompressionMonitoring();

logger.info('Application starting', {
  version: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.MODE,
});

const rootElement = document.getElementById('root')!;

rootElement.innerHTML = '';

createRoot(rootElement).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);