/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mm: {
          bg: '#F5F2EC',
          surface: '#FFFFFF',
          'surface-2': '#FAF7F1',
          ink: '#1B1B2A',
          'ink-2': '#4A4A5C',
          'ink-3': '#8A8A9A',
          line: '#ECE7DD',
          primary: '#FF6B4A',
          'primary-2': '#E85530',
          accent: '#4D6BFF',
          'accent-2': '#2540D9',
          green: '#1FB67A',
          yellow: '#FFC542',
          pink: '#FF8FB1',
          lilac: '#B59BFF',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Fredoka"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '12px',
        md: '18px',
        lg: '28px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
