import type { Config } from 'tailwindcss'
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A1A",
        gold: "#D4AF37",
        rosegold: "#B76E79"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"]
      }
    }
  },
  plugins: []
}
export default config
