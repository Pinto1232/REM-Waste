import '@testing-library/jest-dom';
import { beforeAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock environment variables
beforeAll(() => {
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_APP_NAME: 'REM Waste Management',
      VITE_ENABLE_LOGGING: 'false',
      DEV: true,
    },
    writable: true,
  });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test utilities
interface MockResizeObserver {
  observe(): void;
  unobserve(): void;
  disconnect(): void;
}

const globalWithResizeObserver = globalThis as typeof globalThis & { 
  ResizeObserver: new () => MockResizeObserver 
};

globalWithResizeObserver.ResizeObserver = class ResizeObserver implements MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});