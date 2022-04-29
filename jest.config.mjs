// eslint-disable-next-line @typescript-eslint/require-await
export default async () => ({
	displayName: 'Unit Test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json'
		}
	}
});
