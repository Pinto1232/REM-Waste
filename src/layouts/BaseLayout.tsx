import type { ReactNode } from 'react';
import { NavBar, type NavBarMenuItem } from '../components/NavBar';
import { useNavigationItems } from '../components/NavigationData';

interface BaseLayoutProps {
  readonly children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const menuItems = useNavigationItems('/'); 

  const handleMenuItemClick = (item: NavBarMenuItem) => {
    console.log('Navigation clicked:', item);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar
        logo="REM Waste"
        variant="default"
        menuItems={menuItems}
        onMenuItemClick={handleMenuItemClick}
      />

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
