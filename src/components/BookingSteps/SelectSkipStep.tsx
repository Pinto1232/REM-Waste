import { useState } from 'react';
import type { BookingFormData } from '../../types/booking';
import type { Skip } from '../../types/skip';
import { SkipsList } from '../SkipsList/SkipsList';
import { BaseLayout } from '../../layouts';

interface SelectSkipStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface SearchFilters {
  sizeRange: string;
  priceRange: string;
  roadLegal: string;
  searchTerm: string;
}

export function SelectSkipStep({ formData, onUpdate, onNext, onPrev }: SelectSkipStepProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sizeRange: 'all',
    priceRange: 'all',
    roadLegal: 'all',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSkipSelect = (skip: Skip) => {
    onUpdate({ selectedSkip: skip });
  };

  const handleContinue = () => {
    if (formData.selectedSkip) {
      onNext();
    }
  };

  const searchParams = {
    postcode: formData.postcode,
    area: formData.area,
  };

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const totalPrice = priceBeforeVat * (1 + vat / 100);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      sizeRange: 'all',
      priceRange: 'all',
      roadLegal: 'all',
      searchTerm: ''
    });
  };

  const hasActiveFilters = searchFilters.sizeRange !== 'all' || 
                          searchFilters.priceRange !== 'all' || 
                          searchFilters.roadLegal !== 'all' || 
                          searchFilters.searchTerm !== '';

  return (
    <BaseLayout
      title="Choose Your Skip Size"
      subtitle="Select the skip size that best suits your needs"
      maxWidth="7xl"
      backgroundColor="gray-900"
      padding="md"
    >
      {}
      <div className='bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <svg className='w-6 h-6 text-blue-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-300 mb-1'>Skip Selection Guide</h3>
            <p className='text-sm text-slate-300'>
              Choose from our range of skip sizes based on your project needs. All prices include delivery, collection, and VAT. 
              {formData.postcode && (
                <span className='font-medium text-blue-300'> Available in {formData.postcode}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-8 sm:mb-12'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white'>Search & Filter Skips</h3>
              <p className='text-slate-400 text-sm'>Find the perfect skip for your needs</p>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
              showFilters 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className='ml-2 w-2 h-2 bg-purple-400 rounded-full'></span>
            )}
          </button>
        </div>

        {}
        <div className='mb-6'>
          <div className='relative'>
            <input
              type='text'
              value={searchFilters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder='Search by size, price, or features...'
              className='w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300'
            />
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            {searchFilters.searchTerm && (
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>

        {}
        {showFilters && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
            {}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>Size Range</label>
              <select
                value={searchFilters.sizeRange}
                onChange={(e) => handleFilterChange('sizeRange', e.target.value)}
                className='w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              >
                <option value='all'>All Sizes</option>
                <option value='small'>Small (2-4 Yards)</option>
                <option value='medium'>Medium (6-8 Yards)</option>
                <option value='large'>Large (10-12 Yards)</option>
                <option value='xlarge'>Extra Large (14+ Yards)</option>
              </select>
            </div>

            {}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>Price Range</label>
              <select
                value={searchFilters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className='w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              >
                <option value='all'>All Prices</option>
                <option value='budget'>Budget (Under £200)</option>
                <option value='mid'>Mid Range (£200-£400)</option>
                <option value='premium'>Premium (£400+)</option>
              </select>
            </div>

            {}
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>Road Placement</label>
              <select
                value={searchFilters.roadLegal}
                onChange={(e) => handleFilterChange('roadLegal', e.target.value)}
                className='w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
              >
                <option value='all'>All Options</option>
                <option value='road'>Road Legal</option>
                <option value='private'>Private Property Only</option>
              </select>
            </div>
          </div>
        )}

        {}
        {hasActiveFilters && (
          <div className='flex items-center justify-between bg-slate-700/30 border border-slate-600/50 rounded-lg p-3'>
            <div className='flex items-center flex-wrap gap-2'>
              <span className='text-slate-300 text-sm font-medium'>Active filters:</span>
              {searchFilters.searchTerm && (
                <span className='bg-purple-600 text-white px-2 py-1 rounded text-xs'>
                  Search: "{searchFilters.searchTerm}"
                </span>
              )}
              {searchFilters.sizeRange !== 'all' && (
                <span className='bg-blue-600 text-white px-2 py-1 rounded text-xs'>
                  Size: {searchFilters.sizeRange}
                </span>
              )}
              {searchFilters.priceRange !== 'all' && (
                <span className='bg-green-600 text-white px-2 py-1 rounded text-xs'>
                  Price: {searchFilters.priceRange}
                </span>
              )}
              {searchFilters.roadLegal !== 'all' && (
                <span className='bg-amber-600 text-white px-2 py-1 rounded text-xs'>
                  Placement: {searchFilters.roadLegal}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className='text-slate-400 hover:text-white transition-colors text-sm font-medium'
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-8 sm:mb-12'>
        <div className='flex items-center mb-4'>
          <div className='w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mr-3'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>Quick Size Guide</h3>
            <p className='text-slate-400 text-sm'>Not sure which size you need?</p>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div 
            className='bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors'
            onClick={() => handleFilterChange('sizeRange', 'small')}
          >
            <div className='flex items-center mb-2'>
              <div className='w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded text-white text-xs font-bold flex items-center justify-center mr-2'>2</div>
              <span className='text-white font-semibold text-sm'>2-4 Yard</span>
            </div>
            <p className='text-slate-400 text-xs'>Small garden clearance, bathroom renovation</p>
          </div>

          <div 
            className='bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors'
            onClick={() => handleFilterChange('sizeRange', 'medium')}
          >
            <div className='flex items-center mb-2'>
              <div className='w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs font-bold flex items-center justify-center mr-2'>6</div>
              <span className='text-white font-semibold text-sm'>6-8 Yard</span>
            </div>
            <p className='text-slate-400 text-xs'>Kitchen renovation, large garden clearance</p>
          </div>

          <div 
            className='bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors'
            onClick={() => handleFilterChange('sizeRange', 'large')}
          >
            <div className='flex items-center mb-2'>
              <div className='w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded text-white text-xs font-bold flex items-center justify-center mr-2'>12</div>
              <span className='text-white font-semibold text-sm'>10-12 Yard</span>
            </div>
            <p className='text-slate-400 text-xs'>House clearance, construction projects</p>
          </div>

          <div 
            className='bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors'
            onClick={() => handleFilterChange('sizeRange', 'xlarge')}
          >
            <div className='flex items-center mb-2'>
              <div className='w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded text-white text-xs font-bold flex items-center justify-center mr-2'>16</div>
              <span className='text-white font-semibold text-sm'>14+ Yard</span>
            </div>
            <p className='text-slate-400 text-xs'>Large construction, commercial projects</p>
          </div>
        </div>
      </div>

      {}
      <div className='mb-8 sm:mb-12'>
        <SkipsList
          searchParams={searchParams}
          onSkipSelect={handleSkipSelect}
          selectedSkipId={formData.selectedSkip?.id}
          searchFilters={searchFilters}
        />
      </div>

      {}
      {formData.selectedSkip && (
        <div className='mt-8 sm:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16'>
          <div className='bg-slate-800 border-t border-b border-slate-700 shadow-lg py-8 sm:py-10 px-6 sm:px-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
            <div className='max-w-6xl mx-auto'>
              <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center'>
                <button
                  onClick={onPrev}
                  className='w-full sm:w-36 h-12 bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base'
                >
                  Back
                </button>
                <div className='hidden sm:block w-4'></div>
                <button
                  onClick={handleContinue}
                  className='w-full sm:w-36 h-12 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base'
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}