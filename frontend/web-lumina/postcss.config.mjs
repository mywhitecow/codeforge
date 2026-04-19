// postcss.config.mjs
// CORREGIDO: tailwindcss v3 con autoprefixer
// El proyecto usa tailwind.config.js (v3) — no mezclar con @tailwindcss/postcss (v4)
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
