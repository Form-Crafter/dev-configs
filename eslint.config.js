import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: { globals: { ...globals.browser } },
    },
    ...tseslint.configs.recommended,
    pluginReactConfig,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            'react-hooks': pluginReactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
        },
    },
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': ['error', { groups: [['^\\u0000'], ['^@?\\w'], ['^_?\\w'], ['^\\.']] }],
            'simple-import-sort/exports': 'error',
        },
    },
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    },
    {
        ignores: ['node_modules/*', 'dist/*', 'public/*'],
    },
]
