import { forwardRef } from 'react';
import { UI_STYLES } from '../../../constants';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;

  error?: string;

  helpText?: string;

  icon?: React.ReactNode;

  required?: boolean;

  showSuccess?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helpText,
      icon,
      required = false,
      showSuccess = false,
      className = '',
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const getInputClasses = () => {
      const baseClasses = [
        'w-full',
        'px-4',
        'py-4',
        icon ? 'pl-12' : '',
        'bg-slate-700/50',
        'border',
        UI_STYLES.ROUNDED.DEFAULT,
        'text-white',
        'text-lg',
        'font-medium',
        'placeholder-slate-400',
        'focus:outline-none',
        'focus:ring-2',
        UI_STYLES.TRANSITIONS.DEFAULT,
        'hover:bg-slate-700/70',
      ];

      const conditionalClasses = [];

      if (error) {
        conditionalClasses.push(...UI_STYLES.BORDERS.ERROR.split(' '));
      } else if (showSuccess && value) {
        conditionalClasses.push(...UI_STYLES.BORDERS.SUCCESS.split(' '));
      } else {
        conditionalClasses.push(
          'border-slate-600',
          'focus:ring-green-500',
          'focus:border-green-500'
        );
      }

      if (disabled) {
        conditionalClasses.push('opacity-50', 'cursor-not-allowed');
      }

      return [...baseClasses, ...conditionalClasses, className].filter(Boolean).join(' ');
    };

    return (
      <div>
        {}
        <label htmlFor={props.id} className='block text-sm font-semibold text-slate-300 mb-3'>
          {label} {required && '*'}
        </label>

        {}
        <div className='relative'>
          <input
            ref={ref}
            className={getInputClasses()}
            disabled={disabled}
            value={value}
            {...props}
          />

          {}
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <div className={error ? 'text-red-400' : 'text-slate-400'}>{icon}</div>
            </div>
          )}

          {}
          {showSuccess && value && !error && (
            <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          )}
        </div>

        {}
        {(helpText || error) && (
          <p
            className={`text-xs mt-2 flex items-center ${error ? 'text-red-400' : 'text-slate-400'}`}
          >
            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            {error || helpText}
          </p>
        )}
      </div>
    );
  }
);
