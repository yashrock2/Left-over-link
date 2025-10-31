/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use 'class' strategy
  theme: {
    extend: {
      colors: {
        // Light theme (default)
        'light-bg': 'var(--color-bg-light)',
        'light-text': 'var(--color-text-light)',
        'light-primary': 'var(--color-primary-light)',
        // Dark theme
        'dark-bg': 'var(--color-bg-dark)',
        'dark-text': 'var(--color-text-dark)',
        'dark-primary': 'var(--color-primary-dark)',
        // Eye-protect theme
        'eye-bg': 'var(--color-bg-eye)',
        'eye-text': 'var(--color-text-eye)',
        'eye-primary': 'var(--color-primary-eye)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // ensures Tailwind base styles are loaded
  },
}
