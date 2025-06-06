import { memo } from 'react';

export const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
  );
});
