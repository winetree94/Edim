module.exports = {
  "root": true,
  "ignorePatterns": ["dist/**/*"],
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": [
      "tsconfig.json",
    ],
  },
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:prettier/recommended",
      ],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "no-unused-vars": "off",
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:prettier/recommended"
      ],
      "rules": {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
      }
    },
  ]
}
