/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Centered content width like Apple’s pages */
      container: {
        center: true,
        padding: "1rem",
        screens: { '2xl': '1280px' },
      },

      /* Fonts: keep your CSS var for sans; add a display face hook */
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'ui-serif', 'Times New Roman', 'serif'],
      },

      /* Brand palette stays — adding a couple of helpers */
      colors: {
        brand: {
          DEFAULT: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
        },
      },

      /* Softer, premium card shadows */
      boxShadow: {
        subtle: "0 1px 2px rgba(16, 24, 40, 0.04)",
        card: "0 6px 30px rgba(0,0,0,0.10)",
        xlsoft: "0 10px 40px rgba(0,0,0,0.12)",
      },

      /* Rounded corners you already use */
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },

      /* For readable hero text on photography */
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(180deg, rgba(0,0,0,.60) 0%, rgba(0,0,0,.35) 50%, rgba(0,0,0,.15) 100%)',
      },
    },
  },
  plugins: [],
};
