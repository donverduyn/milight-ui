module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
  ],
  overrides: [
    {
      files: ['./**/*.js', './**/*.cjs', './**/*.mjs'],
      // config files are assumed to be running in node
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      env: { node: true },
    },
    // browser environment
    {
      excludedFiles: ['*.test.ts', '*.test.tsx'],
      files: ['./src/**/*.ts', './src/**/*.tsx'],
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      env: { browser: true },
      parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: ['./tsconfig.json'],
          },
        },
      },
    },
    // node environment
    {
      files: [
        'vite.config.ts',
        './src/**/*.test.ts?(x)',
        './test/**/*.ts',
        './scripts/**/*.ts',
        './server/**/*.ts',
      ],
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      env: { node: true },
      parserOptions: {
        ecmaVersion: 'latest',
        // include tsconfig.json for importing types from server
        project: ['tsconfig.json', './tsconfig.node.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: ['tsconfig.json', './tsconfig.node.json'],
          },
        },
      },
    },
    {
      // all TypeScript files
      files: ['*.ts', '*.tsx'],
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint', 'typescript-sort-keys'],
      rules: {
        '@typescript-eslint/no-confusing-void-expression': [
          'warn',
          { ignoreArrowShorthand: true },
        ],
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true,
          },
        ],
        '@typescript-eslint/no-floating-promises': [
          'warn',
          { ignoreVoid: true },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'all',
            argsIgnorePattern: '^_$',
            ignoreRestSiblings: true,
            vars: 'local',
            varsIgnorePattern: '^_$',
          },
        ],
        '@typescript-eslint/no-useless-template-literals': 'warn',
        '@typescript-eslint/unbound-method': 'off',
        'prefer-const': 'warn',
        'prefer-spread': 'off',
        'typescript-sort-keys/interface': 'warn',
        'typescript-sort-keys/string-enum': 'warn',
      },
    },
    {
      // all test files
      files: [
        './test/**/*.ts',
        './test/**/*.tsx',
        './src/**/*.test.ts',
        './src/**/*.test.tsx',
      ],
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      extends: ['plugin:vitest/legacy-all'],
      rules: {
        'vitest/max-nested-describe': ['error', { max: 3 }],
        'vitest/no-hooks': 'off',
      },
    },
    {
      files: ['*.tsx'],
      // all React files
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      extends: [
        'plugin:react/jsx-runtime',
        'plugin:react/all',
        'plugin:react-hooks/recommended',
      ],
      plugins: [
        'react',
        'react-hooks',
        'react-refresh',
        'better-styled-components',
      ],
      rules: {
        'better-styled-components/sort-declarations-alphabetically': 'warn',
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@mui/*/*/*'],
          },
        ],
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
        'react/destructuring-assignment': [
          'warn',
          'always',
          { destructureInSignature: 'ignore', ignoreClassFields: true },
        ],
        'react/forbid-component-props': 'off',
        'react/function-component-definition': [
          'warn',
          {
            namedComponents: ['function-declaration', 'arrow-function'],
            unnamedComponents: ['arrow-function'],
          },
        ],
        'react/jsx-boolean-value': 'warn',
        'react/jsx-child-element-spacing': 'off',
        'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
        'react/jsx-closing-tag-location': 'off',
        'react/jsx-curly-brace-presence': 'warn',
        'react/jsx-curly-spacing': 'warn',
        'react/jsx-filename-extension': [
          'error',
          { allow: 'as-needed', extensions: ['.tsx'] },
        ],
        'react/jsx-handler-names': 'off',
        'react/jsx-indent': ['warn', 2],
        'react/jsx-indent-props': ['warn', 2],
        'react/jsx-max-depth': ['warn', { max: 3 }],
        'react/jsx-max-props-per-line': [
          'warn',
          { maximum: { multi: 1, single: 3 } },
        ],
        'react/jsx-newline': [
          'warn',
          { allowMultilines: false, prevent: true },
        ],
        'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
        'react/jsx-no-comment-textnodes': 'warn',
        'react/jsx-no-literals': 'off',
        'react/jsx-no-useless-fragment': 'warn',
        'react/jsx-one-expression-per-line': [
          'warn',
          { allow: 'single-child' },
        ],
        'react/jsx-props-no-multi-spaces': 'warn',
        'react/jsx-sort-props': [
          'warn',
          {
            callbacksLast: false,
            ignoreCase: true,
            multiline: 'last',
            reservedFirst: true,
            shorthandFirst: true,
          },
        ],
        'react/jsx-wrap-multilines': 'off',
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        'react/no-unused-prop-types': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
      },
      settings: { react: { version: 'detect' } },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'unused-imports', 'sort-keys-fix'],
  root: true,
  rules: {
    'eslint-comments/no-unused-disable': 'warn',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'warn',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
        pathGroups: [
          {
            group: 'external',
            pattern: 'react',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
    'no-irregular-whitespace': 'off',
    'prettier/prettier': 'warn',
    'sort-keys': 'off',
    'sort-keys-fix/sort-keys-fix': [
      'warn',
      'asc',
      { caseSensitive: true, natural: false },
    ],
    'unused-imports/no-unused-imports': 'warn',
  },
};
