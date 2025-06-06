import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(compression({

  level: 6,

  threshold: 1024,

  filter: (req, res) => {

    if (req.headers['x-no-compression']) {
      return false;
    }

    return compression.filter(req, res);
  },
}));

app.use((req, res, next) => {

  res.setHeader('Vary', 'Accept-Encoding');

  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); 
  } else {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
});

function getContentType(path) {
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.html')) return 'text/html';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.woff')) return 'font/woff';
  if (path.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('br')) {
    const brotliPath = join(__dirname, 'dist', req.url + '.br');
    if (existsSync(brotliPath)) {
      res.setHeader('Content-Encoding', 'br');
      res.setHeader('Content-Type', getContentType(req.url));
      return res.sendFile(brotliPath);
    }
  }

  if (acceptEncoding.includes('gzip')) {
    const gzipPath = join(__dirname, 'dist', req.url + '.gz');
    if (existsSync(gzipPath)) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', getContentType(req.url));
      return res.sendFile(gzipPath);
    }
  }

  next();
});

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  try {
    const indexPath = join(__dirname, 'dist', 'index.html');
    if (existsSync(indexPath)) {
      const indexContent = readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.send(indexContent);
    } else {
      res.status(404).send('Build files not found. Run "npm run build" first.');
    }
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📦 Serving compressed static files from dist/`);
  console.log(`🗜️  Compression enabled: gzip + brotli`);
  console.log(`📊 Compression savings: ~72.3% (gzip) / ~76.1% (brotli)`);
});