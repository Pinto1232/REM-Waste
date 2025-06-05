import { useState } from 'react';
import type { BookingFormData } from '../../types/booking';
import { BaseLayout } from '../../layouts';

interface ChooseDateStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ChooseDateStep({ formData, onUpdate, onNext, onPrev }: ChooseDateStepProps) {
  const [deliveryDate, setDeliveryDate] = useState(formData.deliveryDate || '');
  const [collectionDate, setCollectionDate] = useState(formData.collectionDate || '');

  const handleContinue = () => {
    if (deliveryDate) {
      onUpdate({ deliveryDate, collectionDate });
      onNext();
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <BaseLayout
      title='Choose Dates'
      subtitle='Select your preferred delivery and collection dates'
      maxWidth='4xl'
      backgroundColor='gray-900'
      padding='md'
    >
      {}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12'>
        {}
        <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-slate-600 transition-all duration-300'>
          <div className='flex items-center mb-4'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white'>Delivery Date</h3>
              <p className='text-sm text-slate-400'>Required</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='relative'>
              <input
                type='date'
                id='deliveryDate'
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                min={minDate}
                required
                className='w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:bg-slate-700/70'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                <svg
                  className='w-5 h-5 text-slate-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
            </div>

            {deliveryDate && (
              <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-3'>
                <p className='text-blue-300 text-sm font-medium'>
                  {formatDateForDisplay(deliveryDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {}
        <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-slate-600 transition-all duration-300'>
          <div className='flex items-center mb-4'>
            <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 8l6 6 6-6'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white'>Collection Date</h3>
              <p className='text-sm text-slate-400'>Optional</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='relative'>
              <input
                type='date'
                id='collectionDate'
                value={collectionDate}
                onChange={e => setCollectionDate(e.target.value)}
                min={deliveryDate || minDate}
                className='w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                <svg
                  className='w-5 h-5 text-slate-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
            </div>

            {collectionDate ? (
              <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-3'>
                <p className='text-green-300 text-sm font-medium'>
                  {formatDateForDisplay(collectionDate)}
                </p>
              </div>
            ) : (
              <div className='bg-slate-700/30 border border-slate-600/50 rounded-lg p-3'>
                <p className='text-slate-400 text-sm'>
                  Leave empty to use the standard {formData.selectedSkip?.hire_period_days || 14}{' '}
                  day hire period
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {deliveryDate && (
        <div className='bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-8 sm:mb-12'>
          <h4 className='text-lg font-semibold text-white mb-4 flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-blue-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            Booking Summary
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Skip Size:</span>
              <span className='text-white font-medium'>{formData.selectedSkip?.size} Yard</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Delivery:</span>
              <span className='text-white font-medium'>
                {new Date(deliveryDate).toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Collection:</span>
              <span className='text-white font-medium'>
                {collectionDate
                  ? new Date(collectionDate).toLocaleDateString('en-GB')
                  : `Auto (${formData.selectedSkip?.hire_period_days || 14} days)`}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Hire Period:</span>
              <span className='text-white font-medium'>
                {collectionDate
                  ? `${Math.ceil(
                      (new Date(collectionDate).getTime() - new Date(deliveryDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} days`
                  : `${formData.selectedSkip?.hire_period_days || 14} days`}
              </span>
            </div>
          </div>
        </div>
      )}

      {}
      <div className='mt-8 sm:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16'>
        <div className='bg-slate-800 border-t border-b border-slate-700 shadow-lg py-8 sm:py-10 px-6 sm:px-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
          <div className='max-w-4xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center'>
              <button
                onClick={onPrev}
                className='w-full sm:w-36 h-12 bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base'
              >
                Back
              </button>
              <div className='hidden sm:block w-4' />
              <button
                onClick={handleContinue}
                disabled={!deliveryDate}
                className='w-full sm:w-36 h-12 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base'
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
