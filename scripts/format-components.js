#!/usr/bin/env node

/**
 * Comprehensive component formatting script
 * Ensures consistent formatting across all component files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Formatting rules for consistent component structure
const FORMATTING_RULES = {
  // Import organization
  importOrder: [
    'react',
    'react-dom',
    '@/',
    '../',
    './',
    'types',
    'styles'
  ],
  
  // Component structure order
  componentOrder: [
    'imports',
    'types',
    'interfaces', 
    'constants',
    'component',
    'exports'
  ],

  // Spacing rules
  spacing: {
    afterImports: 2,
    beforeComponent: 1,
    afterComponent: 1,
    beforeExports: 1,
    insideComponent: 1
  }
};

/**
 * Organize imports according to our standards
 */
function organizeImports(content) {
  const lines = content.split('\n');
  const imports = [];
  const nonImports = [];
  let inImportSection = true;

  for (const line of lines) {
    if (line.trim().startsWith('import ') || line.trim().startsWith('export ') && line.includes('from')) {
      if (inImportSection) {
        imports.push(line);
      } else {
        nonImports.push(line);
      }
    } else if (line.trim() === '' && inImportSection) {
      // Keep empty lines in import section
      imports.push(line);
    } else {
      inImportSection = false;
      nonImports.push(line);
    }
  }

  // Sort imports by our rules
  const sortedImports = sortImports(imports.filter(line => line.trim() !== ''));
  
  // Combine with proper spacing
  const result = [
    ...sortedImports,
    '', // Empty line after imports
    ...nonImports.filter(line => line.trim() !== '' || nonImports.indexOf(line) === 0)
  ];

  return result.join('\n');
}

/**
 * Sort imports according to our import order rules
 */
function sortImports(imports) {
  const categories = {
    react: [],
    external: [],
    internal: [],
    relative: [],
    types: [],
    styles: []
  };

  imports.forEach(importLine => {
    if (importLine.includes('from \'react\'') || importLine.includes('from "react"')) {
      categories.react.push(importLine);
    } else if (importLine.includes('from \'@/') || importLine.includes('from "@/')) {
      categories.internal.push(importLine);
    } else if (importLine.includes('from \'../') || importLine.includes('from "../') || 
               importLine.includes('from \'./') || importLine.includes('from "./')) {
      categories.relative.push(importLine);
    } else if (importLine.includes('type ') || importLine.includes('./types')) {
      categories.types.push(importLine);
    } else if (importLine.includes('.css') || importLine.includes('.scss') || importLine.includes('./styles')) {
      categories.styles.push(importLine);
    } else {
      categories.external.push(importLine);
    }
  });

  // Sort each category alphabetically
  Object.keys(categories).forEach(key => {
    categories[key].sort();
  });

  // Combine categories with empty lines between groups
  const result = [];
  const order = ['react', 'external', 'internal', 'relative', 'types', 'styles'];
  
  order.forEach((category, index) => {
    if (categories[category].length > 0) {
      result.push(...categories[category]);
      // Add empty line between categories (except last)
      if (index < order.length - 1 && 
          order.slice(index + 1).some(cat => categories[cat].length > 0)) {
        result.push('');
      }
    }
  });

  return result;
}

/**
 * Format component structure for consistency
 */
function formatComponentStructure(content) {
  let formatted = content;

  // Ensure proper spacing around component declarations
  formatted = formatted.replace(
    /(export\s+(?:default\s+)?(?:function|const|class)\s+\w+)/g,
    '\n$1'
  );

  // Ensure proper spacing around interfaces and types
  formatted = formatted.replace(
    /((?:export\s+)?(?:interface|type)\s+\w+)/g,
    '\n$1'
  );

  // Clean up multiple empty lines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted;
}

/**
 * Apply consistent prop formatting
 */
function formatProps(content) {
  // Format interface props with consistent spacing
  const interfaceRegex = /(interface\s+\w+\s*{[^}]+})/gs;
  
  return content.replace(interfaceRegex, (match) => {
    const lines = match.split('\n');
    const formatted = lines.map((line, index) => {
      if (index === 0 || index === lines.length - 1) return line;
      
      // Ensure consistent indentation for props
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        return `  ${trimmed}`;
      }
      return line;
    });
    
    return formatted.join('\n');
  });
}

/**
 * Process a single file
 */
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let processedContent = content;

    // Apply our formatting rules
    processedContent = organizeImports(processedContent);
    processedContent = formatComponentStructure(processedContent);
    processedContent = formatProps(processedContent);

    // Run Prettier on the processed content
    try {
      const prettierFormatted = execSync(
        `npx prettier --write "${filePath}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } catch (prettierError) {
      console.warn(`⚠️  Prettier warning for ${filePath}:`, prettierError.message);
    }

    // Run ESLint fix
    try {
      execSync(
        `npx eslint "${filePath}" --fix`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } catch (eslintError) {
      // ESLint might exit with code 1 even when fixing issues
      if (!eslintError.message.includes('--fix')) {
        console.warn(`⚠️  ESLint warning for ${filePath}:`, eslintError.message);
      }
    }

    // Read the final result after Prettier and ESLint
    const finalContent = fs.readFileSync(filePath, 'utf8');
    
    if (content !== finalContent) {
      console.log(`✅ Formatted: ${path.relative(process.cwd(), filePath)}`);
      return true;
    } else {
      console.log(`⏭️  No changes: ${path.relative(process.cwd(), filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively find all component files
 */
function findComponentFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ Components directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findComponentFiles(fullPath));
    } else if (FILE_EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Starting component formatting process...');
  console.log(`📁 Components directory: ${COMPONENTS_DIR}`);
  console.log(`📄 File extensions: ${FILE_EXTENSIONS.join(', ')}`);
  console.log('🔧 Applying: Import organization, structure formatting, Prettier, ESLint\n');

  const files = findComponentFiles(COMPONENTS_DIR);
  
  if (files.length === 0) {
    console.log('⚠️  No component files found.');
    return;
  }

  console.log(`📋 Found ${files.length} files to format:\n`);
  
  let processedCount = 0;
  let changedCount = 0;

  for (const file of files) {
    const changed = await processFile(file);
    processedCount++;
    if (changed) changedCount++;
  }

  console.log(`\n✨ Formatting completed!`);
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${processedCount}`);
  console.log(`   - Files modified: ${changedCount}`);
  console.log(`   - Files unchanged: ${processedCount - changedCount}`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.endsWith('format-components.js')) {
  main().catch(console.error);
}

export { organizeImports, formatComponentStructure, formatProps };
