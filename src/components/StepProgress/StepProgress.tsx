import type { StepConfig } from '../../types/booking';

interface StepProgressProps {
  steps: StepConfig[];
  onStepClick?: (stepId: string) => void;
}

export function StepProgress({ steps, onStepClick }: StepProgressProps) {
  return (
    <div className='bg-gray-900 py-4 sm:py-6'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        {}
        <div className='hidden md:flex items-center justify-between'>
          {steps.map((step, index) => (
            <div key={step.id} className='flex items-center'>
              {}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step.isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step.isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                } ${onStepClick ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => onStepClick?.(step.id)}
              >
                {step.isCompleted && !step.isActive ? (
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <span className='text-sm font-medium'>{index + 1}</span>
                )}
              </div>

              {}
              <div className='ml-3'>
                <p
                  className={`text-sm font-medium ${
                    step.isActive
                      ? 'text-blue-400'
                      : step.isCompleted
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>

              {}
              {index < steps.length - 1 && (
                <div className='flex-1 mx-6'>
                  <div
                    className={`h-0.5 ${
                      steps[index + 1].isCompleted || steps[index + 1].isActive
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {}
        <div className='md:hidden'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    step.isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : step.isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-400'
                  } ${onStepClick ? 'cursor-pointer hover:opacity-80' : ''}`}
                  onClick={() => onStepClick?.(step.id)}
                >
                  {step.isCompleted && !step.isActive ? (
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <span className='text-xs font-medium'>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && <div className='w-4 h-0.5 bg-gray-600 mx-1' />}
              </div>
            ))}
          </div>

          {}
          <div className='text-center'>
            {steps.map(step =>
              step.isActive ? (
                <p key={step.id} className='text-sm font-medium text-blue-400'>
                  {step.title}
                </p>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
