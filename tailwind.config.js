const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '125': '31.25rem', 
      },
    },
  },
  plugins: [],

  corePlugins: {

    preflight: true, 
  },

  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],

    safelist: [
      'sr-only',
      'focus-visible',
      'btn-primary',
      'loading-spinner',
      'container',

      /^text-responsive-/,
      /^grid-responsive-/,
      /^gap-responsive/,
      /^btn-touch/,
    ],

    options: {
      keyframes: true,
      fontFace: true,
    }
  }
}

export default config;
