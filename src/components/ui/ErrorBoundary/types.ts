import type { ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;

  fallback?: ReactNode | ((error: Error) => ReactNode);

  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
