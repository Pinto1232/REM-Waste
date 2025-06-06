import { useReducer } from 'react';
import type { ReactNode } from 'react';
import type { BookingFormData } from '../schemas/booking';
import type { CartItem } from '../types/cart';
import { CartContext, type CartState, type CartAction, type CartContextType } from './CartContextTypes';
import { logger } from '../utils/logger';

/**
 * Reducer function for managing cart state transitions
 * @param state - Current cart state
 * @param action - Action to perform
 * @returns New cart state
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      logger.debug('Adding item to cart', { itemId: action.payload.id });
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      logger.debug('Removing item from cart', { itemId: action.payload });
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      logger.debug('Clearing cart');
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_CART':
      logger.debug('Toggling cart visibility', { currentState: state.isOpen });
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

/** Initial cart state */
const initialState: CartState = {
  items: [],
  isOpen: false,
};

/**
 * Cart provider component that manages cart state and provides cart operations
 * 
 * Provides cart functionality including adding/removing items, toggling visibility,
 * and calculating totals. Uses useReducer for predictable state management.
 * 
 * @param children - Child components that need access to cart context
 * 
 * @example
 * ```tsx
 * <CartProvider>
 *   <App />
 * </CartProvider>
 * ```
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * Adds a booking to the cart as a cart item
   * @param bookingData - Complete booking form data
   */
  const addItem = (bookingData: BookingFormData) => {
    if (!bookingData.selectedSkip || !bookingData.customerDetails || !bookingData.paymentMethod) {
      logger.warn('Attempted to add incomplete booking to cart', { bookingData });
      return;
    }

    const cartItem: CartItem = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      skipSize: bookingData.selectedSkip.size,
      hirePeriod: bookingData.selectedSkip.hire_period_days,
      price: bookingData.selectedSkip.price_before_vat,
      vat: bookingData.selectedSkip.vat,
      deliveryDate: bookingData.deliveryDate || '',
      ...(bookingData.collectionDate && { collectionDate: bookingData.collectionDate }),
      postcode: bookingData.postcode,
      wasteType: bookingData.wasteType,
      customerDetails: bookingData.customerDetails,
      paymentMethod: bookingData.paymentMethod,
      addedAt: new Date(),
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  /**
   * Removes an item from the cart by ID
   * @param id - The cart item ID to remove
   */
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  /**
   * Toggles cart visibility
   */
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  /**
   * Opens the cart sidebar
   */
  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  /**
   * Closes the cart sidebar
   */
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  /**
   * Gets the total number of items in the cart
   * @returns Number of cart items
   */
  const getTotalItems = () => {
    return state.items.length;
  };

  /**
   * Calculates the total price including VAT for all cart items
   * @returns Total price as a number
   */
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const itemTotal = item.price * (1 + item.vat / 100);
      return total + itemTotal;
    }, 0);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}