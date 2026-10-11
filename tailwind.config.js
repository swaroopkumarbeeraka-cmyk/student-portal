/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'accent-light': 'var(--color-accent-light)',
          success: '#2E7D4F',
          warning: '#B7791F',
          danger: '#B42318',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['20px', '28px'],
        'xl': ['28px', '36px'],
      },
    },
  },
  plugins: [],
}
