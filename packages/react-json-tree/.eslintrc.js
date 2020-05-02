module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // To be disabled in typescript-eslint 3.0.0 (see https://github.com/typescript-eslint/typescript-eslint/issues/1423)
    '@typescript-eslint/explicit-function-return-type': 'off',

    // See https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/rules/react.js#L487-L490
    'react/static-property-placement': ['error', 'static public field']
  }
};
