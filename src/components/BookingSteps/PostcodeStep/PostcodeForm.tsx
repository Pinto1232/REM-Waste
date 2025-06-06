import { useState, useEffect } from 'react';
import { FormField, GradientButton } from '../../ui';
import { ValidationMessage } from './ValidationMessage';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../../constants';
import type { BookingFormData } from '../../../schemas/booking';

export interface PostcodeFormProps {
  formData: BookingFormData;

  onUpdate: (data: Partial<BookingFormData>) => void;

  onNext: () => void;
}

export function PostcodeForm({ formData, onUpdate, onNext }: PostcodeFormProps) {
  const [postcode, setPostcode] = useState(formData.postcode || '');
  const [area, setArea] = useState(formData.area || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPostcode(formData.postcode || '');
    setArea(formData.area || '');
  }, [formData.postcode, formData.area]);

  const validatePostcode = (postcode: string): boolean => {
    return VALIDATION_PATTERNS.UK_POSTCODE.test(postcode.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPostcode = postcode.trim().toUpperCase();
    const trimmedArea = area.trim();

    if (!trimmedPostcode) {
      setError(VALIDATION_MESSAGES.POSTCODE_REQUIRED);
      return;
    }

    if (!validatePostcode(trimmedPostcode)) {
      setError(VALIDATION_MESSAGES.INVALID_POSTCODE);
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

  const locationIcon = (
    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
  );

  const buildingIcon = (
    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      />
    </svg>
  );

  const arrowRightIcon = (
    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17 8l4 4m0 0l-4 4m4-4H3'
      />
    </svg>
  );

  return (
    <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 sm:mb-12'>
      {}
      <div className='flex items-center mb-6'>
        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4'>
          {locationIcon}
        </div>
        <div>
          <h3 className='text-xl font-bold text-white'>Location Details</h3>
          <p className='text-slate-400 text-sm'>Tell us where you need the skip delivered</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {}
        {error && <ValidationMessage error={error} />}

        {}
        <FormField
          id='postcode'
          label='Postcode'
          value={postcode}
          onChange={handlePostcodeChange}
          placeholder='e.g., NR32 1AB'
          required
          disabled={isSubmitting}
          {...(error && { error })}
          showSuccess={!!postcode && !error}
          icon={locationIcon}
          helpText='Enter a valid UK postcode to find available services'
        />

        {}
        <FormField
          id='area'
          label='Area (Optional)'
          value={area}
          onChange={e => setArea(e.target.value)}
          placeholder='e.g., Lowestoft, Norwich'
          disabled={isSubmitting}
          icon={buildingIcon}
          helpText='Help us provide more accurate local information'
        />

        {}
        <GradientButton
          type='submit'
          variant='success'
          size='large'
          fullWidth
          disabled={!postcode.trim()}
          loading={isSubmitting}
          rightIcon={arrowRightIcon}
        >
          Find Available Skips
        </GradientButton>
      </form>
    </div>
  );
}
