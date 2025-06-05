#!/usr/bin/env node

/**
 * Script to remove comments from files in the components folder
 * while preserving ESLint comments and directives
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// ESLint comment patterns to preserve
const ESLINT_PATTERNS = [
  /\/\*\s*eslint/i,
  /\/\/\s*eslint/i,
  /\/\*\s*@ts-/i,
  /\/\/\s*@ts-/i,
  /\/\*\s*prettier/i,
  /\/\/\s*prettier/i,
];

/**
 * Check if a comment should be preserved (ESLint, TypeScript, Prettier directives)
 */
function shouldPreserveComment(comment) {
  return ESLINT_PATTERNS.some(pattern => pattern.test(comment));
}

/**
 * Remove comments from code while preserving ESLint directives
 */
function removeComments(code) {
  const lines = code.split('\n');
  const result = [];
  let inMultiLineComment = false;
  let multiLineCommentStart = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let processedLine = '';
    let j = 0;

    while (j < line.length) {
      if (inMultiLineComment) {
        // Look for end of multi-line comment
        if (line.substring(j, j + 2) === '*/') {
          const fullComment = multiLineCommentStart + line.substring(0, j + 2);
          if (shouldPreserveComment(fullComment)) {
            processedLine += line.substring(0, j + 2);
          }
          inMultiLineComment = false;
          multiLineCommentStart = '';
          j += 2;
        } else {
          j++;
        }
      } else {
        // Check for start of comments
        if (line.substring(j, j + 2) === '/*') {
          // Multi-line comment start
          const commentStart = j;
          let commentEnd = line.indexOf('*/', j + 2);
          
          if (commentEnd !== -1) {
            // Single-line multi-line comment
            const comment = line.substring(commentStart, commentEnd + 2);
            if (shouldPreserveComment(comment)) {
              processedLine += comment;
            }
            j = commentEnd + 2;
          } else {
            // Multi-line comment continues
            multiLineCommentStart = line.substring(commentStart);
            inMultiLineComment = true;
            if (shouldPreserveComment(multiLineCommentStart)) {
              processedLine += line.substring(commentStart);
            }
            break;
          }
        } else if (line.substring(j, j + 2) === '//') {
          // Single-line comment
          const comment = line.substring(j);
          if (shouldPreserveComment(comment)) {
            processedLine += comment;
          }
          break;
        } else if (line[j] === '"' || line[j] === "'" || line[j] === '`') {
          // Handle strings to avoid removing comments inside them
          const quote = line[j];
          processedLine += quote;
          j++;
          
          // Find the end of the string
          while (j < line.length) {
            if (line[j] === quote && line[j - 1] !== '\\') {
              processedLine += quote;
              j++;
              break;
            }
            processedLine += line[j];
            j++;
          }
        } else {
          processedLine += line[j];
          j++;
        }
      }
    }

    // Only add the line if it's not empty or contains preserved comments
    if (processedLine.trim() !== '' || shouldPreserveComment(processedLine)) {
      result.push(processedLine);
    } else if (processedLine.trim() === '' && result.length > 0 && result[result.length - 1].trim() !== '') {
      // Preserve single empty lines between code blocks
      result.push('');
    }
  }

  // Clean up multiple consecutive empty lines
  const cleaned = [];
  let emptyLineCount = 0;
  
  for (const line of result) {
    if (line.trim() === '') {
      emptyLineCount++;
      if (emptyLineCount <= 1) {
        cleaned.push(line);
      }
    } else {
      emptyLineCount = 0;
      cleaned.push(line);
    }
  }

  return cleaned.join('\n');
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const processedContent = removeComments(content);
    
    // Only write if content changed
    if (content !== processedContent) {
      fs.writeFileSync(filePath, processedContent, 'utf8');
      console.log(`✅ Processed: ${path.relative(process.cwd(), filePath)}`);
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
function main() {
  console.log('🚀 Starting comment removal process...');
  console.log(`📁 Components directory: ${COMPONENTS_DIR}`);
  console.log(`📄 File extensions: ${FILE_EXTENSIONS.join(', ')}`);
  console.log('🛡️  Preserving ESLint, TypeScript, and Prettier comments\n');

  const files = findComponentFiles(COMPONENTS_DIR);
  
  if (files.length === 0) {
    console.log('⚠️  No component files found.');
    return;
  }

  console.log(`📋 Found ${files.length} files to process:\n`);
  
  let processedCount = 0;
  let changedCount = 0;

  for (const file of files) {
    const changed = processFile(file);
    processedCount++;
    if (changed) changedCount++;
  }

  console.log(`\n✨ Process completed!`);
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${processedCount}`);
  console.log(`   - Files modified: ${changedCount}`);
  console.log(`   - Files unchanged: ${processedCount - changedCount}`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.endsWith('remove-comments.js')) {
  main();
}

export { removeComments, shouldPreserveComment };
