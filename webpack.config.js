const path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  node: {
    global: true,
    fs: 'empty',
  },
  mode: "none",
  entry: ['@babel/polyfill','./src/index.js'],
  output: {
    filename: 'mybundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve:{
    extensions: [
      ".js",
      ".jsx",
      ".json",
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: './dist/index.html',
    filename: 'index.html',
    inject: false,
  })],
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 4555,
    contentBase: path.join(__dirname, 'dist')
  },
  externals: {
    // global app config object
    config: JSON.stringify({
        apiUrl: 'http://localhost:4444'
    })
  },
  module:{
    rules:[
      {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use:[{
        loader: 'babel-loader',
        query:{
          presets: ['@babel/preset-env', '@babel/react']
        }
      }]
    },
    {
      test: /(\.css)$/,
      use:[{
        loader: 'style-loader, css-loader',
      }]
    },
    {
      test: /\.(png|jpg)$/,
      use:[{
        loader: 'url-loader?limit=8192',
      }]
    }

  ]
  }
}