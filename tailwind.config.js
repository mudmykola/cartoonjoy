/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      screen: {
        lg: "1171px",
      },
      colors: {
        primary: "#19453F",
        secondary: "#5E6D55",
        secondaryWhite: "#E4EBE4",
        accent: "#CA6C46",
        background: "#E4EBE4",
        text: "#000000",
        muted: "#F7FAF7",
        blue: "#29A9EB",
      },
      fontFamily: {
        sans: ["Mulish", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};