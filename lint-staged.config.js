module.exports = {
  '**/*.{ts,tsx}': [
    'tsc --esModuleInterop --noEmit',
    'eslint --cache --fix',
  ],
  '**/*.json': 'prettier --write',
};
