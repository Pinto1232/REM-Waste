import { memo, forwardRef, useCallback, useState, useEffect, useMemo } from 'react';
import type { NavBarProps, NavBarMenuItem } from './types';
import './styles.css';

const NAV_CLASSES = {
  base: 'navbar',
  variants: {
    default: 'navbar-default',
    primary: 'navbar-primary',
    secondary: 'navbar-secondary',
    transparent: 'navbar-transparent',
  },
  menuItem: {
    base: 'navbar-menu-item',
    active: 'navbar-menu-item-active',
  },
  menuItemMobile: {
    base: 'navbar-menu-item-mobile',
    active: 'navbar-menu-item-mobile-active',
  },
  mobileMenu: {
    base: 'navbar-menu-mobile',
    open: 'navbar-menu-mobile-open',
  },
  hamburger: {
    base: 'navbar-hamburger',
    open: 'navbar-hamburger-open',
  },
} as const;

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

    const computedClasses = useMemo(
      () => ({
        nav: className
          ? `${NAV_CLASSES.base} ${NAV_CLASSES.variants[variant]} ${className}`
          : `${NAV_CLASSES.base} ${NAV_CLASSES.variants[variant]}`,
        mobileMenu: isMobileMenuOpen
          ? `${NAV_CLASSES.mobileMenu.base} ${NAV_CLASSES.mobileMenu.open}`
          : NAV_CLASSES.mobileMenu.base,
        hamburger: isMobileMenuOpen
          ? `${NAV_CLASSES.hamburger.base} ${NAV_CLASSES.hamburger.open}`
          : NAV_CLASSES.hamburger.base,
      }),
      [className, variant, isMobileMenuOpen]
    );

    const getMenuItemClass = useCallback(
      (isActive: boolean) =>
        isActive
          ? `${NAV_CLASSES.menuItem.base} ${NAV_CLASSES.menuItem.active}`
          : NAV_CLASSES.menuItem.base,
      []
    );

    const getMobileMenuItemClass = useCallback(
      (isActive: boolean) =>
        isActive
          ? `${NAV_CLASSES.menuItemMobile.base} ${NAV_CLASSES.menuItemMobile.active}`
          : NAV_CLASSES.menuItemMobile.base,
      []
    );

    return (
      <nav ref={ref} className={computedClasses.nav} {...props}>
        <div className='navbar-container'>
          <div className='navbar-content'>
            {}
            <div className='navbar-brand'>
              <div className='navbar-logo'>
                <img src='/vite.png' alt='REM Waste Logo' className='navbar-logo-icon' />
              </div>
            </div>

            {}
            <div className='flex items-center space-x-6'>
              {}
              <div className='navbar-menu-desktop'>
                {menuItems.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    className={getMenuItemClass(item.active || false)}
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
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className={computedClasses.hamburger}>
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {}
          <div className={computedClasses.mobileMenu}>
            {menuItems.map((item, index) => (
              <button
                key={item.id ?? index}
                className={getMobileMenuItemClass(item.active || false)}
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

NavBarBase.displayName = 'NavBarOptimized';

export const NavBarOptimized = memo(NavBarBase);
