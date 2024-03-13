module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        "app-green": "rgb(29,185,84)",
        "app-black": "#121212",
      },
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
      },
      height: {
        "1/10": "10%",
        "9/10": "90%",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
