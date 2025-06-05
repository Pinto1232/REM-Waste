import type { ReactNode } from 'react';

interface BaseLayoutProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  readonly backgroundColor?: 'gray-100' | 'gray-900';
  readonly padding?: 'sm' | 'md' | 'lg';
}

export function BaseLayout({ 
  children, 
  title, 
  subtitle, 
  maxWidth = '7xl',
  backgroundColor = 'gray-100',
  padding = 'md'
}: BaseLayoutProps) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  const paddingClasses = {
    'sm': 'p-4',
    'md': 'p-4 sm:p-6',
    'lg': 'p-6 sm:p-8'
  };

  const textColor = backgroundColor === 'gray-900' ? 'text-white' : 'text-gray-900';
  const subtitleColor = backgroundColor === 'gray-900' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen bg-${backgroundColor}`}>
      <main className="py-10">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto sm:px-6 lg:px-8`}>
          <div className={paddingClasses[padding]}>
            {(title || subtitle) && (
              <div className="text-center mb-6 sm:mb-8">
                {title && (
                  <h2 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-3 sm:mb-4`}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className={`${subtitleColor} text-sm sm:text-base`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
