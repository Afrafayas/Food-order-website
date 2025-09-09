/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable dark mode with the "dark" class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
          background: "var(--background-color)",
          text: "var(--text-color)",
      }
    },
  },
  plugins: [],
}
