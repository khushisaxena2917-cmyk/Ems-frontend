/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E6E6FA",
        secondary: "#3EB489",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          "sans-serif"],
      },
    },
  },
  plugins: [],
};