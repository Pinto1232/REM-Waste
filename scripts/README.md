# Comment Removal Scripts

This directory contains scripts to remove comments from component files while preserving ESLint, TypeScript, and Prettier directives.

## Available Scripts

### 1. Node.js Script (`remove-comments.js`)
The main script written in JavaScript that works cross-platform.

**Usage:**
```bash
# Using npm script (recommended)
npm run remove-comments

# Direct execution
node scripts/remove-comments.js
```

### 2. PowerShell Script (`remove-comments.ps1`)
Windows PowerShell version with additional options.

**Usage:**
```powershell
# Basic usage
.\scripts\remove-comments.ps1

# Dry run (preview changes without modifying files)
.\scripts\remove-comments.ps1 -DryRun

# Verbose output
.\scripts\remove-comments.ps1 -Verbose

# Custom components path
.\scripts\remove-comments.ps1 -ComponentsPath "src\custom-components"

# Combine options
.\scripts\remove-comments.ps1 -DryRun -Verbose
```

### 3. Batch File (`remove-comments.bat`)
Simple Windows batch file wrapper.

**Usage:**
```cmd
scripts\remove-comments.bat
```

## What Gets Removed

The scripts remove the following types of comments:

- ✅ **Single-line comments**: `// This is a comment`
- ✅ **Multi-line comments**: `/* This is a comment */`
- ✅ **JSDoc comments**: `/** Documentation comment */`
- ✅ **Block comments**: Comments spanning multiple lines

## What Gets Preserved

The scripts preserve the following important comments:

- 🛡️ **ESLint directives**: `// eslint-disable-next-line`, `/* eslint-disable */`
- 🛡️ **TypeScript directives**: `// @ts-ignore`, `/* @ts-expect-error */`
- 🛡️ **Prettier directives**: `// prettier-ignore`, `/* prettier-ignore */`

## Examples

### Before Processing
```typescript
/**
 * ErrorBoundary component that catches JavaScript errors
 * This is a detailed description of the component
 */
class ErrorBoundary extends Component {
  // This is a regular comment that will be removed
  public state = {
    hasError: false, // Another comment to remove
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(error: Error) {
    /* This comment will be removed */
    return { hasError: true };
  }

  // @ts-ignore - This directive will be preserved
  public render() {
    // Regular comment - will be removed
    return this.props.children;
  }
}
```

### After Processing
```typescript
class ErrorBoundary extends Component {
  public state = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  // @ts-ignore - This directive will be preserved
  public render() {
    return this.props.children;
  }
}
```

## Configuration

### File Extensions
By default, the scripts process files with these extensions:
- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files

### Target Directory
- **Default**: `src/components`
- **Customizable**: Use the PowerShell script with `-ComponentsPath` parameter

### Preserved Comment Patterns
The scripts preserve comments matching these patterns:
- `eslint` (case-insensitive)
- `@ts-` (TypeScript directives)
- `prettier` (case-insensitive)

## Safety Features

1. **Backup Recommendation**: Always commit your changes to version control before running the scripts
2. **Dry Run**: Use PowerShell script with `-DryRun` to preview changes
3. **String Handling**: Comments inside string literals are preserved
4. **Error Handling**: Scripts continue processing other files if one file fails

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure you have write permissions to the component files
2. **File Encoding**: Scripts handle UTF-8 encoding by default
3. **Complex Comments**: Very complex nested comments might need manual review

### Getting Help

If you encounter issues:
1. Run with verbose output (PowerShell: `-Verbose`)
2. Check the console output for specific error messages
3. Ensure all files are saved and not open in editors that might lock them

## Integration with Development Workflow

### Pre-commit Hook
You can integrate this into your git pre-commit hooks:
```bash
npm run remove-comments
```

### CI/CD Pipeline
Add to your build process to ensure clean code:
```yaml
- name: Remove comments
  run: npm run remove-comments
```

### IDE Integration
Most IDEs can run npm scripts directly from their interface.
