import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json']
};

export default config;
