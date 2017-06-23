const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = [{
  context: path.resolve(__dirname, 'src'),
  entry: {
    common: './script/common.js',
    index: './script/index.js',
    about: './script/about.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //こっちに dist/sctiptにするとhtmlもscript配下に作成される
    filename: 'script/[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', {modules: false}]
          ]
        }
      }]
    },{
      test: /\.ejs$/,
      use: ['ejs-render-loader']
    },{
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: { limit: 10000 } //Convert images < 10k to base64 strings
      }]
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      filename: './index.html',
      template:  './index.ejs',
      minify: { removeComments: true }
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: './about.html',
      template:  './about.ejs',
      minify: { removeComments: true }
    })
  ]
},{
  context: path.resolve(__dirname, 'src'),
  entry: {
    common: './style/common.scss',
    index: './style/index.scss',
    about: './style/about.scss',
  },
  output: {
    path: path.resolve(__dirname, 'dist/style'),
    filename: '[name].css',
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader: ['css-loader?minimize', 'sass-loader']
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]
}]

module.exports = config
