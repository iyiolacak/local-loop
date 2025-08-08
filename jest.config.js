module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\.(t|j)sx?$': ['@swc/jest', { configFile: '.swcrc' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-intl|use-intl))',
  ],
};


