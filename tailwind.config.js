/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/views/**/*.{html,js,twig}", "./public/**/*.{html,js,twig}"],
  theme: {
    daisyui: {
      themes: ["light", "dark", "forest"]
    }
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-3d")]
};
