module.exports = {
  '**/*.{ts,tsx}': [
    'tsc --esModuleInterop --noEmit --resolveJsonModule',
    'eslint --cache --fix',
  ],
  '**/*.json': 'prettier --write',
};
