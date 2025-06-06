import { useReducer } from 'react';
import type { ReactNode } from 'react';
import type { BookingFormData } from '../schemas/booking';
import type { CartItem } from '../types/cart';
import { CartContext, type CartState, type CartAction, type CartContextType } from './CartContextTypes';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_CART':
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

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (bookingData: BookingFormData) => {
    if (!bookingData.selectedSkip || !bookingData.customerDetails || !bookingData.paymentMethod) {
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

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.length;
  };

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