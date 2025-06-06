#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GIT_HOOKS_DIR = path.join(process.cwd(), '.git', 'hooks');
const PRE_COMMIT_HOOK = path.join(GIT_HOOKS_DIR, 'pre-commit');

const PRE_COMMIT_SCRIPT = `#!/bin/sh
# Pre-commit hook for automatic code formatting

echo "🔍 Running pre-commit checks..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\\.(ts|tsx|js|jsx)$" | grep "src/components")

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No component files to check"
  exit 0
fi

echo "📁 Found component files to format:"
echo "$STAGED_FILES"

# Format components
echo "🎨 Formatting components..."
npm run format-components

# Run ESLint
echo "🔍 Running ESLint..."
npm run lint:components

# Check TypeScript
echo "🔧 Type checking..."
npm run type-check

if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix TypeScript errors before committing."
  exit 1
fi

# Add formatted files back to staging
echo "📝 Adding formatted files to staging..."
for FILE in $STAGED_FILES; do
  if [ -f "$FILE" ]; then
    git add "$FILE"
  fi
done

echo "✅ Pre-commit checks completed successfully!"
exit 0
`;

function setupPreCommitHook() {
  try {

    if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
      console.error('❌ Not a git repository. Please run this script in a git repository.');
      process.exit(1);
    }

    if (!fs.existsSync(GIT_HOOKS_DIR)) {
      fs.mkdirSync(GIT_HOOKS_DIR, { recursive: true });
      console.log('📁 Created .git/hooks directory');
    }

    if (fs.existsSync(PRE_COMMIT_HOOK)) {
      const backup = `${PRE_COMMIT_HOOK}.backup.${Date.now()}`;
      fs.renameSync(PRE_COMMIT_HOOK, backup);
      console.log(`📋 Backed up existing pre-commit hook to: ${path.basename(backup)}`);
    }

    fs.writeFileSync(PRE_COMMIT_HOOK, PRE_COMMIT_SCRIPT, { mode: 0o755 });
    console.log('✅ Pre-commit hook installed successfully!');

    if (process.platform !== 'win32') {
      fs.chmodSync(PRE_COMMIT_HOOK, 0o755);
      console.log('🔧 Made pre-commit hook executable');
    }

    console.log('\n🎉 Setup complete!');
    console.log('\nThe pre-commit hook will now:');
    console.log('  ✅ Format component files automatically');
    console.log('  ✅ Run ESLint and fix issues');
    console.log('  ✅ Perform TypeScript type checking');
    console.log('  ✅ Add formatted files back to staging');
    console.log('\nTo disable temporarily: git commit --no-verify');

  } catch (error) {
    console.error('❌ Error setting up pre-commit hook:', error.message);
    process.exit(1);
  }
}

function removePreCommitHook() {
  try {
    if (fs.existsSync(PRE_COMMIT_HOOK)) {
      fs.unlinkSync(PRE_COMMIT_HOOK);
      console.log('✅ Pre-commit hook removed successfully!');
    } else {
      console.log('ℹ️  No pre-commit hook found to remove.');
    }
  } catch (error) {
    console.error('❌ Error removing pre-commit hook:', error.message);
    process.exit(1);
  }
}

function showStatus() {
  const exists = fs.existsSync(PRE_COMMIT_HOOK);
  console.log(`Pre-commit hook status: ${exists ? '✅ Installed' : '❌ Not installed'}`);

  if (exists) {
    const stats = fs.statSync(PRE_COMMIT_HOOK);
    console.log(`Last modified: ${stats.mtime.toISOString()}`);
    console.log(`File size: ${stats.size} bytes`);

    if (process.platform !== 'win32') {
      const mode = stats.mode & parseInt('777', 8);
      const isExecutable = (mode & parseInt('111', 8)) !== 0;
      console.log(`Executable: ${isExecutable ? '✅ Yes' : '❌ No'}`);
    }
  }
}

const command = process.argv[2];

switch (command) {
  case 'install':
  case 'setup':
    setupPreCommitHook();
    break;
  case 'remove':
  case 'uninstall':
    removePreCommitHook();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('Pre-commit Hook Setup');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/setup-pre-commit.js install   - Install pre-commit hook');
    console.log('  node scripts/setup-pre-commit.js remove    - Remove pre-commit hook');
    console.log('  node scripts/setup-pre-commit.js status    - Show hook status');
    console.log('');
    console.log('The pre-commit hook will automatically format component files before commits.');
    break;
}
