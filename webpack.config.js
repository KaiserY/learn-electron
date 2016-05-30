const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    index: "./src/entry.ts"
  },
  target: "electron",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "app/public"),
    filename: "[name].bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.ts$/,
      loader: "awesome-typescript-loader",
      exclude: [/\.(spec|e2e)\.ts$/]
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
      loader: "url-loader?limit=30000&name=[name].[ext]"
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.html",
    chunks: ["index"]
  })],
  externals: [
    nodeExternals({
      whitelist: [
        "jquery",
        /^material-design/,
        "codemirror"
      ]
    })
  ]
};
