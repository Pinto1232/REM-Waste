import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { CartProvider } from './CartContext';
import { SnackbarProvider } from './SnackbarContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <CartProvider>{children}</CartProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
