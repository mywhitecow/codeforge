/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      // Paleta LUMINA como tokens Tailwind — permite usar text-lumina-primary etc.
      colors: {
        lumina: {
          primary:      '#38BDF8',
          'primary-h':  '#0EA5E9',
          dark:         '#0B172C',
          'dark-light': '#1E293B',
          gold:         '#D4AF37',
          muted:        '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease forwards',
        'banner-slide': 'bannerSlide 0.4s ease forwards',
        'pulse-dot':    'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bannerSlide: {
          from: { opacity: '0', transform: 'translateY(-100%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)'    },
          '50%':      { opacity: '0.6', transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
};