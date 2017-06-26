const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const SrcPath = path.resolve(__dirname, 'src'),
      DistPath = path.resolve(__dirname, 'dist')

// filenameを取得するメソッド
String.prototype.filename = function(){
  return this.match(".+/(.+?)([\?#;].*)?$")[1]
}

// ファイルの拡張子削除
function splitExt(filename) {
    return filename.split(/\.(?=[^.]+$)/)[0]
}

// SrcPathのpathも含めたファイルを取得する
// _から始まるファイルはmoduleなので書き出す必要はない
var JsTargets = _.filter(glob.sync(`${SrcPath}/**/*.js`), (item) => {
  return !item.filename().match(/^_/)
})
var CssTargets = _.filter(glob.sync(`${SrcPath}/**/*.+(scss|css)`), (item) => {
  return !item.filename().match(/^_/)
})
var ImageTargets = _.filter(glob.sync(`${SrcPath}/**/*.+(jpg|png|gif|svg)`), (item) => {
  return !item.filename().match(/^_/)
})

var JsEntries = {}
var CssEntries = {}
var ImageEntries = {}

// pathとfilenameでhashを作る
JsTargets.forEach(value => {
  var re = new RegExp(`${SrcPath}/`)
  var key = value.replace(re, '')
  key = splitExt(key)

  // 確認用
  console.log('--------------------------')
  console.log(key)
  console.log(value.filename())
  JsEntries[key] = value
})

CssTargets.forEach(value => {
  var re = new RegExp(`${SrcPath}/`)
  var key = value.replace(re, '')
  key = splitExt(key)

  // 確認用
  console.log('--------------------------')
  console.log(key)
  console.log(value.filename())
  CssEntries[key] = value
});

ImageTargets.forEach(value => {
  var re = new RegExp(`${SrcPath}/`)
  var key = value.replace(re, '')
  // key = splitExt(key)

  // 確認用
  console.log('--------------------------')
  console.log(key)
  console.log(value.filename())
  ImageEntries[key] = value
});

const config = [{
  context: SrcPath,
  entry: JsEntries,
  output: {
    path: DistPath,
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: SrcPath,
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
      test: /\.(jpg|png|gif|svg)$/i,
      loaders: [
        'file-loader?name=[path][name].[ext]'
      ]
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
  context: SrcPath,
  entry: CssEntries,
  output: {
    path: DistPath,
    filename: '[name].css',
  },
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        loader: ['css-loader?minimize', 'sass-loader']
      })
    },{
      test: /\.(jpg|png|gif|svg)$/i,
      loaders: [
        'file-loader?name=[path][name].[ext]'
      ]
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]
},{
  context: SrcPath,
  entry: ImageEntries,
  output: {
    path: DistPath,
    filename: '[name]',
  },
  module: {
    rules: [{
      test: /\.(jpg|png|gif|svg)$/i,
      loaders: [
      'file-loader?name=[path][name].[ext]',
      {
        loader: 'image-webpack-loader',
        query: {
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: '65-90',
            speed: 4
          }
        }
      }
    ]
    }]
  }
}]

module.exports = config
