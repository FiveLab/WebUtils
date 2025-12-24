import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist', 'node_modules'],
    },

    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'comma-dangle': ['error', 'always-multiline'],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'object-curly-spacing': ['error', 'always'],
            'arrow-parens': ['error', 'always'],
            'eqeqeq': ['error', 'always'],
            'no-console': ['warn', {allow: ['debug']}],
        },
    }
];