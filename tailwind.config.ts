import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          secondary: '#111111',
          tertiary: '#1a1a1a'
        },
        text: {
          primary: '#fafafa',
          secondary: '#888888',
          muted: '#444444'
        },
        border: {
          DEFAULT: '#1f1f1f'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Helvetica Neue', 'Arial', 'sans-serif']
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      transitionDuration: {
        '600': '600ms',
        '700': '700ms',
        '800': '800ms'
      }
    }
  },
  plugins: []
} satisfies Config
