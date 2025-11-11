/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome color scheme
        'mono-black': '#000000',
        'mono-white': '#ffffff',
        'mono-gray-50': '#fafafa',
        'mono-gray-100': '#f5f5f5',
        'mono-gray-200': '#e5e5e5',
        'mono-gray-300': '#d4d4d4',
        'mono-gray-400': '#a3a3a3',
        'mono-gray-500': '#737373',
        'mono-gray-600': '#525252',
        'mono-gray-700': '#404040',
        'mono-gray-800': '#262626',
        'mono-gray-900': '#171717',
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            h1: { color: '#ffffff' },
            h2: { color: '#ffffff' },
            h3: { color: '#ffffff' },
            h4: { color: '#ffffff' },
            h5: { color: '#ffffff' },
            h6: { color: '#ffffff' },
            strong: { color: '#ffffff' },
            code: { color: '#ffffff' },
            blockquote: { color: '#d4d4d4' },
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

