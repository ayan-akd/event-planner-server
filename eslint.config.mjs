// eslint.config.mjs
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict, // adds stricter rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // required for type-aware linting
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // Customize additional rules here
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    //   '@typescript-eslint/explicit-function-return-type': [
    //     'warn',
    //     {
    //       allowExpressions: true,
    //       allowConciseArrowFunctionExpressionsStartingWithVoid: true,
    //     },
    //   ],
    //   '@typescript-eslint/explicit-module-boundary-types': 'warn',
    //   '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    //   '@typescript-eslint/prefer-optional-chain': 'warn',
    //   '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    },
  },
];