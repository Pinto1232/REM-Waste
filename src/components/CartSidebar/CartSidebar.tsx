import { useState, useCallback, useMemo } from 'react';
import { useCart } from '../../hooks/useCart';
import { useSnackbar } from '../../hooks/useSnackbar';
import { CartHeader } from './CartHeader.tsx';
import { CartItem } from './CartItem.tsx';
import { CartFooter } from './CartFooter.tsx';
import { EmptyCart } from './EmptyCart.tsx';
import { CartOverlay } from './CartOverlay.tsx';

export function CartSidebar() {
  const { state, removeItem, clearCart, closeCart, getTotalPrice } = useCart();
  const { showSnackbar } = useSnackbar();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice]);

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      removeItem(itemId);
      showSnackbar('Item removed from cart', 'info');
    },
    [removeItem, showSnackbar]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    showSnackbar('Cart cleared successfully', 'info');
  }, [clearCart, showSnackbar]);

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      showSnackbar('🎉 Checkout completed successfully!', 'success');
      clearCart();
    } catch {
      showSnackbar('Checkout failed. Please try again.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  }, [clearCart, showSnackbar]);

  if (!state.isOpen) return null;

  return (
    <>
      <CartOverlay onClose={closeCart} />

      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out'>
        <div className='flex flex-col h-full'>
          <CartHeader onClose={closeCart} />

          <div className='flex-1 overflow-y-auto'>
            {state.items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className='p-6 space-y-4'>
                {state.items.map(item => (
                  <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <CartFooter
              totalPrice={totalPrice}
              isCheckingOut={isCheckingOut}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </div>
    </>
  );
}
