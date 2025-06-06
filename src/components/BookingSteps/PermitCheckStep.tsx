import { useState, useEffect } from 'react';
import type { BookingFormData } from '../../schemas/booking';
import { BaseLayout } from '../../layouts';

interface PermitCheckStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PermitCheckStep({ formData, onUpdate, onNext, onPrev }: PermitCheckStepProps) {
  const [permitRequired, setPermitRequired] = useState<boolean | undefined>(
    formData.permitRequired
  );
  const [permitDetails, setPermitDetails] = useState(formData.permitDetails || '');

  useEffect(() => {
    setPermitRequired(formData.permitRequired);
    setPermitDetails(formData.permitDetails || '');
  }, [formData.permitRequired, formData.permitDetails]);

  const handlePermitChange = (required: boolean) => {
    setPermitRequired(required);
    onUpdate({ permitRequired: required });
  };

  const handleContinue = () => {
    onUpdate({
      permitRequired,
      permitDetails: permitRequired ? permitDetails : undefined,
    });
    onNext();
  };

  return (
    <BaseLayout
      title='Permit Check'
      subtitle='Do you need a permit for skip placement?'
      maxWidth='4xl'
      backgroundColor='gray-900'
      padding='md'
    >
      {}
      <div className='bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <svg
              className='w-6 h-6 text-blue-400 mt-0.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-300 mb-1'>Permit Information</h3>
            <p className='text-sm text-slate-300'>
              A permit is required if the skip will be placed on a public road, pavement, or any
              council-owned land. If placing on private property (driveway, garden), no permit is
              needed.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12'>
        {}
        <div
          onClick={() => handlePermitChange(false)}
          className={`group cursor-pointer bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden ${
            permitRequired === false
              ? 'border-green-400 ring-2 ring-green-400/50 shadow-green-500/25'
              : 'border-slate-700/50 hover:border-slate-600'
          }`}
        >
          {}
          {permitRequired === false && (
            <div className='absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10 pointer-events-none' />
          )}

          {}
          <div className='relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-6 sm:p-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    permitRequired === false
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700'
                  }`}
                >
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-xl font-bold text-white'>Private Property</h3>
                  <p className='text-slate-300 text-sm'>No permit required</p>
                </div>
              </div>
              {permitRequired === false && (
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
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
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {}
          <div className='p-6 sm:p-8'>
            <div className='space-y-3 mb-6'>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-green-400'
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
                <span className='text-sm'>Driveway placement</span>
              </div>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-green-400'
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
                <span className='text-sm'>Private garden/yard</span>
              </div>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-green-400'
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
                <span className='text-sm'>No additional fees</span>
              </div>
            </div>
            <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-3'>
              <p className='text-green-300 text-sm font-medium'>
                ✓ Fastest option - no waiting for permits
              </p>
            </div>
          </div>
        </div>

        {}
        <div
          onClick={() => handlePermitChange(true)}
          className={`group cursor-pointer bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden ${
            permitRequired === true
              ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/25'
              : 'border-slate-700/50 hover:border-slate-600'
          }`}
        >
          {}
          {permitRequired === true && (
            <div className='absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10 pointer-events-none' />
          )}

          {}
          <div className='relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-6 sm:p-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    permitRequired === true
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700'
                  }`}
                >
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-xl font-bold text-white'>Public Road</h3>
                  <p className='text-slate-300 text-sm'>Permit required</p>
                </div>
              </div>
              {permitRequired === true && (
                <div className='w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center'>
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
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {}
          <div className='p-6 sm:p-8'>
            <div className='space-y-3 mb-6'>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-amber-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
                <span className='text-sm'>Road/pavement placement</span>
              </div>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-amber-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='text-sm'>Processing time required</span>
              </div>
              <div className='flex items-center text-slate-300'>
                <svg
                  className='w-4 h-4 mr-3 text-amber-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
                <span className='text-sm'>Additional permit fees apply</span>
              </div>
            </div>
            <div className='bg-amber-500/10 border border-amber-500/20 rounded-lg p-3'>
              <p className='text-amber-300 text-sm font-medium'>
                ⚠️ Council permit required - additional time & cost
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      {permitRequired === true && (
        <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 sm:mb-12'>
          <div className='flex items-center mb-4'>
            <div className='w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mr-3'>
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
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white'>Additional Details</h3>
              <p className='text-sm text-slate-400'>Help us process your permit application</p>
            </div>
          </div>

          <textarea
            id='permitDetails'
            value={permitDetails}
            onChange={e => setPermitDetails(e.target.value)}
            rows={4}
            className='w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 hover:bg-slate-700/70 text-sm sm:text-base'
            placeholder='Please provide details about the location, any restrictions, or special requirements for the permit application...'
          />
          <p className='text-xs text-slate-400 mt-2'>
            Include street name, nearest landmarks, and any access restrictions
          </p>
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
                disabled={permitRequired === undefined}
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
