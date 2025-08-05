const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar path aliases para Metro
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/navigation': path.resolve(__dirname, 'src/navigation'),
  '@/modules': path.resolve(__dirname, 'src/modules'),
  '@/shared': path.resolve(__dirname, 'src/shared'),
  '@/hooks': path.resolve(__dirname, 'src/shared/hooks'),
  '@/utils': path.resolve(__dirname, 'src/shared/utils'),
  '@/types': path.resolve(__dirname, 'src/shared/types'),
  '@/config': path.resolve(__dirname, 'src/shared/config'),
};

module.exports = config;