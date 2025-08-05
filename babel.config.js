module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/navigation': './src/navigation',
            '@/modules': './src/modules',
            '@/shared': './src/shared',
            '@/hooks': './src/shared/hooks',
            '@/utils': './src/shared/utils',
            '@/types': './src/shared/types',
            '@/config': './src/shared/config',
          },
        },
      ],
    ],
  };
};