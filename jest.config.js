/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', { useESM: true }]
  },
  transformIgnorePatterns: ['/node_modules/(?!sinon/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFiles: [
    './test-setup.js'
  ]
};
