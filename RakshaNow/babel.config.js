// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     [
//       '@babel/plugin-transform-runtime',
//       {
//         helpers: true,
//         regenerator: true,
//       },
//     ],
//   ],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};