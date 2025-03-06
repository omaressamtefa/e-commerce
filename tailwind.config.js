/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
    container: {
      center: true,
    },
    rotate: {
      180: "180deg",
    },
  },
  plugins: [require("flowbite/plugin")],
};
