module.exports = {
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>/src',
    '<rootDir>/api'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/api/**/__tests__/**/*.(js|ts)',
    '<rootDir>/api/**/*.(test|spec).(js|ts)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@babel/runtime|axios)/)'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/api/(.*)$': '<rootDir>/api/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp|ico)$': '<rootDir>/config/jest/__mocks__/fileMock.js',
    '\\.(woff|woff2|ttf|eot)$': '<rootDir>/config/jest/__mocks__/fileMock.js'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'api/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!api/**/*.d.ts',
    '!src/index.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/temp/**',
    '!**/logs/**',
    '!**/coverage/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js'
  ],
  testTimeout: 10000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  errorOnDeprecated: true,
  notify: false,
  bail: false,
  maxWorkers: '50%',
  cacheDirectory: '<rootDir>/temp/.jest-cache',
  snapshotSerializers: [
    '@emotion/jest/serializer'
  ]
};
