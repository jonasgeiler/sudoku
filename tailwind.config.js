module.exports = {
  theme:    {
    container: {
      center: true
    },
    extend: {
      lineHeight: {
        full: '100%'
      },
      colors: {
        primary: '#2979fa',
        'primary-dark': '#256de1',
        'primary-darker': '#2161c8',

        secondary: '#f2f7ff',

        'gray-custom': '#f7f9fc',
      },
      zIndex: {
        '-10': '-10',
      },
      boxShadow: {
        'outline-inverse': '0 0 0 3px rgba(235, 248, 255, 0.5)',
      }
    },
  },
  variants: {},
  purge:    {
    content: ['./src/**/*.svelte', './src/**/*.html'],
    options: {
      whitelistPatterns: [/^(row|col)-start-/],
      //defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    },
  },
  future:   {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault:         true,
  },
  plugins:  [],
};
