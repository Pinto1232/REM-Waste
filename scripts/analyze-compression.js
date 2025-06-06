#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { gzipSync, brotliCompressSync } from 'zlib';

function analyzeCompression() {
  const distPath = './dist';

  if (!readdirSync('.').includes('dist')) {
    console.log('❌ No dist folder found. Run "npm run build" first.');
    return;
  }

  console.log('🗜️  Analyzing compression potential...\n');

  const results = [];
  let totalOriginal = 0;
  let totalGzip = 0;
  let totalBrotli = 0;

  function analyzeFile(filePath, relativePath) {
    const ext = extname(filePath).toLowerCase();

    if (!['.js', '.css', '.html', '.json', '.svg', '.txt'].includes(ext)) {
      return;
    }

    try {
      const content = readFileSync(filePath);
      const originalSize = content.length;

      if (originalSize < 1024) return; 

      const gzipSize = gzipSync(content).length;
      const brotliSize = brotliCompressSync(content).length;

      const gzipSavings = originalSize - gzipSize;
      const brotliSavings = originalSize - brotliSize;

      const gzipRatio = ((gzipSavings / originalSize) * 100);
      const brotliRatio = ((brotliSavings / originalSize) * 100);

      results.push({
        file: relativePath,
        original: originalSize,
        gzip: gzipSize,
        brotli: brotliSize,
        gzipSavings,
        brotliSavings,
        gzipRatio,
        brotliRatio,
      });

      totalOriginal += originalSize;
      totalGzip += gzipSize;
      totalBrotli += brotliSize;

    } catch (error) {
      console.warn(`⚠️  Could not analyze ${relativePath}:`, error.message);
    }
  }

  function walkDirectory(dir, baseDir = '') {
    const files = readdirSync(dir);

    files.forEach(file => {
      const fullPath = join(dir, file);
      const relativePath = join(baseDir, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath, relativePath);
      } else {
        analyzeFile(fullPath, relativePath);
      }
    });
  }

  walkDirectory(distPath);

  results.sort((a, b) => b.original - a.original);

  console.log('📊 Compression Analysis Results:\n');
  console.log('File'.padEnd(50) + 'Original'.padEnd(12) + 'Gzip'.padEnd(12) + 'Brotli'.padEnd(12) + 'Gzip %'.padEnd(10) + 'Brotli %');
  console.log('─'.repeat(100));

  results.forEach(result => {
    const file = result.file.length > 47 ? '...' + result.file.slice(-44) : result.file;
    const original = formatBytes(result.original);
    const gzip = formatBytes(result.gzip);
    const brotli = formatBytes(result.brotli);
    const gzipPercent = result.gzipRatio.toFixed(1) + '%';
    const brotliPercent = result.brotliRatio.toFixed(1) + '%';

    console.log(
      file.padEnd(50) +
      original.padEnd(12) +
      gzip.padEnd(12) +
      brotli.padEnd(12) +
      gzipPercent.padEnd(10) +
      brotliPercent
    );
  });

  const totalGzipSavings = totalOriginal - totalGzip;
  const totalBrotliSavings = totalOriginal - totalBrotli;
  const gzipSavingsPercent = ((totalGzipSavings / totalOriginal) * 100).toFixed(1);
  const brotliSavingsPercent = ((totalBrotliSavings / totalOriginal) * 100).toFixed(1);

  console.log('\n' + '─'.repeat(100));
  console.log('📈 Summary:');
  console.log(`   Total original size: ${formatBytes(totalOriginal)}`);
  console.log(`   Total gzip size:     ${formatBytes(totalGzip)} (${gzipSavingsPercent}% savings)`);
  console.log(`   Total brotli size:   ${formatBytes(totalBrotli)} (${brotliSavingsPercent}% savings)`);
  console.log(`   Gzip savings:        ${formatBytes(totalGzipSavings)}`);
  console.log(`   Brotli savings:      ${formatBytes(totalBrotliSavings)}`);

  console.log('\n🎯 Recommendations:');

  if (totalGzipSavings > 100 * 1024) {
    console.log('   ✅ Enable gzip compression on your server');
  }

  if (totalBrotliSavings > totalGzipSavings + 50 * 1024) {
    console.log('   ✅ Enable brotli compression for even better results');
  }

  const largeFiles = results.filter(r => r.original > 100 * 1024);
  if (largeFiles.length > 0) {
    console.log('   📦 Consider code splitting for large files:');
    largeFiles.slice(0, 3).forEach(file => {
      console.log(`      - ${file.file} (${formatBytes(file.original)})`);
    });
  }

  console.log('\n🚀 To enable compression:');
  console.log('   Development: Already enabled via vite-plugin-compression');
  console.log('   Production:  Run "npm run serve" to use the Express server with compression');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

analyzeCompression();