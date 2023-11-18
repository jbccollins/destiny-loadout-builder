module.exports = {
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	testPathIgnorePatterns: ['/lib/', '/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverage: false,
	moduleNameMapper: {
		'^@dlb/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+\\.[tj]s$': 'ts-jest',
	},
	// TODO: Get rid of this when we can actually use the base library
	transformIgnorePatterns: [
		'<rootDir>/node_modules/(?!bungie-api-ts-no-const-enum)',
	],
};
