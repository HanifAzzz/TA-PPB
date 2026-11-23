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
        forge: {
          bg:       "#0B0F17",
          surface:  "#111827",
          elevated: "#1F2937",
          border:   "#1E293B",
          accent:   "#38BDF8",
          primary:  "#6366F1",
          secondary:"#8B5CF6",
          text:     "#F8FAFC",
          muted:    "#94A3B8",
          success:  "#10B981",
          warning:  "#F59E0B",
          danger:   "#EF4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px -5px rgba(56, 189, 248, 0.3)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.3)',
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
