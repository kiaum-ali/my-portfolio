/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark-first theme colors
        background: "#05050A", // Deep dark navy/black
        surface: "rgba(255, 255, 255, 0.03)", // Dark glass surface
        surfaceHover: "rgba(255, 255, 255, 0.08)",
        border: "rgba(255, 255, 255, 0.1)",
        primary: {
          DEFAULT: "#6366f1", // Blue/Indigo
          light: "#a855f7", // Purple
          dark: "#4338ca",
        },
        text: {
          main: "#ffffff",
          muted: "#9ca3af",
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #6366f1, #a855f7)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}