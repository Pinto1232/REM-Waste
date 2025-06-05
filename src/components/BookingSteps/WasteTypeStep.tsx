import { useState, useEffect } from 'react';
import type { BookingFormData } from '../../types/booking';
import { WASTE_TYPES } from '../../types/booking';
import { BaseLayout } from '../../layouts';

interface WasteTypeStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function WasteTypeStep({ formData, onUpdate, onNext, onPrev }: WasteTypeStepProps) {
  const [selectedType, setSelectedType] = useState(formData.wasteType || '');

  useEffect(() => {
    setSelectedType(formData.wasteType || '');
  }, [formData.wasteType]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    onUpdate({ wasteType: typeId });
  };

  const handleContinue = () => {
    if (selectedType) {
      onNext();
    }
  };

  const getWasteTypeColors = (typeId: string) => {
    switch (typeId) {
      case 'general':
        return {
          gradient: 'from-blue-500 to-blue-600',
          ring: 'ring-blue-400/50',
          shadow: 'shadow-blue-500/25',
          overlay: 'from-blue-500/10 to-blue-600/10',
          badge: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        };
      case 'construction':
        return {
          gradient: 'from-orange-500 to-orange-600',
          ring: 'ring-orange-400/50',
          shadow: 'shadow-orange-500/25',
          overlay: 'from-orange-500/10 to-orange-600/10',
          badge: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
        };
      case 'garden':
        return {
          gradient: 'from-green-500 to-green-600',
          ring: 'ring-green-400/50',
          shadow: 'shadow-green-500/25',
          overlay: 'from-green-500/10 to-green-600/10',
          badge: 'bg-green-500/10 border-green-500/20 text-green-300',
        };
      case 'mixed':
        return {
          gradient: 'from-purple-500 to-purple-600',
          ring: 'ring-purple-400/50',
          shadow: 'shadow-purple-500/25',
          overlay: 'from-purple-500/10 to-purple-600/10',
          badge: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
        };
      default:
        return {
          gradient: 'from-slate-600 to-slate-700',
          ring: 'ring-slate-400/50',
          shadow: 'shadow-slate-500/25',
          overlay: 'from-slate-500/10 to-slate-600/10',
          badge: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
        };
    }
  };

  const getWasteTypeExamples = (typeId: string): string[] => {
    switch (typeId) {
      case 'general':
        return ['Household rubbish', 'Office waste', 'Packaging materials', 'Non-recyclable items'];
      case 'construction':
        return ['Bricks & concrete', 'Plasterboard', 'Timber & wood', 'Metal & pipes'];
      case 'garden':
        return ['Grass cuttings', 'Tree branches', 'Soil & turf', 'Plant waste'];
      case 'mixed':
        return ['Multiple waste types', 'Renovation debris', 'Clearance projects', 'Various materials'];
      default:
        return [];
    }
  };

  const getWasteTypeIcon = (typeId: string) => {
    switch (typeId) {
      case 'general':
        return (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        );
      case 'construction':
        return (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
            />
          </svg>
        );
      case 'garden':
        return (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
            />
          </svg>
        );
      case 'mixed':
        return (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
            />
          </svg>
        );
      default:
        return (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        );
    }
  };

  return (
    <BaseLayout
      title='What Type of Waste?'
      subtitle='Select the type of waste you need to dispose of'
      maxWidth='6xl'
      backgroundColor='gray-900'
      padding='md'
    >
      {}
      <div className='bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <svg className='w-6 h-6 text-blue-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-300 mb-1'>Waste Type Information</h3>
            <p className='text-sm text-slate-300'>
              Different waste types may have specific disposal requirements and pricing. Select the category that best
              matches your waste to ensure proper handling.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12'>
        {WASTE_TYPES.map(type => {
          const colors = getWasteTypeColors(type.id);
          const examples = getWasteTypeExamples(type.id);
          const isSelected = selectedType === type.id;

          return (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`group cursor-pointer bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden ${
                isSelected
                  ? `border-${colors.gradient.split('-')[1]}-400 ring-2 ${colors.ring} ${colors.shadow}`
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {}
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.overlay} pointer-events-none`} />
              )}

              {}
              <div className='relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-5 sm:p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r ${
                        isSelected ? colors.gradient : 'from-slate-600 to-slate-700'
                      }`}
                    >
                      {getWasteTypeIcon(type.id)}
                    </div>
                    <div className='ml-4'>
                      <h3 className='text-lg font-bold text-white'>{type.name}</h3>
                      <p className='text-slate-300 text-sm'>{type.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${colors.gradient}`}
                    >
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className='p-5 sm:p-6'>
                <div className='space-y-3 mb-5'>
                  <h4 className='text-sm font-semibold text-slate-300 mb-3'>Common items include:</h4>
                  {examples.slice(0, 3).map((example: string, index: number) => (
                    <div key={index} className='flex items-center text-slate-300'>
                      <svg
                        className={`w-4 h-4 mr-3 ${
                          isSelected ? `text-${colors.gradient.split('-')[1]}-400` : 'text-slate-400'
                        }`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      <span className='text-sm'>{example}</span>
                    </div>
                  ))}
                </div>

                <div className={`border rounded-lg p-3 ${colors.badge}`}>
                  <p className='text-sm font-medium'>
                    {type.id === 'general' && '✓ Most common choice for household waste'}
                    {type.id === 'construction' && '⚠️ Heavy materials - weight restrictions apply'}
                    {type.id === 'garden' && '🌱 Biodegradable waste - eco-friendly disposal'}
                    {type.id === 'mixed' && '📦 Flexible option for various waste types'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {}
      {selectedType && (
        <div className='bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-8 sm:mb-12'>
          <h4 className='text-lg font-semibold text-white mb-4 flex items-center'>
            <svg className='w-5 h-5 mr-2 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            Selected Waste Type
          </h4>
          <div className='flex items-center'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r ${
                getWasteTypeColors(selectedType).gradient
              }`}
            >
              {getWasteTypeIcon(selectedType)}
            </div>
            <div>
              <p className='text-white font-medium'>{WASTE_TYPES.find(type => type.id === selectedType)?.name}</p>
              <p className='text-slate-400 text-sm'>
                {WASTE_TYPES.find(type => type.id === selectedType)?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {}
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
                disabled={!selectedType}
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
