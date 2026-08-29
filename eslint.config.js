import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	react.configs.flat.recommended,
	{
		files: [ '**/*.{ts,tsx}' ],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname
			}
		},
		settings: {
			react: {
				version: 'detect'
			}
		},
		plugins: {
			'@stylistic': stylistic,
			'react-hooks': reactHooks
		},
		rules: {
			...reactHooks.configs.recommended.rules,

			// Matches the previous eslint-config-react-app behaviour: unused
			// arguments are allowed, as they are often required by a signature.
			'@typescript-eslint/no-unused-vars': [ 'warn', { args: 'none', ignoreRestSiblings: true } ],

			'@stylistic/semi': [ 'error', 'always' ],
			'@stylistic/comma-dangle': [ 'error', 'never' ],
			'@stylistic/quotes': [ 'error', 'single' ],
			'@stylistic/object-curly-spacing': [ 'error', 'always' ],
			'@stylistic/indent': [ 'error', 'tab', { SwitchCase: 1 } ],
			'@stylistic/no-tabs': [ 'error', { allowIndentationTabs: true } ],
			'@stylistic/arrow-parens': [ 'error', 'as-needed' ],
			'@stylistic/no-trailing-spaces': [ 'error' ],
			'@stylistic/array-bracket-spacing': [ 'error', 'always' ],
			'@stylistic/array-element-newline': [ 'error', 'consistent' ],
			'@stylistic/array-bracket-newline': [ 'error', 'consistent' ],
			'@stylistic/jsx-quotes': [ 'error', 'prefer-single' ],
			'@stylistic/max-len': [ 'warn', { code: 200 } ],

			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-member-argument': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',

			'sort-imports': [
				'warn',
				{
					allowSeparatedGroups: true,
					memberSyntaxSortOrder: [ 'all', 'multiple', 'single', 'none' ]
				}
			],
			'no-warning-comments': 'warn',
			'no-debugger': 'warn',
			'no-console': [ 'warn', { allow: [ 'warn', 'error' ] } ],
			'react/react-in-jsx-scope': 'off'
		}
	},
	{
		files: [ 'vite.config.ts' ],
		languageOptions: {
			globals: globals.node
		}
	}
);
