/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 80px rgba(9, 18, 40, 0.22)",
        glow: "0 0 80px rgba(115, 145, 255, 0.32)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(24px,-18px,0) scale(1.04)" }
        },
        sweep: {
          "0%": { transform: "translateX(-140%) rotate(8deg)" },
          "100%": { transform: "translateX(140%) rotate(8deg)" }
        }
      },
      animation: {
        drift: "drift 13s ease-in-out infinite",
        sweep: "sweep 4.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
