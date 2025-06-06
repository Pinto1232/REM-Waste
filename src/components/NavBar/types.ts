import type { HTMLAttributes, ReactNode } from 'react';

export type NavBarVariant = 'default' | 'primary' | 'secondary' | 'transparent';

export interface NavBarMenuItem {
  id?: string;

  label: string;

  icon?: ReactNode;

  href?: string;

  active?: boolean;

  disabled?: boolean;

  data?: unknown;
}

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;

  className?: string;

  variant?: NavBarVariant;

  menuItems?: NavBarMenuItem[];

  onMenuItemClick?: (item: NavBarMenuItem, index: number) => void;

  showMobileMenu?: boolean;

  onMobileMenuToggle?: (isOpen: boolean) => void;
}
