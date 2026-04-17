/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937'
        },
        primary: {
          500: '#3B82F6',
          400: '#60A5FA'
        },
        accent: {
          green: '#10B981',
          purple: '#8B5CF6'
        }
      },
      boxShadow: {
        'glow-primary': '0 0 15px -3px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 15px -3px rgba(16, 185, 129, 0.5)',
        'glow-purple': '0 0 15px -3px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
