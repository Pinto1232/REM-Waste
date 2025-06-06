import { memo } from 'react';

interface CartOverlayProps {
  onClose: () => void;
}

export const CartOverlay = memo(function CartOverlay({ onClose }: CartOverlayProps) {
  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity'
      onClick={onClose}
      aria-label='Close cart overlay'
    />
  );
});
