/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { join } = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const root = join(__dirname, "..");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    quiet: true,
    contentBase: join(root, "wwwroot"),
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [new HardSourceWebpackPlugin()],
});
