/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow :{
        // "softShadow" : "3px 3px 6px #CDD5E6, -3px -3px 6px #fbffff",
        // "softShdowInner":"inset 4px 4px 6px #CDD5E6, inset -4px -4px 6px #fbffff"
        "softShadow" : "3px 3px 6px #c5c5c5, -3px -3px 6px #ffffff",
        "softShdowInner":"inset 4px 4px 6px #c5c5c5, inset -4px -4px 6px #ffffff"
      },
      colors:{
        softColor:"#e8e8e8",
      }
    },
  },
  plugins: [],
}

