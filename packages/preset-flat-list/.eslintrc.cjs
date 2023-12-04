module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    project: __dirname + '/tsconfig.json'
  },
  extends: [
    '../../.eslintrc.cjs',
  ],
};