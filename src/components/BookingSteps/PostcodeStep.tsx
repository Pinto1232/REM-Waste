import { useState, useEffect } from 'react';
import type { BookingFormData } from '../../schemas/booking';
import { BaseLayout } from '../../layouts';

interface PostcodeStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
}

export function PostcodeStep({ formData, onUpdate, onNext }: PostcodeStepProps) {
  const [postcode, setPostcode] = useState(formData.postcode || '');
  const [area, setArea] = useState(formData.area || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPostcode(formData.postcode || '');
    setArea(formData.area || '');
  }, [formData.postcode, formData.area]);

  const validatePostcode = (postcode: string): boolean => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPostcode = postcode.trim().toUpperCase();
    const trimmedArea = area.trim();

    if (!trimmedPostcode) {
      setError('Please enter a postcode');
      return;
    }

    if (!validatePostcode(trimmedPostcode)) {
      setError('Please enter a valid UK postcode (e.g., NR32 1AB)');
      return;
    }

    setIsSubmitting(true);

    try {
      onUpdate({
        postcode: trimmedPostcode,
        area: trimmedArea,
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      onNext();
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostcode(value);
    setError(null);
  };

  return (
    <BaseLayout
      title='Enter Your Postcode'
      subtitle="We'll find available skips in your area"
      maxWidth='2xl'
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
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-300 mb-1'>Location Service</h3>
            <p className='text-sm text-slate-300'>
              Enter your postcode to find available skip sizes and pricing in your area. We'll show
              you the best options for waste collection near you.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 sm:mb-12'>
        <div className='flex items-center mb-6'>
          <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4'>
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
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-xl font-bold text-white'>Location Details</h3>
            <p className='text-slate-400 text-sm'>Tell us where you need the skip delivered</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {}
          {error && (
            <div className='bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-red-400 mt-0.5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h4 className='text-sm font-medium text-red-300 mb-1'>Input Error</h4>
                  <p className='text-sm text-red-200'>{error}</p>
                </div>
              </div>
            </div>
          )}

          {}
          <div>
            <label htmlFor='postcode' className='block text-sm font-semibold text-slate-300 mb-3'>
              Postcode *
            </label>
            <div className='relative'>
              <input
                type='text'
                id='postcode'
                value={postcode}
                onChange={handlePostcodeChange}
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-4 pl-12 bg-slate-700/50 border rounded-xl text-white text-lg font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-slate-700/70 ${
                  error
                    ? 'border-red-500 focus:ring-red-500 ring-2 ring-red-500/50'
                    : 'border-slate-600 focus:ring-green-500 focus:border-green-500'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder='e.g., NR32 1AB'
              />
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <svg
                  className={`w-5 h-5 ${error ? 'text-red-400' : 'text-slate-400'}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              {postcode && !error && (
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
            <p className='text-xs text-slate-400 mt-2 flex items-center'>
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Enter a valid UK postcode to find available services
            </p>
          </div>

          {}
          <div>
            <label htmlFor='area' className='block text-sm font-semibold text-slate-300 mb-3'>
              Area (Optional)
            </label>
            <div className='relative'>
              <input
                type='text'
                id='area'
                value={area}
                onChange={e => setArea(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-lg font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder='e.g., Lowestoft, Norwich'
              />
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
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
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
            </div>
            <p className='text-xs text-slate-400 mt-2 flex items-center'>
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Help us provide more accurate local information
            </p>
          </div>

          {}
          <button
            type='submit'
            disabled={!postcode.trim() || isSubmitting}
            className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl relative overflow-hidden group'
          >
            <span className='relative z-10 flex items-center'>
              {isSubmitting ? (
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
                  Find Available Skips
                  <svg
                    className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </>
              )}
            </span>
            {}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
          </button>
        </form>
      </div>

      {}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
        <div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3'>
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
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          </div>
          <h4 className='text-sm font-semibold text-white mb-1'>Instant Results</h4>
          <p className='text-xs text-slate-400'>Get available options immediately</p>
        </div>

        <div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center'>
          <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3'>
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
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h4 className='text-sm font-semibold text-white mb-1'>Local Service</h4>
          <p className='text-xs text-slate-400'>Skips available in your area</p>
        </div>

        <div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3'>
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
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
          </div>
          <h4 className='text-sm font-semibold text-white mb-1'>Best Prices</h4>
          <p className='text-xs text-slate-400'>Competitive local pricing</p>
        </div>
      </div>
    </BaseLayout>
  );
}
