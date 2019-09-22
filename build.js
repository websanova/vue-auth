const path = require('path');
const webpack = require('webpack');

const webpackConfig = {
  mode: 'production',
  
  entry: './src/index.js',
  
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'vue-auth.min.js',
      libraryTarget: 'umd'
  },
  
  resolve: {
      extensions: ['.js'],
  },

  module: {
      rules: [{
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "src")
          ],
          loader: 'babel-loader',
          options: {
            presets: [[
              "@babel/env", {
                "targets": {
                  "chrome": 52
                },
                "modules": false,
                "loose": false
              }
            ]]
          },
      }]
  },

  optimization: {
    minimize: true
  }
};

const compiler = webpack(webpackConfig);

compiler.run(function (error, stats) {
    if (error) {
        console.log('');
        console.log(error);
        process.exit(1);
    }

    process.stdout.write(stats.toString({
        colors: true,
        hash: true,
        version: true,
        timings: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');
});