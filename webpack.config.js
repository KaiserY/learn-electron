const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = {
  entry: {
    vendor: './src/vendor.ts',
    entry: './src/entry.ts'
  },
  target: 'electron',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'app/public'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.ts$/,
      loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
      exclude: [/\.(spec|e2e)\.ts$/]
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
      loader: 'url-loader?limit=30000&name=[name].[ext]'
    }, {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: ['./src/index.html']
    }]
  },
  plugins: [
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['vendor', 'entry']
    }),
    new CopyWebpackPlugin([{
      from: 'src/main.js'
    }])
  ],
  externals: [
    nodeExternals({
      whitelist: [
        'jquery',
        /^material-design/,
        /@angular/,
        /core-js/,
        /zone.js/,
        /rxjs/,
        /reflect-metadata/,
        /symbol-observable/,
        'codemirror'
      ]
    })
  ]
};
