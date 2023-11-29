/* eslint-disable */
const { merge } = require("webpack-merge");
const commons = require("./webpack.common");

module.exports = merge(commons, {
  mode: 'production',
  devtool: 'source-map',
});
