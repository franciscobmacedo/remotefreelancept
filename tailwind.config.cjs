/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#38bdf8",
        secondary: "#88d2f2",
        tertiary: "#d4c722",
        defaultbg: "#f5f5f5",
        income: "#76c479",
      },
    },
    fontFamily: {
      sans: ["Montserrat"],
    },
  },
  plugins: [],
};
