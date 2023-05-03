// ALL_PACKAGES
const allPackages = [
  'core',
  'react',
  'components-lib/*',
  'vue'
]

const createPattern = () => [
  {
    group: ['**/dist', '**/dist/**'],
    message: 'Don not import from dist',
    allowTypeImports: false
  },
  {
    group: ['**/src', '**/src/**'],
    message: 'Don not import from src',
    allowTypeImports: false
  }
]

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: [
    'demo/public/*',
    'demo/dist/*',
    'pages/*'
  ],
  overrides: [
    {
      plugins: ['react', '@typescript-eslint'],
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react/react-in-jsx-scope': 'off'
      }
    },
    ...allPackages.map(pkg => ({
      files: [`packages/${pkg}/src/*.ts`],
      rules: {
        '@typescript-eslint/no-restricted-imports': [
          'error',
          {
            patterns: createPattern(pkg)
          }
        ]
      }
    }))
  ],
  settings: {
    react: {
      version: '18'
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: false }
    ],
    '@typescript-eslint/no-namespace': 'off',
    // TODO fix start
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // end
    'react/prop-types': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'semi': ['error', 'never'],
    'block-spacing': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 'first',
      // ignore jsx node
      ignoredNodes: ['JSXElement *']
    }],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 'first'],
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/dist', '**/dist/**'],
            message: 'Don not import from dist',
            allowTypeImports: false
          },
          {
            group: ['**/src', '**/src/**'],
            message: 'Don not import from src',
            allowTypeImports: false
          }
        ]
      }
    ]
  }
}
