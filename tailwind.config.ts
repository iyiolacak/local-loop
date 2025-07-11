// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
    safelist: ['font-minercraftory'], // <- optional safety net
  theme: {
    extend: {
      fontFamily: {
        // your default sans is already PPNeueMontreal via globals.css,
        // but here it lets you use font-sans in Tailwind explicitly.
        sans: ['PPNeueMontreal', 'sans-serif'],

        // register your pixel face under the exact name you’ll use in className
        minercraftory: ['"Monster Friend Fore"', 'monospace'], // NOTE the quotes,
      },
    },
  },
}
