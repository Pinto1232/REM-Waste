import { memo, forwardRef, useCallback, useState, useEffect } from 'react';
import type { NavBarProps } from './types';
import './styles.css';

const NavBarBase = forwardRef<HTMLElement, NavBarProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      logo,
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
      (item: any, index: number) => {
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

    const navClasses = ['navbar', `navbar-${variant}`, className].filter(Boolean).join(' ');

    return (
      <nav ref={ref} className={navClasses} {...props}>
        <div className='navbar-container'>
          <div className='navbar-content'>
            {}
            <div className='navbar-brand'>
              {logo && (
                <div className='navbar-logo'>
                  {typeof logo === 'string' ? (
                    <span className='navbar-logo-text'>{logo}</span>
                  ) : (
                    logo
                  )}
                </div>
              )}
            </div>

            {}
            <div className='flex items-center space-x-6'>
              {}
              <div className='navbar-menu-desktop'>
                {menuItems.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    className={`navbar-menu-item ${item.active ? 'navbar-menu-item-active' : ''}`}
                    onClick={() => handleMenuItemClick(item, index)}
                    disabled={item.disabled}
                  >
                    {item.icon && <span className='navbar-menu-item-icon'>{item.icon}</span>}
                    <span className='navbar-menu-item-text'>{item.label}</span>
                  </button>
                ))}
              </div>

              {}
              {children && <div className='navbar-extra'>{children}</div>}

              {}
              <div className='navbar-mobile-toggle'>
                <button
                  className='navbar-mobile-button'
                  onClick={handleMobileMenuToggle}
                  aria-label='Toggle mobile menu'
                >
                  <span
                    className={`navbar-hamburger ${
                      isMobileMenuOpen ? 'navbar-hamburger-open' : ''
                    }`}
                  >
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {}
          <div
            className={`navbar-menu-mobile ${isMobileMenuOpen ? 'navbar-menu-mobile-open' : ''}`}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.id ?? index}
                className={`navbar-menu-item-mobile ${
                  item.active ? 'navbar-menu-item-mobile-active' : ''
                }`}
                onClick={() => handleMenuItemClick(item, index)}
                disabled={item.disabled}
              >
                {item.icon && <span className='navbar-menu-item-icon'>{item.icon}</span>}
                <span className='navbar-menu-item-text'>{item.label}</span>
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
