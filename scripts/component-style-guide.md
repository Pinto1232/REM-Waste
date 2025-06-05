# Component Style Guide

This document defines the consistent formatting and structure standards for all components in the project.

## File Structure

### Component Directory Structure
```
ComponentName/
├── ComponentName.tsx     # Main component file
├── types.ts             # Type definitions
├── styles.css           # Component styles
└── index.ts             # Export barrel
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `ErrorBoundary.tsx`, `UserProfile.tsx`)
- **Types**: camelCase with descriptive suffixes (e.g., `userProfileTypes.ts`)
- **Styles**: kebab-case (e.g., `error-boundary.css`, `user-profile.css`)
- **Utilities**: camelCase (e.g., `formatUtils.ts`, `apiHelpers.ts`)

## Import Organization

### Import Order (Enforced by ESLint)
1. **React imports** - React core and React-related libraries
2. **External libraries** - Third-party packages
3. **Internal imports** - Project modules using `@/` alias
4. **Relative imports** - Local files using `../` or `./`
5. **Type imports** - Type-only imports
6. **Style imports** - CSS/SCSS files

### Example
```typescript
import { Component, type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/services/api';
import { formatError } from '@/utils/errorUtils';

import { validateProps } from '../utils/validation';
import { ErrorDisplay } from './ErrorDisplay';

import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

import './styles.css';
```

## Component Structure

### Standard Component Template
```typescript
// 1. Imports (organized as above)
import { Component } from 'react';
import type { ComponentProps } from './types';
import './styles.css';

// 2. Types and Interfaces (if not in separate file)
interface LocalState {
  isLoading: boolean;
}

// 3. Constants
const DEFAULT_CONFIG = {
  timeout: 5000,
  retries: 3,
};

// 4. Component Definition
export function ComponentName({ prop1, prop2, ...props }: ComponentProps) {
  // Component logic here
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
}

// 5. Default export (if needed)
export default ComponentName;
```

## TypeScript Conventions

### Interface Naming
- **Props interfaces**: `ComponentNameProps`
- **State interfaces**: `ComponentNameState`
- **Event handlers**: `onEventName` (e.g., `onClick`, `onSubmit`)
- **Boolean props**: Use positive naming (e.g., `isVisible`, `hasError`)

### Type Definitions
```typescript
// ✅ Good
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// ❌ Avoid
interface IErrorBoundaryProps {  // Don't prefix with 'I'
  children: any;                 // Don't use 'any'
}
```

### Function Components
```typescript
// ✅ Preferred: Named function export
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return <div>{children}</div>;
}

// ✅ Alternative: Arrow function with explicit type
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  return <div>{children}</div>;
};
```

## JSX Formatting

### Props Formatting
```typescript
// ✅ Single line for few props
<Button type="submit" disabled={isLoading} />

// ✅ Multi-line for many props
<ComplexComponent
  className="error-boundary"
  fallback={<ErrorFallback />}
  onError={handleError}
  retryCount={3}
/>

// ✅ Boolean props (no explicit true)
<Button disabled primary />

// ❌ Avoid explicit true
<Button disabled={true} primary={true} />
```

### Conditional Rendering
```typescript
// ✅ Preferred: Logical AND
{isVisible && <Component />}

// ✅ Ternary for either/or
{isLoading ? <Spinner /> : <Content />}

// ✅ Complex conditions: Extract to variable
const shouldShowError = hasError && !isRetrying;
return shouldShowError && <ErrorMessage />;
```

## CSS/Styling Conventions

### Class Naming (BEM-inspired)
```css
/* Component base */
.error-boundary {
  /* Base styles */
}

/* Component elements */
.error-boundary__content {
  /* Element styles */
}

.error-boundary__title {
  /* Element styles */
}

/* Component modifiers */
.error-boundary--loading {
  /* Modifier styles */
}

.error-boundary--critical {
  /* Modifier styles */
}
```

### Tailwind CSS Usage
```typescript
// ✅ Organized by category
<div className="
  flex items-center justify-center
  w-full h-full
  bg-white border border-gray-200 rounded-lg
  p-4 m-2
  text-gray-900 font-medium
  hover:bg-gray-50 focus:outline-none focus:ring-2
">
```

## Code Quality Rules

### ESLint Rules Enforced
- **Import organization**: Automatic sorting and grouping
- **Consistent type imports**: Use `type` keyword for type-only imports
- **No unused variables**: Remove or prefix with underscore
- **React best practices**: Self-closing tags, fragment syntax, prop sorting
- **Naming conventions**: PascalCase for components, camelCase for functions

### Prettier Configuration
- **Print width**: 120 characters for JSX, 100 for other files
- **Single quotes**: Preferred for strings and JSX
- **Trailing commas**: ES5 compatible
- **Semicolons**: Always required
- **Tab width**: 2 spaces

## Performance Considerations

### Component Optimization
```typescript
// ✅ Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexVisualization data={data} />;
});

// ✅ Use useCallback for event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveTransform(item));
}, [data]);
```

## Error Handling

### Error Boundaries
```typescript
// ✅ Wrap components that might throw
<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>

// ✅ Provide meaningful error messages
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="error-fallback">
    <h2>Something went wrong</h2>
    <details>
      <summary>Error details</summary>
      <pre>{error.message}</pre>
    </details>
  </div>
);
```

## Testing Considerations

### Component Testing Structure
```typescript
// ComponentName.test.tsx
describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
  });

  it('handles props correctly', () => {
    const props = { /* test props */ };
    render(<ComponentName {...props} />);
    // Assertions
  });

  it('handles user interactions', () => {
    const onAction = jest.fn();
    render(<ComponentName onAction={onAction} />);
    // User event simulation and assertions
  });
});
```

## Accessibility

### ARIA and Semantic HTML
```typescript
// ✅ Use semantic HTML elements
<button type="button" onClick={handleClick}>
  Click me
</button>

// ✅ Provide ARIA labels when needed
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  ×
</button>

// ✅ Use proper heading hierarchy
<section>
  <h2>Section Title</h2>
  <h3>Subsection</h3>
</section>
```

## Documentation

### Component Documentation
```typescript
/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  // Implementation
}
```

## Automation

### Available Scripts
- `npm run format-components` - Format all component files
- `npm run lint` - Run ESLint on all files
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run prettier` - Format with Prettier
- `npm run type-check` - Run TypeScript compiler

### Pre-commit Hooks
The project automatically formats code before commits using:
1. Import organization
2. Prettier formatting
3. ESLint auto-fixes
4. Type checking
