import { memo } from 'react';
import type { Skip } from '../../types/skip';
import { formatPrice } from './utils/formatting.ts';
import { SkipIcon, CheckIcon, ArrowRightIcon } from './icons.tsx';

interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onSelect: (skip: Skip) => void;
}

export const SkipCard = memo(function SkipCard({ skip, isSelected, onSelect }: SkipCardProps) {
  const handleClick = () => onSelect(skip);
  const formattedPrice = formatPrice(skip.price_before_vat, skip.vat);

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-blue-400 ring-2 ring-blue-400/50 shadow-blue-500/25'
          : 'border-slate-700/50 hover:border-slate-600'
      }`}
    >
      {}
      {isSelected && (
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10 pointer-events-none' />
      )}

      {}
      <div className='relative bg-gradient-to-br from-slate-700 to-slate-600 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r ${
                isSelected ? 'from-blue-500 to-blue-600' : 'from-amber-500 to-amber-600'
              }`}
            >
              <SkipIcon className='w-5 h-5 text-white' />
            </div>
            <div className='ml-3'>
              <h3 className='text-lg font-bold text-white'>{skip.size} Yard Skip</h3>
              <p className='text-slate-300 text-xs'>
                {skip.area} • {skip.postcode}
              </p>
            </div>
          </div>
          {isSelected && (
            <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
              <CheckIcon className='w-4 h-4 text-white' />
            </div>
          )}
        </div>
      </div>

      {}
      <div className='p-4'>
        {}
        <div className='mb-4'>
          <div className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
            {formattedPrice}
          </div>
          <div className='text-xs text-slate-400'>Including {skip.vat}% VAT</div>
        </div>

        {}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <DetailCard label='Hire Period' value={`${skip.hire_period_days} days`} />
          <DetailCard
            label='Heavy Waste'
            value={
              skip.allows_heavy_waste ? (
                <span className='text-green-400'>✓ Yes</span>
              ) : (
                <span className='text-red-400'>✗ No</span>
              )
            }
          />
        </div>

        {}
        <div className='space-y-2 mb-4'>
          <FeatureItem
            icon={skip.allowed_on_road ? 'check' : 'cross'}
            text={skip.allowed_on_road ? 'Road placement allowed' : 'Private property only'}
            variant={skip.allowed_on_road ? 'success' : 'warning'}
          />
          {!skip.forbidden && (
            <FeatureItem icon='check' text='Available for booking' variant='success' />
          )}
        </div>

        {}
        <button
          className={`w-full py-2.5 px-3 rounded-lg font-medium transition-all duration-300 text-sm relative overflow-hidden group/btn ${
            isSelected
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 hover:from-slate-600 hover:to-slate-500'
          }`}
        >
          <span className='relative z-10 flex items-center justify-center'>
            {isSelected ? (
              <>
                <CheckIcon className='w-4 h-4 mr-2' />
                Selected
              </>
            ) : (
              <>
                Select Skip
                <ArrowRightIcon className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300' />
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
});

interface DetailCardProps {
  label: string;
  value: React.ReactNode;
}

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <div className='bg-slate-700/30 rounded-lg p-2 text-center'>
      <div className='text-xs text-slate-400 mb-1'>{label}</div>
      <div className='text-sm font-semibold text-white'>{value}</div>
    </div>
  );
}

interface FeatureItemProps {
  icon: 'check' | 'cross' | 'info';
  text: string;
  variant: 'success' | 'warning' | 'info';
}

function FeatureItem({ icon, text, variant }: FeatureItemProps) {
  const iconColors = {
    success: 'text-green-400',
    warning: 'text-red-400',
    info: 'text-slate-400',
  };

  const textColors = {
    success: 'text-green-300',
    warning: 'text-red-300',
    info: 'text-slate-400',
  };

  const IconComponent = {
    check: CheckIcon,
    cross: ({ className }: { className: string }) => (
      <svg className={className} fill='currentColor' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
          clipRule='evenodd'
        />
      </svg>
    ),
    info: ({ className }: { className: string }) => (
      <svg className={className} fill='currentColor' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
          clipRule='evenodd'
        />
      </svg>
    ),
  }[icon];

  return (
    <div className='flex items-center text-xs'>
      <IconComponent className={`w-3 h-3 mr-2 ${iconColors[variant]}`} />
      <span className={textColors[variant]}>{text}</span>
    </div>
  );
}
