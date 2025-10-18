module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#111827', // dark blue-gray
          light: '#ffffff',
        },
        foreground: {
          DEFAULT: '#e5e7eb', // light gray
          light: '#1e293b', // slate-800
        },
        primary: {
          DEFAULT: '#2563eb', // blue-600
