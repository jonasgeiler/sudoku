module.exports = {
  theme:    {
    container: {
      center: true
    },
    extend: {
      screens: {
        'xs': '430px'
      },
      lineHeight: {
        full: '100%'
      },
      colors: {
        'primary-lighter': '#eff5ff',
        'primary-light': '#ccdffe',
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
      whitelistPatterns: [/^(row|col)-start-/, /svelte-/],

      defaultExtractor: (content) => {
        const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g);
        const matchedTokens = [];
        let match = regExp.exec(content);
        while (match) {
          if (match[0].startsWith('class:')) {
            matchedTokens.push(match[0].substring(6));
          } else {
            matchedTokens.push(match[0]);
          }
          match = regExp.exec(content);
        }
        return matchedTokens;
      },
    },
  },
  future:   {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault:         true,
  },
  plugins:  [],
};
