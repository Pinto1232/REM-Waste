import { memo, forwardRef, useCallback, useState, useEffect } from 'react';
import type { NavBarProps, NavBarMenuItem } from './types';

const NavBarBase = forwardRef<HTMLElement, NavBarProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      menuItems = [],
      onMenuItemClick,
      showMobileMenu = false,
      onMobileMenuToggle,
      ...props
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(showMobileMenu);

    const handleMenuItemClick = useCallback(
      (item: NavBarMenuItem, index: number) => {
        if (onMenuItemClick) {
          onMenuItemClick(item, index);
        }
      },
      [onMenuItemClick]
    );

    const handleMobileMenuToggle = useCallback(() => {
      const newState = !isMobileMenuOpen;
      setIsMobileMenuOpen(newState);
      if (onMobileMenuToggle) {
        onMobileMenuToggle(newState);
      }
    }, [isMobileMenuOpen, onMobileMenuToggle]);

    useEffect(() => {
      setIsMobileMenuOpen(showMobileMenu);
    }, [showMobileMenu]);

    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-blue-600 text-white shadow-md';
        case 'secondary':
          return 'bg-gray-800 text-white shadow-md';
        case 'transparent':
          return 'bg-transparent';
        default:
          return 'bg-white border-b border-gray-200 shadow-sm';
      }
    };

    const navClasses = `sticky top-0 w-full transition-all duration-200 ease-in-out z-50 ${getVariantClasses()} ${className}`;

    return (
      <nav ref={ref} className={navClasses} {...props}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {}
            <div className='flex-shrink-0 flex items-center'>
              <div className='flex items-center'>
                <img src='/vite.png' alt='REM Waste Logo' className='h-10 w-10 object-contain' />
              </div>
            </div>

            {}
            <div className='flex items-center space-x-6'>
              {}
              <div className='hidden md:flex md:space-x-6'>
                {menuItems.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      variant === 'primary'
                        ? item.active
                          ? 'text-white bg-blue-700'
                          : 'text-blue-100 hover:text-white hover:bg-blue-700'
                        : variant === 'secondary'
                          ? item.active
                            ? 'text-white bg-gray-700'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : item.active
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => handleMenuItemClick(item, index)}
                    disabled={item.disabled}
                  >
                    {item.icon && <span className='mr-2 flex-shrink-0'>{item.icon}</span>}
                    <span className='truncate'>{item.label}</span>
                  </button>
                ))}
              </div>

              {}
              {children && <div className='flex items-center space-x-4'>{children}</div>}

              {}
              <div className='md:hidden'>
                <button
                  className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                    variant === 'primary'
                      ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                      : variant === 'secondary'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onClick={handleMobileMenuToggle}
                  aria-label='Toggle mobile menu'
                  aria-expanded={isMobileMenuOpen}
                >
                  <div className='relative w-6 h-6 flex flex-col justify-center items-center'>
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen
                          ? 'transform rotate-45 translate-y-0'
                          : 'transform -translate-y-1'
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'opacity-0' : ''
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen
                          ? 'transform -rotate-45 translate-y-0'
                          : 'transform translate-y-1'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {}
          <div
            className={`md:hidden absolute top-full left-0 right-0 shadow-lg transform transition-all duration-300 ease-in-out ${
              variant === 'primary'
                ? 'bg-blue-600 border-blue-700'
                : variant === 'secondary'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-b border-gray-200'
            } ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.id ?? index}
                className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-200 border-b last:border-b-0 ${
                  variant === 'primary'
                    ? item.active
                      ? 'text-white bg-blue-700 border-blue-700'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700 border-blue-700'
                    : variant === 'secondary'
                      ? item.active
                        ? 'text-white bg-gray-700 border-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                      : item.active
                        ? 'text-blue-600 bg-blue-50 border-gray-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => handleMenuItemClick(item, index)}
                disabled={item.disabled}
              >
                <div className='flex items-center'>
                  {item.icon && <span className='mr-2 flex-shrink-0'>{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  }
);

NavBarBase.displayName = 'NavBar';

export const NavBar = memo(NavBarBase);
