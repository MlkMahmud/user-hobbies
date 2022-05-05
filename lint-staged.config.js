module.exports = {
  '**/*.{ts,tsx}': [
    'bash -c tsc --noEmit',
    'eslint --cache --fix',
  ],
  '**/*.json': 'prettier --write',
};
