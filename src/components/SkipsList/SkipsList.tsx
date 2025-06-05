import { useSkipsByLocation } from '../../hooks/useSkips';
import type { SkipSearchParams, Skip } from '../../types/skip';

interface SearchFilters {
  sizeRange: string;
  priceRange: string;
  roadLegal: string;
  searchTerm: string;
}

interface SkipsListProps {
  searchParams: SkipSearchParams;
  onSkipSelect?: (skip: Skip) => void;
  selectedSkipId?: number;
  searchFilters?: SearchFilters;
}

export function SkipsList({ searchParams, onSkipSelect, selectedSkipId, searchFilters }: SkipsListProps) {
  console.log('SkipsList - Search Params:', searchParams);

  const { data: skips, isLoading, isError, error, refetch } = useSkipsByLocation(searchParams);

  console.log('SkipsList - Query State:', { skips, isLoading, isError, error });
  console.log('SkipsList - Skips Data:', skips);

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const totalPrice = priceBeforeVat * (1 + vat / 100);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  };

  const handleSkipSelect = (skip: Skip) => {
    if (onSkipSelect) {
      onSkipSelect(skip);
    }
  };

  const filteredSkips =
    skips?.filter(skip => {
      if (!searchFilters) return true;

      const totalPrice = skip.price_before_vat * (1 + skip.vat / 100);

      if (searchFilters.searchTerm) {
        const searchLower = searchFilters.searchTerm.toLowerCase();
        const matchesSearch =
          skip.size.toString().includes(searchLower) ||
          formatPrice(skip.price_before_vat, skip.vat).toLowerCase().includes(searchLower) ||
          skip.hire_period_days.toString().includes(searchLower) ||
          (skip.allowed_on_road ? 'road legal' : 'private property').includes(searchLower);

        if (!matchesSearch) return false;
      }

      if (searchFilters.sizeRange !== 'all') {
        const size = skip.size;
        switch (searchFilters.sizeRange) {
          case 'small':
            if (size > 4) return false;
            break;
          case 'medium':
            if (size < 6 || size > 8) return false;
            break;
          case 'large':
            if (size < 10 || size > 12) return false;
            break;
          case 'xlarge':
            if (size < 14) return false;
            break;
        }
      }

      if (searchFilters.priceRange !== 'all') {
        switch (searchFilters.priceRange) {
          case 'budget':
            if (totalPrice >= 200) return false;
            break;
          case 'mid':
            if (totalPrice < 200 || totalPrice >= 400) return false;
            break;
          case 'premium':
            if (totalPrice < 400) return false;
            break;
        }
      }

      if (searchFilters.roadLegal !== 'all') {
        switch (searchFilters.roadLegal) {
          case 'road':
            if (!skip.allowed_on_road) return false;
            break;
          case 'private':
            if (skip.allowed_on_road) return false;
            break;
        }
      }

      return true;
    }) || [];

  return (
    <div className='w-full'>
      {}
      {isLoading && (
        <div className='text-center py-6 sm:py-8'>
          <div className='inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600 text-sm sm:text-base'>Loading skips...</p>
        </div>
      )}

      {}
      {isError && (
        <div className='bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 mb-4 sm:mb-6 mx-4 sm:mx-0'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-4 w-4 sm:h-5 sm:w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-2 sm:ml-3'>
              <h3 className='text-xs sm:text-sm font-medium text-red-800'>Error loading skips</h3>
              <p className='mt-1 text-xs sm:text-sm text-red-700'>{error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={() => refetch()}
                className='mt-2 text-xs sm:text-sm bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded hover:bg-red-200'
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {skips && skips.length > 0 && (
        <div className='mb-6 px-4 sm:px-0'>
          <p className='text-slate-400 text-sm'>
            {searchFilters &&
            (searchFilters.searchTerm ||
              searchFilters.sizeRange !== 'all' ||
              searchFilters.priceRange !== 'all' ||
              searchFilters.roadLegal !== 'all') ? (
              <>
                Showing {filteredSkips.length} of {skips.length} skips
              </>
            ) : (
              <>
                {skips.length} skip{skips.length !== 1 ? 's' : ''} available
              </>
            )}
          </p>
        </div>
      )}

      {}
      {skips && skips.length > 0 && filteredSkips.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0'>
          {filteredSkips.map(skip => (
            <div
              key={skip.id}
              onClick={() => handleSkipSelect(skip)}
              className={`group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer ${
                selectedSkipId === skip.id
                  ? 'border-blue-400 ring-2 ring-blue-400/50 shadow-blue-500/25'
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {}
              {selectedSkipId === skip.id && (
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10 pointer-events-none' />
              )}

              {}
              <div className='relative bg-gradient-to-br from-slate-700 to-slate-600 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r ${
                        selectedSkipId === skip.id ? 'from-blue-500 to-blue-600' : 'from-amber-500 to-amber-600'
                      }`}
                    >
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <h3 className='text-lg font-bold text-white'>{skip.size} Yard Skip</h3>
                      <p className='text-slate-300 text-xs'>
                        {skip.area} • {skip.postcode}
                      </p>
                    </div>
                  </div>
                  {selectedSkipId === skip.id && (
                    <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                      <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className='p-4'>
                {}
                <div className='mb-4'>
                  <div className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
                    {formatPrice(skip.price_before_vat, skip.vat)}
                  </div>
                  <div className='text-xs text-slate-400'>Including {skip.vat}% VAT</div>
                </div>

                {}
                <div className='grid grid-cols-2 gap-3 mb-4'>
                  <div className='bg-slate-700/30 rounded-lg p-2 text-center'>
                    <div className='text-xs text-slate-400 mb-1'>Hire Period</div>
                    <div className='text-sm font-semibold text-white'>{skip.hire_period_days} days</div>
                  </div>
                  <div className='bg-slate-700/30 rounded-lg p-2 text-center'>
                    <div className='text-xs text-slate-400 mb-1'>Heavy Waste</div>
                    <div className='text-sm font-semibold text-white'>
                      {skip.allows_heavy_waste ? (
                        <span className='text-green-400'>✓ Yes</span>
                      ) : (
                        <span className='text-red-400'>✗ No</span>
                      )}
                    </div>
                  </div>
                </div>

                {}
                <div className='space-y-2 mb-4'>
                  <div className='flex items-center text-xs'>
                    <svg
                      className={`w-3 h-3 mr-2 ${skip.allowed_on_road ? 'text-green-400' : 'text-red-400'}`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      {skip.allowed_on_road ? (
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      ) : (
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      )}
                    </svg>
                    <span className={`${skip.allowed_on_road ? 'text-green-300' : 'text-red-300'}`}>
                      {skip.allowed_on_road ? 'Road placement allowed' : 'Private property only'}
                    </span>
                  </div>

                  {!skip.forbidden && (
                    <div className='flex items-center text-xs'>
                      <svg className='w-3 h-3 mr-2 text-green-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-green-300'>Available for booking</span>
                    </div>
                  )}
                </div>

                {}
                <button
                  className={`w-full py-2.5 px-3 rounded-lg font-medium transition-all duration-300 text-sm relative overflow-hidden group/btn ${
                    selectedSkipId === skip.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 hover:from-slate-600 hover:to-slate-500'
                  }`}
                >
                  <span className='relative z-10 flex items-center justify-center'>
                    {selectedSkipId === skip.id ? (
                      <>
                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                        Selected
                      </>
                    ) : (
                      <>
                        Select Skip
                        <svg
                          className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {skips && skips.length > 0 && filteredSkips.length === 0 && (
        <div className='text-center py-12 px-4 sm:px-0'>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-8'>
            <svg
              className='mx-auto h-16 w-16 text-slate-400 mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <h3 className='text-xl font-semibold text-white mb-2'>No skips match your filters</h3>
            <p className='text-slate-400 mb-6'>Try adjusting your search criteria to see more options.</p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={() => {
                  console.log('Clear filters');
                }}
                className='px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors'
              >
                Clear All Filters
              </button>
              <button
                onClick={() => {
                  console.log('Show all skips');
                }}
                className='px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors'
              >
                Show All Skips
              </button>
            </div>
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
