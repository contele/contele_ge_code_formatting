module.exports = {
  root: true,
  plugins: ['unused-imports', 'import'],
  extends: ['universe/node', 'universe/web', 'universe/native'],
  globals: {
    __dirname: true,
  },
  rules: {
    'react/prop-types': 'off',
    'import/no-unused-modules': 'error',
    'unused-imports/no-unused-imports': 'error',
    'max-lines': [
      'warn',
      { max: 120, skipBlankLines: true, skipComments: true },
    ],

    // allow .js files to contain JSX code
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

    // ignore errors for the react-navigation package
    'react/prop-types': [
      'error',
      { ignore: ['navigation', 'navigation.navigate', 'Component','children','pageProps'] },
    ],
  },
};
