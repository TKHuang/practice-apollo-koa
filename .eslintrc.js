module.exports = {
  extends: ["airbnb-base", "plugin:jest/recommended", "prettier"],
  plugins: ["import", "jest", "prettier"],
  env: {
    node: true,
    "jest/globals": true
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        semi: false,
        singleQuote: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: "all",
        arrowParens: "avoid"
      }
    ],
    "arrow-parens": 0,
    "function-paren-newline": 0,
    "no-console": 0,
    "object-curly-newline": [
      "error",
      {
        consistent: true
      }
    ]
  }
};
