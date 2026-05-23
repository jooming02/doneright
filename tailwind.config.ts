import type { Config } from 'tailwindcss';

// Tailwind tokens → CSS variables → theme values (defined in src/data/themes.ts).
// To change a theme: edit themes.ts only. Nothing here needs to change.
//
// 60-30-10 token layout:
//   60%  canvas, surface
//   30%  panel, panel-hover, outline, body, body-sub, body-muted, hi
//   10%  cta, cta-dim, cta-ink, cta-ring

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      fontFamily: {
        pixel:   ['"Outfit"', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },

      colors: {
        // 60% — Canvas
        canvas:  'var(--canvas)',
        surface: 'var(--surface)',

        // 30% — Structure
        panel:        'var(--panel)',
        'panel-hover': 'var(--panel-hover)',
        outline:      'var(--outline)',
        body:         'var(--body)',
        'body-sub':   'var(--body-sub)',
        'body-muted': 'var(--body-muted)',

        // 30% — Highlight (headings, active selection ring — NOT for buttons)
        hi: 'var(--hi)',

        // 10% — CTA (single action color — primary buttons only)
        cta:      'var(--cta)',
        'cta-dim':  'var(--cta-dim)',
        'cta-ink':  'var(--cta-ink)',
        'cta-ring': 'var(--cta-ring)',

        // Timer state colors (semantic)
        timer: {
          ok:       'var(--timer-ok)',
          warn:     'var(--timer-warn)',
          danger:   'var(--timer-danger)',
          critical: 'var(--timer-critical)',
        },
      },

      spacing: {
        'pixel-1':  '4px',
        'pixel-2':  '8px',
        'pixel-3':  '12px',
        'pixel-4':  '16px',
        'pixel-5':  '20px',
        'pixel-6':  '24px',
        'pixel-8':  '32px',
        'pixel-10': '40px',
        'pixel-12': '48px',
        'pixel-16': '64px',
      },

      borderWidth: {
        pixel: '1px',
      },

      boxShadow: {
        pixel:         '0 4px 16px rgba(0, 0, 0, 0.4)',
        'pixel-sm':    '0 2px 8px rgba(0, 0, 0, 0.25)',
        'pixel-hover': '0 8px 28px rgba(0, 0, 0, 0.5)',
      },

      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '1'   },
          '50%':      { transform: 'scale(1.02)', opacity: '0.9' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)'    },
          '50%':      { filter: 'brightness(1.3)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink:        'blink 1s step-end infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        glow:         'glow 2s ease-in-out infinite',
        'fade-up':    'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },

  plugins: [],
} satisfies Config;
