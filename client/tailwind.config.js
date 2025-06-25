    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        // This is the crucial part that tells Tailwind where to find your HTML and React components
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // This line scans all JS, TS, JSX, TSX files in src/ and its subdirectories
      ],
      theme: {
        extend: {
          fontFamily: { // Add Inter font if you want to explicitly use it
            sans: ['Inter', 'sans-serif'],
          },
        },
      },
      plugins: [],
    }
    