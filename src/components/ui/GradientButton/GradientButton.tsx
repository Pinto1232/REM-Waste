import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { UI_STYLES } from '../../../constants';

export interface GradientButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'ref'> {
  variant?: 'primary' | 'success' | 'warning' | 'danger';

  size?: 'small' | 'medium' | 'large';

  loading?: boolean;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;

  fullWidth?: boolean;
}

export const GradientButton = forwardRef<React.ElementRef<'button'>, GradientButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const gradientStyles = {
      primary: `${UI_STYLES.GRADIENTS.PRIMARY} ${UI_STYLES.GRADIENTS.PRIMARY_HOVER}`,
      success: `${UI_STYLES.GRADIENTS.SUCCESS} ${UI_STYLES.GRADIENTS.SUCCESS_HOVER}`,
      warning: UI_STYLES.GRADIENTS.WARNING,
      danger: UI_STYLES.GRADIENTS.DANGER,
    };

    const sizeStyles = {
      small: 'py-2 px-4 text-sm',
      medium: 'py-3 px-6 text-base',
      large: 'py-4 px-8 text-lg',
    };

    const baseClasses = [
      'font-semibold',
      'text-white',
      UI_STYLES.ROUNDED.DEFAULT,
      UI_STYLES.SHADOWS.DEFAULT,
      UI_STYLES.SHADOWS.HOVER,
      UI_STYLES.TRANSITIONS.DEFAULT,
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'relative',
      'overflow-hidden',
      'group',
    ];

    const conditionalClasses = [
      gradientStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
    ];

    const allClasses = [...baseClasses, ...conditionalClasses, className].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={allClasses} disabled={disabled || loading} {...props}>
        <span className='relative z-10 flex items-center justify-center'>
          {loading ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {leftIcon && <span className='mr-2'>{leftIcon}</span>}
              {children}
              {rightIcon && (
                <span className='ml-2 group-hover:translate-x-1 transition-transform duration-300'>
                  {rightIcon}
                </span>
              )}
            </>
          )}
        </span>

        {}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
      </button>
    );
  }
);
