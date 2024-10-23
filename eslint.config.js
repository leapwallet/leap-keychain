const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tseslintParser = require('@typescript-eslint/parser');
module.exports = [
  { ignores: ['coverage/', 'dist/', '.github/', '.git/'] },
  {
    ...eslint.configs.recommended,
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2020,
      },
      globals: {
        // es6 environment globals
        Promise: 'readonly',
        Symbol: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
];
