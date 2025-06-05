import { useState } from 'react';
import { useSkipsByLocation } from '../../hooks/useSkips';
import type { SkipSearchParams } from '../../types/skip';

export function SkipsList() {
  const [searchParams, setSearchParams] = useState<SkipSearchParams>({
    postcode: 'NR32',
    area: 'Lowestoft',
  });

  const { data: skips, isLoading, isError, error, refetch } = useSkipsByLocation(searchParams);

  console.log('SkipsList - Skips Data:', skips);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postcode = formData.get('postcode') as string;
    const area = formData.get('area') as string;

    const newSearchParams = {
      postcode: postcode.trim(),
      area: area.trim(),
    };

    console.log('SkipsList - Form submitted with:', newSearchParams);
    setSearchParams(newSearchParams);
  };

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const totalPrice = priceBeforeVat * (1 + vat / 100);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Skip Hire Search</h1>

      {}
      <form onSubmit={handleSearch} className='mb-8 bg-white p-6 rounded-lg shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label htmlFor='postcode' className='block text-sm font-medium text-gray-700 mb-2'>
              Postcode *
            </label>
            <input
              type='text'
              id='postcode'
              name='postcode'
              defaultValue={searchParams.postcode}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g., NR32'
            />
          </div>

          <div>
            <label htmlFor='area' className='block text-sm font-medium text-gray-700 mb-2'>
              Area
            </label>
            <input
              type='text'
              id='area'
              name='area'
              defaultValue={searchParams.area}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g., Lowestoft'
            />
          </div>

          <div className='flex items-end'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Searching...' : 'Search Skips'}
            </button>
          </div>
        </div>
      </form>

      {}
      {isLoading && (
        <div className='text-center py-8'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600'>Loading skips...</p>
        </div>
      )}

      {}
      {isError && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>Error loading skips</h3>
              <p className='mt-1 text-sm text-red-700'>{error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={() => refetch()}
                className='mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200'
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {skips && skips.length > 0 && (
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Found {skips.length} skip{skips.length !== 1 ? 's' : ''} for {searchParams.postcode}
            {searchParams.area && `, ${searchParams.area}`}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {skips.map(skip => (
              <div key={skip.id} className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>{skip.size} Yard Skip</h3>
                  <span className='text-2xl font-bold text-blue-600'>
                    {formatPrice(skip.price_before_vat, skip.vat)}
                  </span>
                </div>

                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Hire Period:</span>
                    <span className='font-medium'>{skip.hire_period_days} days</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Price before VAT:</span>
                    <span className='font-medium'>£{skip.price_before_vat}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>VAT:</span>
                    <span className='font-medium'>{skip.vat}%</span>
                  </div>

                  {skip.transport_cost && (
                    <div className='flex justify-between'>
                      <span>Transport Cost:</span>
                      <span className='font-medium'>£{skip.transport_cost}</span>
                    </div>
                  )}

                  {skip.per_tonne_cost && (
                    <div className='flex justify-between'>
                      <span>Per Tonne:</span>
                      <span className='font-medium'>£{skip.per_tonne_cost}</span>
                    </div>
                  )}
                </div>

                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <div className='flex flex-wrap gap-2'>
                    {skip.allowed_on_road && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Road Permitted
                      </span>
                    )}

                    {skip.allows_heavy_waste && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        Heavy Waste OK
                      </span>
                    )}

                    {skip.forbidden && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                        Restricted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {skips && skips.length === 0 && !isLoading && (
        <div className='text-center py-8'>
          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>No skips found</h3>
          <p className='mt-1 text-sm text-gray-500'>Try searching with a different postcode or area.</p>
        </div>
      )}
    </div>
  );
}
