import { memo } from 'react';
import { LoadingSpinner } from './LoadingSpinner.tsx';

interface CartFooterProps {
  totalPrice: number;
  isCheckingOut: boolean;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartFooter = memo(function CartFooter({
  totalPrice,
  isCheckingOut,
  onClearCart,
  onCheckout,
}: CartFooterProps) {
  const formattedTotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(totalPrice);

  return (
    <div className='border-t border-slate-700 p-6'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-lg font-semibold text-white'>Total:</span>
        <span className='text-2xl font-bold text-blue-400'>{formattedTotal}</span>
      </div>

      <div className='space-y-3'>
        <button
          onClick={onClearCart}
          disabled={isCheckingOut}
          className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors ${
            isCheckingOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Clear Cart
        </button>

        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isCheckingOut ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isCheckingOut ? (
            <>
              <LoadingSpinner />
              <span>Processing...</span>
            </>
          ) : (
            <span>Proceed to Checkout</span>
          )}
        </button>
      </div>
    </div>
  );
});
