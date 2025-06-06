import { ErrorIcon } from './icons.tsx';

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className='bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 mb-4 sm:mb-6 mx-4 sm:mx-0'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ErrorIcon className='h-4 w-4 sm:h-5 sm:w-5 text-red-400' />
        </div>
        <div className='ml-2 sm:ml-3'>
          <h3 className='text-xs sm:text-sm font-medium text-red-800'>Error loading skips</h3>
          <p className='mt-1 text-xs sm:text-sm text-red-700'>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={onRetry}
            className='mt-2 text-xs sm:text-sm bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded hover:bg-red-200 transition-colors'
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
