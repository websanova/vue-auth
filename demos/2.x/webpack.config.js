var webpack           = require('webpack'),
    ReplacePlugin     = require('replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./src/app.js'],
  
  output: {
    path: __dirname + '/public',
    filename: 'app.min.js',
    publicPath: '/'
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: 'src/assets/js', to: 'js'},
    ], {
      ignore: ['*.txt', '.gitkeep']
    }),

    new ReplacePlugin({
      entry: 'src/index.html',
      hash: '[hash]',
      output: '/public/index.html'
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
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: __dirname + '/public'
  }
}