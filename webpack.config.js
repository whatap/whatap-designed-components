const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'), 
  entry: {
    main: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: 'wdc.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/(node_modules)/],
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['es', 'umd'], {
      exclude: ['.gitignore']
    })
  ]
}

module.exports = config;