import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
    },
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        elevated: '#1A1A1A',
        'brand-border': '#222222',
        muted: '#555555',
        body: '#D0D0D0',
        heading: '#F5F5F5',
        accent: '#E8FF00',
        danger: '#FF3D3D',
        success: '#4DFF91',
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Syne Mono', 'monospace'],
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        scrollDown: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'scroll-down': 'scrollDown 2s ease-in-out infinite',
        'slide-down': 'slideDown 200ms ease',
        'fade-in': 'fadeIn 200ms ease',
        'pulse-accent': 'pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
