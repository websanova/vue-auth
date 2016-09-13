var webpack           = require("webpack"),
    ReplacePlugin     = require('replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./demo/src/app.js'],
  
  output: {
    path: __dirname + 'demo/public',
    filename: 'app.min.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: 'demo/src/public/js', to: 'js'},
    ], {
      ignore: ['*.txt', '.gitkeep']
    }),

    new ReplacePlugin({
      entry: 'demo/src/index.html',
      hash: '[hash]',
      output: '/demo/public/index.html'
    })
  ],

  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },

  devServer: {
    port: 8000,
    historyApiFallback: true
  }
}