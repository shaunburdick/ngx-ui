const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin, ForkCheckerPlugin } = require('awesome-typescript-loader');

const commonConfig = require('./webpack.common');
const { ENV, dir } = require('./helpers');

module.exports = function(config) {
  return webpackMerge(commonConfig({ env: ENV }), {
    devtool: 'cheap-module-source-map',
    devServer: {
      port: 9999,
      hot: config.HMR,
      stats: {
        modules: false,
        cached: false,
        chunk: false
      }
    },
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
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: /(node_modules|release|dist)/
        },
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
            '@angularclass/hmr-loader'
          ],
          exclude: [/\.(spec|e2e|d)\.ts$/]
        },
        {
          test: /\.css/,
          loaders: [
            'style-loader',
            'css-loader?sourceMap'
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        }
      ]
    },
    plugins: [
      // new ForkCheckerPlugin(),
      new CheckerPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['libs'],
        minChunks: Infinity
      }),
      new HtmlWebpackPlugin({
        template: 'demo/index.ejs',
        chunksSortMode: 'dependency',
        title: 'swui'
      }),
      new WebpackNotifierPlugin({
        excludeWarnings: true
      }),
      new ProgressBarPlugin({
        format: chalk.yellow.bold('Webpack Building...') + 
          ' [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  });

};
