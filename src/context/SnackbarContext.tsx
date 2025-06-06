import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Snackbar } from '../components/ui/Snackbar';
import type { SnackbarType } from '../components/ui/Snackbar';
import { SnackbarContext, type SnackbarState } from './SnackbarContextTypes';

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType = 'success') => {
    setSnackbar({
      message,
      type,
      isVisible: true,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
}