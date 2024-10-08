module.exports = {
  root: true,
  plugins: ["unused-imports", "import"],
  extends: ["universe/node", "universe/web", "universe/native"],
  globals: {
    __dirname: true,
  },
  ignorePatterns: ["node_modules", "reorganize-hooks.js"],
  rules: {
    "react/prop-types": "error",
    "import/no-unused-modules": "error",
    "unused-imports/no-unused-imports": "error",
    // allow .js files to contain JSX code
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
};
