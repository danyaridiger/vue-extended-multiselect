module.exports = {
  root: true,
  requireConfigFile: false,
  env: {
    node: true,
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/***.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true,
      }
    }
  ]
}
