/**
 * Common UI styling constants to reduce duplication
 */
export const UI_STYLES = {
  GRADIENTS: {
    PRIMARY: 'bg-gradient-to-r from-blue-600 to-blue-700',
    PRIMARY_HOVER: 'hover:from-blue-700 hover:to-blue-800',
    SUCCESS: 'bg-gradient-to-r from-green-600 to-green-700',
    SUCCESS_HOVER: 'hover:from-green-700 hover:to-green-800',
    WARNING: 'bg-gradient-to-r from-amber-500 to-amber-600',
    DANGER: 'bg-gradient-to-r from-red-500 to-red-600',
    CARD: 'bg-gradient-to-br from-slate-800 to-slate-900',
    CARD_HEADER: 'bg-gradient-to-br from-slate-700 to-slate-600',
    INFO_CARD: 'bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-purple-600/10',
    ERROR_CARD: 'bg-gradient-to-r from-red-500/10 to-red-600/10',
  },
  BORDERS: {
    DEFAULT: 'border border-slate-700/50',
    FOCUS: 'focus:ring-2 focus:border-transparent',
    ERROR: 'border-red-500 focus:ring-red-500 ring-2 ring-red-500/50',
    SUCCESS: 'border-green-500 focus:ring-green-500',
    INFO: 'border-blue-500/20',
  },
  SHADOWS: {
    DEFAULT: 'shadow-lg',
    HOVER: 'hover:shadow-xl',
    CARD: 'shadow-2xl',
  },
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-300',
    FAST: 'transition-all duration-200',
    SLOW: 'transition-all duration-500',
  },
  ROUNDED: {
    DEFAULT: 'rounded-xl',
    LARGE: 'rounded-2xl',
    FULL: 'rounded-full',
  },
} as const;

/**
 * Common spacing and sizing constants
 */
export const UI_SPACING = {
  PADDING: {
    SMALL: 'p-4',
    MEDIUM: 'p-6',
    LARGE: 'p-8',
  },
  MARGIN: {
    SMALL: 'm-4',
    MEDIUM: 'm-6',
    LARGE: 'm-8',
  },
  GAP: {
    SMALL: 'gap-4',
    MEDIUM: 'gap-6',
    LARGE: 'gap-8',
  },
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZES = {
  SMALL: 'w-4 h-4',
  MEDIUM: 'w-5 h-5',
  LARGE: 'w-6 h-6',
  EXTRA_LARGE: 'w-8 h-8',
} as const;