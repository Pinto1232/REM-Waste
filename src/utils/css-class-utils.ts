const classCache = new Map<string, string>();

export function cn(...classes: (string | undefined | null | false)[]): string {
  const key = classes.join('|');

  if (classCache.has(key)) {
    return classCache.get(key)!;
  }

  const result = classes.filter(Boolean).join(' ');
  classCache.set(key, result);

  return result;
}

export function conditionalClasses(
  baseClass: string,
  conditionalClasses: Record<string, boolean>
): string {
  const cacheKey = `${baseClass}:${Object.entries(conditionalClasses)
    .map(([cls, condition]) => `${cls}=${condition}`)
    .join(',')}`;

  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }

  const classes = [baseClass];

  for (const [className, condition] of Object.entries(conditionalClasses)) {
    if (condition) {
      classes.push(className);
    }
  }

  const result = classes.join(' ');
  classCache.set(cacheKey, result);

  return result;
}

export function variantClasses<T extends string>(
  baseClass: string,
  variant: T,
  variantMap: Record<T, string>,
  additionalClasses?: string
): string {
  const cacheKey = `${baseClass}:${variant}:${additionalClasses || ''}`;

  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }

  const variantClass = variantMap[variant];
  const result = additionalClasses
    ? `${baseClass} ${variantClass} ${additionalClasses}`
    : `${baseClass} ${variantClass}`;

  classCache.set(cacheKey, result);

  return result;
}

export const UI_CLASS_COMBINATIONS = {

  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    },
    sizes: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },

  card: {
    base: 'rounded-lg border bg-white shadow-sm',
    variants: {
      default: 'border-gray-200',
      elevated: 'border-gray-200 shadow-md',
      outlined: 'border-gray-300',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },

  input: {
    base: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
    variants: {
      default: 'border-gray-300',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    },
    sizes: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-3 py-2',
      lg: 'px-4 py-3 text-lg',
    },
  },
} as const;

export function buttonClasses(
  variant: keyof typeof UI_CLASS_COMBINATIONS.button.variants = 'primary',
  size: keyof typeof UI_CLASS_COMBINATIONS.button.sizes = 'md',
  additionalClasses?: string
): string {
  const { base, variants, sizes } = UI_CLASS_COMBINATIONS.button;
  const cacheKey = `btn:${variant}:${size}:${additionalClasses || ''}`;

  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }

  const result = cn(base, variants[variant], sizes[size], additionalClasses);
  classCache.set(cacheKey, result);

  return result;
}

export function cardClasses(
  variant: keyof typeof UI_CLASS_COMBINATIONS.card.variants = 'default',
  padding: keyof typeof UI_CLASS_COMBINATIONS.card.padding = 'md',
  additionalClasses?: string
): string {
  const { base, variants, padding: paddingClasses } = UI_CLASS_COMBINATIONS.card;
  const cacheKey = `card:${variant}:${padding}:${additionalClasses || ''}`;

  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }

  const result = cn(base, variants[variant], paddingClasses[padding], additionalClasses);
  classCache.set(cacheKey, result);

  return result;
}

export function inputClasses(
  variant: keyof typeof UI_CLASS_COMBINATIONS.input.variants = 'default',
  size: keyof typeof UI_CLASS_COMBINATIONS.input.sizes = 'md',
  additionalClasses?: string
): string {
  const { base, variants, sizes } = UI_CLASS_COMBINATIONS.input;
  const cacheKey = `input:${variant}:${size}:${additionalClasses || ''}`;

  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }

  const result = cn(base, variants[variant], sizes[size], additionalClasses);
  classCache.set(cacheKey, result);

  return result;
}

export function clearClassCache(): void {
  classCache.clear();
}

export function getClassCacheStats(): { size: number; keys: string[] } {
  return {
    size: classCache.size,
    keys: Array.from(classCache.keys()),
  };
}