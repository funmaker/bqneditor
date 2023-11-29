/* eslint-disable */
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const commons = require("./webpack.common");
const babelOptions = require("./babel");

babelOptions.plugins.unshift(require.resolve('react-refresh/babel'));

module.exports = merge(commons, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      publicPath: '/static',
      directory: './static',
    },
    port: 3939,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
});
