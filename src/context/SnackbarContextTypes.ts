import { createContext } from 'react';
import type { SnackbarType } from '../components/ui/Snackbar';

export interface SnackbarState {
  message: string;
  type: SnackbarType;
  isVisible: boolean;
}

export interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
