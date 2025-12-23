import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
	{
		extends: [...nextCoreWebVitals],
	},
	{
		ignores: ['coverage/**'],
	},
	{
		files: ['**/*.test.{ts,tsx}', '**/__mocks__/**'],
		rules: {
			'react/display-name': 'off',
			'@next/next/no-img-element': 'off',
			'jsx-a11y/alt-text': 'off',
			'import/no-anonymous-default-export': 'off',
		},
	},
]);
