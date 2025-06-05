import { useState } from 'react';
import type { BookingFormData } from '../../types/booking';
import { BaseLayout } from '../../layouts';

interface PaymentStepProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onComplete: () => void;
  onPrev: () => void;
}

export function PaymentStep({ formData, onUpdate, onComplete, onPrev }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState(formData.paymentMethod || '');
  const [customerDetails, setCustomerDetails] = useState(formData.customerDetails || {
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleCustomerDetailsChange = (field: string, value: string) => {
    const updated = { ...customerDetails, [field]: value };
    setCustomerDetails(updated);
    onUpdate({ customerDetails: updated });
  };

  const handleComplete = () => {
    if (paymentMethod && customerDetails.name && customerDetails.email) {
      onUpdate({ paymentMethod });
      onComplete();
    }
  };

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    const totalPrice = priceBeforeVat * (1 + vat / 100);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(totalPrice);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
          </svg>
        );
      case 'paypal':
        return (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
          </svg>
        );
      case 'bank-transfer':
        return (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' />
          </svg>
        );
      default:
        return null;
    }
  };

  const isFormValid = paymentMethod && customerDetails.name && customerDetails.email;

  return (
    <BaseLayout
      title="Payment & Details"
      subtitle="Complete your booking with payment and contact information"
      maxWidth="7xl"
      backgroundColor="gray-900"
      padding="md"
    >
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8 sm:gap-12'>

        {}
        <div className='xl:col-span-1'>
          <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 sticky top-6'>
            <div className='flex items-center mb-6'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-white'>Order Summary</h3>
            </div>

            {formData.selectedSkip && (
              <div className='space-y-4'>
                {}
                <div className='bg-slate-700/30 rounded-xl p-4 border border-slate-600/50'>
                  <div className='flex items-center mb-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3'>
                      <span className='text-slate-800 font-bold text-xs'>SKIP</span>
                    </div>
                    <div>
                      <h4 className='text-white font-semibold'>{formData.selectedSkip.size} Yard Skip</h4>
                      <p className='text-slate-400 text-sm'>{formData.selectedSkip.hire_period_days} day hire</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-2xl font-bold text-blue-400'>
                      {formatPrice(formData.selectedSkip.price_before_vat, formData.selectedSkip.vat)}
                    </span>
                  </div>
                </div>

                {}
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between items-center py-2 border-b border-slate-700/50'>
                    <span className='text-slate-400 flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      Delivery Date
                    </span>
                    <span className='text-white font-medium'>{formData.deliveryDate}</span>
                  </div>

                  {formData.collectionDate && (
                    <div className='flex justify-between items-center py-2 border-b border-slate-700/50'>
                      <span className='text-slate-400 flex items-center'>
                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        Collection Date
                      </span>
                      <span className='text-white font-medium'>{formData.collectionDate}</span>
                    </div>
                  )}

                  <div className='flex justify-between items-center py-2 border-b border-slate-700/50'>
                    <span className='text-slate-400 flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                      Location
                    </span>
                    <span className='text-white font-medium'>{formData.postcode}</span>
                  </div>

                  <div className='flex justify-between items-center py-2 border-b border-slate-700/50'>
                    <span className='text-slate-400 flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      Waste Type
                    </span>
                    <span className='text-white font-medium capitalize'>{formData.wasteType}</span>
                  </div>
                </div>

                {}
                <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 mt-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-white'>Total Amount:</span>
                    <span className='text-2xl font-bold text-blue-300'>
                      {formatPrice(formData.selectedSkip.price_before_vat, formData.selectedSkip.vat)}
                    </span>
                  </div>
                  <p className='text-xs text-blue-300/70 mt-1'>Including VAT</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div className='xl:col-span-2 space-y-8'>

          {}
          <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8'>
            <div className='flex items-center mb-6'>
              <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>Customer Details</h3>
                <p className='text-slate-400 text-sm'>Your contact information</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-2'>
                  Full Name *
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={customerDetails.name}
                    onChange={(e) => handleCustomerDetailsChange('name', e.target.value)}
                    className='w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70'
                    placeholder='Enter your full name'
                    required
                  />
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-300 mb-2'>
                  Email Address *
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    value={customerDetails.email}
                    onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                    className='w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70'
                    placeholder='Enter your email'
                    required
                  />
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-300 mb-2'>
                  Phone Number
                </label>
                <div className='relative'>
                  <input
                    type='tel'
                    value={customerDetails.phone}
                    onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                    className='w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70'
                    placeholder='Enter your phone number'
                  />
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-300 mb-2'>
                  Address
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={customerDetails.address}
                    onChange={(e) => handleCustomerDetailsChange('address', e.target.value)}
                    className='w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:bg-slate-700/70'
                    placeholder='Enter your address'
                  />
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className='bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8'>
            <div className='flex items-center mb-6'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>Payment Method</h3>
                <p className='text-slate-400 text-sm'>Choose your preferred payment option</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[
                { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, Amex' },
                { id: 'paypal', name: 'PayPal', description: 'Secure PayPal payment' },
                { id: 'bank-transfer', name: 'Bank Transfer', description: 'Direct bank transfer' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`group p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    paymentMethod === method.id
                      ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-400/50'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      paymentMethod === method.id 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {getPaymentMethodIcon(method.id)}
                    </div>
                    {paymentMethod === method.id && (
                      <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className='text-white font-semibold mb-1'>{method.name}</h4>
                  <p className='text-slate-400 text-sm'>{method.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className='mt-12 sm:mt-16 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16'>
        <div className='bg-slate-800 border-t border-b border-slate-700 shadow-lg py-8 sm:py-10 px-6 sm:px-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center'>
              <button
                onClick={onPrev}
                className='w-full sm:w-48 h-12 bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base'
              >
                Back
              </button>
              <div className='hidden sm:block w-4'></div>
              <button
                onClick={handleComplete}
                disabled={!isFormValid}
                className='w-full sm:w-48 h-12 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base'
              >
                Complete Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}