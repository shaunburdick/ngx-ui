const { NoErrorsPlugin, BannerPlugin, optimize } = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const commonConfig = require('./webpack.common');
const { ENV, dir } = require('./helpers');

module.exports = function(env) {
  return webpackMerge(commonConfig({ env: ENV }), {
    devtool: 'source-map',
    entry: {
      'app': './demo/index.ts',
      'libs': './demo/libs.ts'
    },
    module: {
      exprContextCritical: false,
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: /(node_modules)/
        },
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
            'angular2-template-loader'
          ],
          exclude: [/\.(spec|e2e|d)\.ts$/]
        },
        {
          test: /\.css/,
          loaders: [
            ExtractTextPlugin.extract({ 
              fallbackLoader: "style-loader",
              loader: 'css-loader'
            }),
            'to-string-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          exclude: /\.component.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        },
        {
          test: /\.component.scss$/,
          loaders: [
            ExtractTextPlugin.extract({ 
              fallbackLoader: 'style-loader',
              loader: 'css-loader'
            }),
            'to-string-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new CheckerPlugin(),
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),
      new optimize.CommonsChunkPlugin({
        name: ['libs'],
        minChunks: Infinity
      }),
      new HtmlWebpackPlugin({
        template: 'demo/index.ejs',
        chunksSortMode: 'dependency',
        title: 'ngx-ui',
        googleAnalytics: {
          trackingId: 'UA-57474611-3',
          pageViewOnLoad: true
        }
      }),
      new CleanWebpackPlugin(['dist'], {
        root: dir(),
        verbose: false,
        dry: false
      }),
      new optimize.UglifyJsPlugin()
    ]
  });

};
