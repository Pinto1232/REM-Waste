import { memo } from 'react';
import { FiPackage } from 'react-icons/fi';

export const EmptyCart = memo(function EmptyCart() {
  return (
    <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
      <div className='w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4'>
        <FiPackage className='w-8 h-8 text-slate-400' />
      </div>
      <h3 className='text-lg font-semibold text-white mb-2'>Your cart is empty</h3>
      <p className='text-slate-400'>Add some skip bookings to get started</p>
    </div>
  );
});
