var webpack           = require("webpack"),
    ReplacePlugin     = require('replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./2.x.demo/src/app.js'],
  
  output: {
    path: __dirname + '2.x.demo/public',
    filename: 'app.min.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: '2.x.demo/src/assets/js', to: 'js'},
    ], {
      ignore: ['*.txt', '.gitkeep']
    }),

    new ReplacePlugin({
      entry: '2.x.demo/src/index.html',
      hash: '[hash]',
      output: '/2.x.demo/public/index.html'
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