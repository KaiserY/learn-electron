const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        "./src/entry.ts"
    ],
    target: "electron-renderer",
    output: {
        path: path.join(__dirname, "app/public"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            exclude: [/\.(spec|e2e)\.ts$/]
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
            loader: 'url-loader?limit=30000&name=[name].[ext]'
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],
    externals: {
        'electron': 'require("electron")'
    }
};
