module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "standard",
    "prettier",
    "prettier/prettier",
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
    "node/no-unpublished-import": "off",
    "node/no-missing-import": "off",
    "import/no-unresolved": "error",
    "no-var": "error",
    "brace-style": "error",
    "prefer-template": "error",
    "space-before-blocks": "error",
  },
  overrides: [
    {
      files: ["./test/**/*.ts"],
      env: {
        mocha: true,
      },
    },
  ],
};
