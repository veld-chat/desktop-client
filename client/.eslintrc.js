module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  env: {
    browser: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
    "@vue/typescript"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off"
  }
};
