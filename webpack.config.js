const path = require('path');

const config = {
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
  }
}

module.exports = config;