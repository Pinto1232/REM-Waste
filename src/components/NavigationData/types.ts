export interface NavigationConfig {
  activeRoute?: string;

  activeId?: string;
}

export interface ExtendedNavBarMenuItem {
  id: string;

  label: string;

  href: string;

  active?: boolean;

  disabled?: boolean;

  description?: string;

  category?: string;
}
