/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",   // ✅ REQUIRED
    "./src/components/**/*.{js,ts,jsx,tsx}", // ✅ REQUIRED
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};