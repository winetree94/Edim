module.exports = {
    env: {
      node: true
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      project: './tsconfig.base.json'
    },
    plugins: ['@typescript-eslint'],
    rules: {
      "prettier/prettier": "error",
      "curly": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-var-requires": "off",
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      quotes: ['error', 'single'],
    }
  };