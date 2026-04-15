// Custom mock for React Native dependencies
module.exports = {
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios,
  },
  NativeModules: {},
};