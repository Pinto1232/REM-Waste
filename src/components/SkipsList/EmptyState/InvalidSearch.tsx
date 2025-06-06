import { WarningIcon } from '../icons.tsx';

export function InvalidSearch() {
  return (
    <div className='w-full'>
      <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 mx-4 sm:mx-0'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <WarningIcon className='h-5 w-5 text-yellow-400' />
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-yellow-800'>Search Parameters Required</h3>
            <p className='mt-1 text-sm text-yellow-700'>
              Please provide a postcode or area to search for available skips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
