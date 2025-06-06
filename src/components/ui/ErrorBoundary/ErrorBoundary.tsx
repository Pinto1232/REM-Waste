import { Component } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';
import './styles.css';

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    import('../../../utils/logger').then(({ logger }) => {
      logger.error('Uncaught error in ErrorBoundary', { error, errorInfo });
    });
    this.props.onError?.(error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error } = this.state;

      if (fallback) {
        if (typeof fallback === 'function' && error) {
          return fallback(error);
        } else if (typeof fallback !== 'function') {
          return fallback;
        }
      }

      return (
        <div className='error-boundary error-boundary-fallback'>
          <div className='error-boundary-content'>
            <h2 className='error-boundary-title'>Oops! Something went wrong</h2>
            <p className='error-boundary-message'>{error?.message}</p>
            <button
              className='error-boundary-button'
              onClick={() => this.setState({ hasError: false })}
              type='button'
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ErrorBoundaryBase;
