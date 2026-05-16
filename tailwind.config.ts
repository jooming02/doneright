import type { Config } from 'tailwindcss';

// 🔑 LEARNING: Tailwind config extends the default theme with our custom
// pixel art design tokens. "Design tokens" are named values (colors, spacing,
// fonts) that ensure visual consistency. Think of them as CSS custom properties
// but managed at the build system level.

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // 💡 CONCEPT: Custom font family — Press Start 2P is a bitmap/pixel font.
      // It renders best at specific sizes (8px multiples) because each "pixel"
      // in the font aligns to screen pixels.
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },

      // 🔑 LEARNING: Warm color palette for cooking app.
      // Primary actions = warm red (like a hot stove).
      // Secondary = deep brown (like seared meat).
      // Accent = golden (like perfectly cooked food).
      colors: {
        stove: {
          50: '#fef2f0',
          100: '#fde3de',
          200: '#fcc7bd',
          300: '#f9a08e',
          400: '#f46d55',
          500: '#e84530',
          600: '#c5301c',
          700: '#a02315',
          800: '#7f1e14',
          900: '#6b1c14',
          950: '#1a0a00',
        },
        sear: {
          50: '#faf5f0',
          100: '#f0e4d4',
          200: '#dfc5a4',
          300: '#cba06e',
          400: '#bb8348',
          500: '#ae6d34',
          600: '#965629',
          700: '#7b4124',
          800: '#663623',
          900: '#562f20',
          950: '#2f160e',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },

      // 💡 CONCEPT: Pixel-friendly spacing — Using multiples of 4px
      // because that's the "pixel grid" for our retro aesthetic.
      spacing: {
        'pixel-1': '4px',
        'pixel-2': '8px',
        'pixel-3': '12px',
        'pixel-4': '16px',
        'pixel-5': '20px',
        'pixel-6': '24px',
        'pixel-8': '32px',
        'pixel-10': '40px',
        'pixel-12': '48px',
        'pixel-16': '64px',
      },

      // 🔑 LEARNING: Custom border widths — 4px borders create the chunky
      // pixel-art look. In retro games, UI borders were typically 2-4 pixels.
      borderWidth: {
        pixel: '4px',
      },

      // 💡 CONCEPT: Custom box shadows — No blur = pixel-perfect shadows.
      // In 8-bit games, shadows were just offset solid blocks.
      boxShadow: {
        pixel: '4px 4px 0px 0px rgba(0,0,0,0.75)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.75)',
        'pixel-hover': '2px 2px 0px 0px rgba(255,255,255,0.3)',
      },

      // 🔑 LEARNING: Custom animations for retro feel.
      // blink = cursor/text blink (classic NES).
      // pulse-slow = timer active indicator.
      // glow = doneness preview highlight.
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
      },
    },
  },

  plugins: [],
} satisfies Config;
