// tailwind.config.js
module.exports = {
  // This tells Tailwind where to look for utility classes in your project
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  // The theme section is where you customize Tailwind's default design system
  theme: {
    extend: {
      colors: {
        // Custom colors based on Apple Health app
        'activity': '#FF9500',
        'heart': '#FF2D55',
        'respiratory': '#5AC8FA',
        'nutrition': '#4CD964',
        'body': '#AF52DE',
        'medications': '#007AFF',
        'mobility': '#FF9500',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};