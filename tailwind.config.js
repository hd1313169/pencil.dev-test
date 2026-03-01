const extend = require('./tailwind.theme.extend');

module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}', './*.html'],
  theme: {
    extend
  },
  plugins: []
};
