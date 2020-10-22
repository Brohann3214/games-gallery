module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:jsx-a11y/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['react'],
	settings: {
		react: {
			version: 'detect',
		},
	},
	rules: {
		'no-unused-vars': ['error', { ignoreRestSiblings: true }],

		// https://github.com/vercel/next.js/issues/5533
		'jsx-a11y/anchor-is-valid': 'off',

		'react/prop-types': ['error', { skipUndeclared: true }],
		'react/react-in-jsx-scope': 'off',
	},
};
