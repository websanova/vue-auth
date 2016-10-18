var webpack           = require("webpack"),
    ReplacePlugin     = require('replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./1.x.demo/src/app.js'],
  
  output: {
    path: __dirname + '1.x.demo/public',
    filename: 'app.min.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: '1.x.demo/src/assets/js', to: 'js'},
    ], {
      ignore: ['*.txt', '.gitkeep']
    }),

    new ReplacePlugin({
      entry: '1.x.demo/src/index.html',
      hash: '[hash]',
      output: '/1.x.demo/public/index.html'
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
    historyApiFallback: true
  }
}