import { useMemo } from 'react';
import type { NavBarMenuItem } from '../NavBar/types';

export function useNavigationItems(activeRoute?: string): NavBarMenuItem[] {
  const menuItems = useMemo(
    (): NavBarMenuItem[] => [
      {
        id: 'home',
        label: 'Home',
        href: '/',
        active: activeRoute === '/',
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        active: activeRoute === '/dashboard',
      },
      {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        active: activeRoute === '/reports',
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        active: activeRoute === '/settings',
      },
    ],
    [activeRoute]
  );

  return menuItems;
}

export const navigationItems: NavBarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    active: true,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
  },
];

export function getNavigationItems(activeId?: string): NavBarMenuItem[] {
  return navigationItems.map(item => ({
    ...item,
    active: item.id === activeId,
  }));
}
