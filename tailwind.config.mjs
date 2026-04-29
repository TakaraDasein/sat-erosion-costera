/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        white: 'hsl(0 0% 100%)',
        black: '#000000',
        brand: '#EE3F2C',
      },
      borderRadius: {
        DEFAULT: '1rem',
      },
    },
  },
  plugins: [],
}
