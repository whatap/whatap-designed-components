const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'), 
  entry: {
    main: './index_umd.js'
  },
  output: {
    path: path.resolve(__dirname, 'umd'),
    libraryTarget: 'umd',
    library: 'wdc',
    filename: 'wdc.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src'), /node_modules\/lodash.merge/ ],
        exclude: [/(node_modules)/, path.resolve(__dirname, 'src/ReactWrapper'), path.resolve(__dirname, 'src/index.js')],
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