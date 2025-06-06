import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react({

      jsxRuntime: 'automatic',
    }),

    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, 
      deleteOriginFile: false, 
      verbose: true, 
    }),

    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
      verbose: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {

    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,

    rollupOptions: {
      output: {

        manualChunks: {

          'react-vendor': ['react', 'react-dom'],
          'icons': ['react-icons/fi'],
          'utils': ['zod', 'axios'],

          'booking-steps': [
            './src/components/BookingSteps/PostcodeStep',
            './src/components/BookingSteps/WasteTypeStep',
            './src/components/BookingSteps/SelectSkipStep',
            './src/components/BookingSteps/PermitCheckStep',
            './src/components/BookingSteps/ChooseDateStep',
            './src/components/BookingSteps/PaymentStep',
          ],
        },

        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    chunkSizeWarningLimit: 1000,

    sourcemap: false,

    cssCodeSplit: true,

    reportCompressedSize: true,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-icons/fi',
      'zod',
      'axios',
    ],
    exclude: [

    ],
  },

  server: {

    hmr: {
      overlay: false, 
    },

    proxy: {

      '/api': {
        target: 'https://app.wewantwaste.co.uk',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})