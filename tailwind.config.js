/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}","./node_modules/flowbite/**/*.js","./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"
],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('daisyui')],
}

