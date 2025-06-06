#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = process.cwd(); 
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Patterns to preserve ESLint, TypeScript, and Prettier directive comments
const PRESERVE_PATTERNS = [
  /eslint/i,
  /@ts-/i,
  /prettier/i,
];

function shouldPreserveComment(comment) {
  return PRESERVE_PATTERNS.some(pattern => pattern.test(comment));
}

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
        if (line.substring(j, j + 2) === '/*') {
          const commentStart = j;
          let commentEnd = line.indexOf('*/', j + 2);
          if (commentEnd !== -1) {
            const comment = line.substring(commentStart, commentEnd + 2);
            if (shouldPreserveComment(comment)) {
              processedLine += comment;
            }
            j = commentEnd + 2;
          } else {
            multiLineCommentStart = line.substring(commentStart);
            inMultiLineComment = true;
            if (shouldPreserveComment(multiLineCommentStart)) {
              processedLine += line.substring(commentStart);
            }
            break;
          }
        } else if (line.substring(j, j + 2) === '//') {
          const comment = line.substring(j);
          if (shouldPreserveComment(comment)) {
            processedLine += comment;
          }
          break;
        } else if (line[j] === '"' || line[j] === "'" || line[j] === '`') {
          const quote = line[j];
          processedLine += quote;
          j++;
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
    if (processedLine.trim() !== '' || shouldPreserveComment(processedLine)) {
      result.push(processedLine);
    } else if (processedLine.trim() === '' && result.length > 0 && result[result.length - 1].trim() !== '') {
      result.push('');
    }
  }
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

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const processedContent = removeComments(content);
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

function findFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item === 'node_modules' || item === '@node_modules') continue; 
      files.push(...findFiles(fullPath));
    } else if (FILE_EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log('🚀 Starting comment removal process...');
  console.log(`📁 Base directory: ${BASE_DIR}`);
  console.log(`📄 File extensions: ${FILE_EXTENSIONS.join(', ')}`);
  console.log('🛡️  Preserving only ESLint, TypeScript, and Prettier directive comments\n');

  const files = findFiles(BASE_DIR);
  if (files.length === 0) {
    console.log('⚠️  No files found.');
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

if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.endsWith('remove-comments.js')) {
  main();
}

export { removeComments, shouldPreserveComment };
