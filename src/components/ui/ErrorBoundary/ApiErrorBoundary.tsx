import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ApiException } from '../../../types/api';
import { logger } from '../../../utils/logger';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onRetry?: () => void;
}

const DefaultApiErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => {
  const isApiError = error instanceof ApiException;

  return (
    <div className='min-h-[200px] flex items-center justify-center p-6'>
      <div className='text-center max-w-md'>
        <div className='text-red-500 text-5xl mb-4'>⚠️</div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {isApiError ? 'Service Unavailable' : 'Something went wrong'}
        </h3>
        <p className='text-gray-600 mb-4'>
          {isApiError ? error.message : 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={retry}
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export function ApiErrorBoundary({
  children,
  fallback: Fallback = DefaultApiErrorFallback,
  onRetry,
}: ApiErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    if (error instanceof ApiException) {
      logger.error('API Error caught by boundary', {
        code: error.code,
        status: error.status,
        message: error.message,
        details: error.details,
        errorInfo,
      });
    } else {
      logger.error('Non-API error caught by API boundary', { error, errorInfo });
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <ErrorBoundary
      fallback={(error: Error) => <Fallback error={error} retry={handleRetry} />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
