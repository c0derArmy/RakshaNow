module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  
  ],
};
