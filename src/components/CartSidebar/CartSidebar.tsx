import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { FiX, FiTrash2, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';

export function CartSidebar() {
  const { state, removeItem, clearCart, closeCart, getTotalPrice } = useCart();
  const { showSnackbar } = useSnackbar();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const totalPrice = priceBeforeVat * (1 + vat / 100);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsCheckingOut(false);
    showSnackbar('🎉 Checkout completed successfully!', 'success');
    clearCart();
  };

  const LoadingSpinner = () => (
    <div className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
  );

  if (!state.isOpen) return null;

  return (
    <>
      {}
      <div className='fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity' onClick={closeCart} />

      {}
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out'>
        <div className='flex flex-col h-full'>
          {}
          <div className='flex items-center justify-between p-6 border-b border-slate-700'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3'>
                <FiPackage className='w-4 h-4 text-white' />
              </div>
              <h2 className='text-xl font-bold text-white'>Your Cart</h2>
            </div>
            <button
              onClick={closeCart}
              className='p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700'
            >
              <FiX className='w-5 h-5' />
            </button>
          </div>

          {}
          <div className='flex-1 overflow-y-auto'>
            {state.items.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
                <div className='w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4'>
                  <FiPackage className='w-8 h-8 text-slate-400' />
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>Your cart is empty</h3>
                <p className='text-slate-400'>Add some skip bookings to get started</p>
              </div>
            ) : (
              <div className='p-6 space-y-4'>
                {state.items.map(item => (
                  <div key={item.id} className='bg-slate-700/50 rounded-xl p-4 border border-slate-600/50'>
                    {}
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3'>
                          <span className='text-slate-800 font-bold text-xs'>SKIP</span>
                        </div>
                        <div>
                          <h4 className='text-white font-semibold'>{item.skipSize} Yard Skip</h4>
                          <p className='text-slate-400 text-sm'>{item.hirePeriod} day hire</p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='text-lg font-bold text-blue-400'>{formatPrice(item.price, item.vat)}</span>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            showSnackbar('Item removed from cart', 'info');
                          }}
                          className='p-1 text-red-400 hover:text-red-300 transition-colors rounded'
                        >
                          <FiTrash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    {}
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center text-slate-300'>
                        <FiCalendar className='w-4 h-4 mr-2 text-slate-400' />
                        <span>Delivery: {formatDate(item.deliveryDate)}</span>
                      </div>
                      {item.collectionDate && (
                        <div className='flex items-center text-slate-300'>
                          <FiCalendar className='w-4 h-4 mr-2 text-slate-400' />
                          <span>Collection: {formatDate(item.collectionDate)}</span>
                        </div>
                      )}
                      <div className='flex items-center text-slate-300'>
                        <FiMapPin className='w-4 h-4 mr-2 text-slate-400' />
                        <span>{item.postcode}</span>
                      </div>
                      <div className='flex items-center text-slate-300'>
                        <FiPackage className='w-4 h-4 mr-2 text-slate-400' />
                        <span className='capitalize'>{item.wasteType} waste</span>
                      </div>
                    </div>

                    {}
                    <div className='mt-3 pt-3 border-t border-slate-600/50'>
                      <p className='text-slate-300 text-sm'>
                        <span className='font-medium'>Customer:</span> {item.customerDetails.name}
                      </p>
                      <p className='text-slate-400 text-xs'>{item.customerDetails.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          {state.items.length > 0 && (
            <div className='border-t border-slate-700 p-6'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-lg font-semibold text-white'>Total:</span>
                <span className='text-2xl font-bold text-blue-400'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(getTotalPrice())}
                </span>
              </div>

              <div className='space-y-3'>
                <button
                  onClick={() => {
                    clearCart();
                    showSnackbar('Cart cleared successfully', 'info');
                  }}
                  disabled={isCheckingOut}
                  className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors ${
                    isCheckingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
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
          )}
        </div>
      </div>
    </>
  );
}
