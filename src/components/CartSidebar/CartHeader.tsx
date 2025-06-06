import { memo } from 'react';
import { FiX, FiPackage } from 'react-icons/fi';

interface CartHeaderProps {
  onClose: () => void;
}

export const CartHeader = memo(function CartHeader({ onClose }: CartHeaderProps) {
  return (
    <div className='flex items-center justify-between p-6 border-b border-slate-700'>
      <div className='flex items-center'>
        <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3'>
          <FiPackage className='w-4 h-4 text-white' />
        </div>
        <h2 className='text-xl font-bold text-white'>Your Cart</h2>
      </div>
      <button
        onClick={onClose}
        className='p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700'
        aria-label='Close cart'
      >
        <FiX className='w-5 h-5' />
      </button>
    </div>
  );
});
