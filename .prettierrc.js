module.exports = {
  printWidth: 80,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 4,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson'],
  semi: false,
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};
