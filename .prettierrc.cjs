module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.{json,yml,yaml}',
      options: {
        tabWidth: 2,
      },
    },
  ],
}; 