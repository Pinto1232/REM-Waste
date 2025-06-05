import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
}

export function Snackbar({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 4000,
  position = 'top',
}: SnackbarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className='w-5 h-5' />;
      case 'error':
        return <FiX className='w-5 h-5' />;
      case 'warning':
        return <FiAlertCircle className='w-5 h-5' />;
      case 'info':
        return <FiInfo className='w-5 h-5' />;
      default:
        return <FiCheck className='w-5 h-5' />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-600 border-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-600 border-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-600 border-yellow-500 text-white`;
      case 'info':
        return `${baseStyles} bg-blue-600 border-blue-500 text-white`;
      default:
        return `${baseStyles} bg-green-600 border-green-500 text-white`;
    }
  };

  const positionStyles =
    position === 'top' ? 'top-4 left-1/2 transform -translate-x-1/2' : 'bottom-4 left-1/2 transform -translate-x-1/2';

  const animationStyles =
    isVisible && isAnimating
      ? 'translate-y-0 opacity-100'
      : position === 'top'
      ? '-translate-y-full opacity-0'
      : 'translate-y-full opacity-0';

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out ${positionStyles} ${animationStyles}`}
      style={{ minWidth: '320px', maxWidth: '500px' }}
    >
      <div className={getStyles()}>
        <div className='flex-shrink-0'>{getIcon()}</div>
        <div className='flex-1'>
          <p className='text-sm font-medium'>{message}</p>
        </div>
        <button onClick={onClose} className='flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors'>
          <FiX className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
