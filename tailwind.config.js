/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/pages/**/*.ejs",
    "./views/layouts/**/*.ejs",
    "./views/auth/**/*.ejs",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "769px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        Albert: ["Albert Sans"],
        Molle: ["Molle", "cursive"],
      },
      colors: {
        brightRed: "rgb(239 68 68 /1)",
        brightRedLight: "hsl(12, 88%, 69%)",
        brightRedSupLight: "hsl(12, 88%, 95%)",
        darkBlue: "hsl(228, 39%, 23%)",
        darkGrayishBlue: "hsl(227, 12%, 61%)",
        veryDarkBlue: "hsl(233, 12%, 13%)",
        veryPaleRed: "hsl(13, 100%, 96%)",
        veryLightGray: "hsl(0, 0%, 98%)",
      },
    },
  },
  plugins: [],
};