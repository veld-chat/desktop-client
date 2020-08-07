/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const { join } = require("path");
const { getTsAlias } = require("./utils");

const root = join(__dirname, "..");

module.exports = {
  entry: {
    main: join(root, "src/index.ts"),
  },
  output: {
    filename: "[name].js",
    path: join(root, "dist"),
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".vue"],
    alias: getTsAlias(),
  },

  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        enforce: "pre",
        test: /\.(js|vue|ts)$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: join(root, "wwwroot/index.ejs"),
      inject: false,
      templateParameters: function (compilation, assets, options) {
        return {
          files: assets,
          options: options,
          webpackConfig: compilation.options,
          webpack: compilation.getStats().toJson(),
        };
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
