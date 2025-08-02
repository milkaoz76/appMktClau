// Jest setup file
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
  },
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
  };
});

// Global test utilities
global.console = {
  ...console,
  // Suppress console.warn in tests
  warn: jest.fn(),
  // Suppress console.error in tests
  error: jest.fn(),
};