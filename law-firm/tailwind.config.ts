import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F3D3E',
        forest: '#145A32',
        accent: '#D6AE7B',
        ink: '#1F2937'
      },
      fontFamily: {
        serif: ['var(--font-inter)', 'serif'],
        sans: ['var(--font-inter)', 'var(--font-arabic)', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [require('tailwindcss-rtl')],
}

export default config


