module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off",
    strict: ["error", "global"],
    curly: "warn"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
