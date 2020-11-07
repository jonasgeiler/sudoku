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
        primary: '#2979fa', // '#0099ff',
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
      whitelist: [/^(row|col)-start-/],
    },
  },
  future:   {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault:         true,
  },
  plugins:  [],
};
