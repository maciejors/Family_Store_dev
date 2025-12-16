/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'.(ts|tsx)': 'ts-jest',
	},
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},

	clearMocks: true,
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!**/vendor/**'],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/coverage',
		'package.json',
		'package-lock.json',
		'setupTests.ts',
	],
	coverageReporters: ['html'],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
};

export default config;
