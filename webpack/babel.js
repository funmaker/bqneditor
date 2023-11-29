/* eslint-disable */
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        browsers: "last 2 versions",
      },
    }],
    ["@babel/preset-react", {
      development: true,
    }],
  ],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    "babel-plugin-styled-components",
  ],
};
