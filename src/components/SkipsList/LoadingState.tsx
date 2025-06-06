export function LoadingState() {
  return (
    <div className='text-center py-6 sm:py-8'>
      <div className='inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600' />
      <p className='mt-2 text-gray-600 text-sm sm:text-base'>Loading skips...</p>
    </div>
  );
}
