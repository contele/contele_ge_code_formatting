module.exports = {
  root: true,
  extends: ['universe/node', 'universe/web', 'universe/native'],
  globals: {
    __dirname: true,
  },
  rules: {
    'max-lines': [
      'warn',
      { max: 120, skipBlankLines: true, skipComments: true },
    ],

    // allow .js files to contain JSX code
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

    // ignore errors for the react-navigation package
    'react/prop-types': [
      'error',
      { ignore: ['navigation', 'navigation.navigate'] },
    ],
  },
};
