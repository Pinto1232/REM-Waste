#!/bin/bash

# Function to print usage
print_usage() {
  echo "Usage: ./create-component.sh <ComponentName> [-u|--ui]"
  echo "Options:"
  echo "  -u, --ui    Create as a reusable UI component in src/components/ui"
  echo "Examples:"
  echo "  ./create-component.sh Button --ui     # Creates a reusable UI component"
  echo "  ./create-component.sh UserProfile     # Creates a general component"
}

# Parse arguments
COMPONENT_NAME=""
IS_UI=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -u|--ui)
      IS_UI=true
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      if [ -z "$COMPONENT_NAME" ]; then
        COMPONENT_NAME="$1"
      else
        echo "Error: Unexpected argument $1"
        print_usage
        exit 1
      fi
      shift
      ;;
  esac
done

# Check if component name is provided
if [ -z "$COMPONENT_NAME" ]; then
  echo "Error: Component name is required"
  print_usage
  exit 1
fi

# Convert to PascalCase
COMPONENT_NAME="$(echo ${COMPONENT_NAME} | sed -r 's/(^|-)([a-z])/\U\2/g')"

# Set component path based on type
if [ "$IS_UI" = true ]; then
  BASE_PATH="src/components/ui"
  echo "Creating reusable UI component in $BASE_PATH"
else
  BASE_PATH="src/components"
  echo "Creating general component in $BASE_PATH"
fi

COMPONENT_PATH="$BASE_PATH/$COMPONENT_NAME"

# Create component directory
mkdir -p "$COMPONENT_PATH"

# Create component file
cat > "$COMPONENT_PATH/$COMPONENT_NAME.tsx" << EOL
import { memo, forwardRef, useCallback, useState, useEffect } from 'react';
import type { ${COMPONENT_NAME}Props } from './types';
import './styles.css';

const ${COMPONENT_NAME}Base = forwardRef<HTMLDivElement, ${COMPONENT_NAME}Props>(
  ({ 
    children,
    className = '',
    variant = 'default',
    disabled = false,
    ...props
  }, ref) => {
    // Example state
    const [isActive, setIsActive] = useState(false);

    // Example callback
    const handleClick = useCallback(() => {
      if (!disabled) {
        setIsActive(prev => !prev);
      }
    }, [disabled]);

    // Example effect
    useEffect(() => {
      // Component mount logic here
      return () => {
        // Cleanup logic here
      };
    }, []);

    const componentClasses = [
      '${COMPONENT_NAME.toLowerCase()}',
      \`${COMPONENT_NAME.toLowerCase()}-\${variant}\`,
      isActive ? '${COMPONENT_NAME.toLowerCase()}-active' : '',
      disabled ? '${COMPONENT_NAME.toLowerCase()}-disabled' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div 
        ref={ref}
        className={componentClasses}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${COMPONENT_NAME}Base.displayName = '${COMPONENT_NAME}';

export const ${COMPONENT_NAME} = memo(${COMPONENT_NAME}Base);
EOL

# Create types file
cat > "$COMPONENT_PATH/types.ts" << EOL
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Variants available for the ${COMPONENT_NAME} component
 */
export type ${COMPONENT_NAME}Variant = 'default' | 'primary' | 'secondary';

/**
 * Props for the ${COMPONENT_NAME} component
 * @template T - Type of the data associated with the component
 */
export interface ${COMPONENT_NAME}Props extends HTMLAttributes<HTMLDivElement> {
  /** Content to be rendered within the component */
  children?: ReactNode;
  
  /** Additional CSS classes to be applied */
  className?: string;
  
  /** Visual variant of the component */
  variant?: ${COMPONENT_NAME}Variant;
  
  /** Whether the component is disabled */
  disabled?: boolean;
  
  /** Optional data associated with the component */
  data?: unknown;
}
EOL

# Create styles file
cat > "$COMPONENT_PATH/styles.css" << EOL
/* Base styles */
.${COMPONENT_NAME.toLowerCase()} {
  @apply relative transition-all duration-200 ease-in-out;
}

/* Variants */
.${COMPONENT_NAME.toLowerCase()}-default {
  @apply bg-white text-gray-900;
}

.${COMPONENT_NAME.toLowerCase()}-primary {
  @apply bg-blue-600 text-white;
}

.${COMPONENT_NAME.toLowerCase()}-secondary {
  @apply bg-gray-600 text-white;
}

/* States */
.${COMPONENT_NAME.toLowerCase()}-active {
  @apply ring-2 ring-blue-500 ring-offset-2;
}

.${COMPONENT_NAME.toLowerCase()}-disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Hover states */
.${COMPONENT_NAME.toLowerCase()}:not(.${COMPONENT_NAME.toLowerCase()}-disabled):hover {
  @apply shadow-md transform scale-[1.02];
}

/* Focus states */
.${COMPONENT_NAME.toLowerCase()}:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}
EOL

# Create index file for clean imports
cat > "$COMPONENT_PATH/index.ts" << EOL
export { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';
export type { ${COMPONENT_NAME}Props } from './types';
EOL

echo "✅ Component ${COMPONENT_NAME} created successfully in ${COMPONENT_PATH}"
echo "   Files created:"
echo "   - ${COMPONENT_NAME}.tsx"
echo "   - types.ts"
echo "   - styles.css"
echo "   - index.ts"
