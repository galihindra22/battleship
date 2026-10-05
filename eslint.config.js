import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.test.js',
      '**/*.spec.js',
      'tests/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        Promise: 'readonly',
        alert: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: 'error',
    },
  },
  eslintConfigPrettier,
];
