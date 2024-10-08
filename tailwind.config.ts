module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        // surface,fine,info is unset
        primary: {
          DEFAULT: "#1E429F", // blue-800
          dark: "#233876", // blue-900
          deeper: "#172554", // blue-950
        },
        secondary: {
          DEFAULT: "#E1EFFE", // blue-100
          dark: "#C3DDFD", // blue-200
          deeper: "#A4CAFE", // blue-300
        },
        danger: {
          DEFAULT: "#E02424", // red-600
          dark: "#C81E1E", // red-700
          deeper: "#9B1C1C", // red-800
        },
        cancel: {
          DEFAULT: "#E5E7EB", // gray-200
          dark: "#D1D5DB", // gray-300
          deeper: "#9CA3AF", // gray-400
        },
      },
      textColor: {
        primary: "#FFFFFF", // white
        secondary: "#1E429F", // blue-800
        danger: "#FFFFFF", // white
        cancel: "#374151", // gray-700
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
