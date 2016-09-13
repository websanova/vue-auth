var webpack           = require("webpack"),
    ReplacePlugin     = require('replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./src/index.js'],
  
  output: {
    path: __dirname + '/dist',
    filename: 'vue-auth.min.js'
  },

  plugins: [

  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}