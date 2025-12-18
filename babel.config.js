module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo']
    // plugins: [
    //   // NOTE: `expo-router/babel` is a plugin that you must specify.
    //   require.resolve('expo-router/babel'),
    //   'nativewind/babel',
    //   'react-native-reanimated/plugin',
    // ],
  };
};
