module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cairo"', "system-ui", "sans-serif"], // Arabic font ready
      },
    },
  },
  plugins: [
    require("tailwindcss-rtl"), // ← CORRECT PLUGIN
  ],
};
