import { Component } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';
import './styles.css';

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    // eslint-disable-next-line no-console
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='error-boundary error-boundary-fallback'>
            <div className='error-boundary-content'>
              <h2 className='error-boundary-title'>Oops! Something went wrong</h2>
              <p className='error-boundary-message'>{this.state.error?.message}</p>
              <button
                className='error-boundary-button'
                onClick={() => this.setState({ hasError: false })}
                type='button'
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ErrorBoundaryBase;
