var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var configPath = path.resolve(__dirname,'app','conf');
var mainPath = path.resolve(__dirname, 'app', 'main.js');

var config = {

  // We change to normal source mapping
  devtool: 'source-map',
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:/\.json$/,
        include: [configPath],
        loader: 'json'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [nodeModulesPath]
      },{
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
};

module.exports = config;