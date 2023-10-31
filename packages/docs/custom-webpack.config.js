const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function () {
  return {
    name: 'tsconfigpath',
    // eslint-disable-next-line
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          plugins: [
            new TsconfigPathsPlugin({
              configFile: './tsconfig.json',
            }),
          ],
        },
      };
    },
  };
};
