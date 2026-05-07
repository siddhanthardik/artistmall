/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f7f9fb',
          dim: '#d8dadc',
          bright: '#f7f9fb',
          lowest: '#ffffff',
          low: '#f2f4f6',
          container: '#eceef0',
          high: '#e6e8ea',
          highest: '#e0e3e5',
          variant: '#e0e3e5',
        },
        brand: {
          primary: '#a04100',
          onPrimary: '#ffffff',
          primaryContainer: '#ff6b00',
          onPrimaryContainer: '#572000',
          secondary: '#0061a5',
          onSecondary: '#ffffff',
          secondaryContainer: '#0095f8',
          onSecondaryContainer: '#002b4e',
          tertiary: '#4c607a',
          onTertiary: '#ffffff',
          tertiaryContainer: '#869ab7',
          onTertiaryContainer: '#1e324a',
          orange: '#a04100',
          orangeHover: '#7a3000',
          blue: '#0061a5',
          blueHover: '#00497e',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#ba1a1a',
        },
        neutral: {
          content: '#191c1e',
          variant: '#5a4136',
          inverse: '#2d3133',
          onInverse: '#eff1f3',
          outline: '#8e7164',
          outlineVariant: '#e2bfb0',
        },
        error: {
          DEFAULT: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          onContainer: '#93000a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '80px',
        gutter: '24px',
      },
      maxWidth: {
        container: '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
