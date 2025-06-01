const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Your main React entry file
  output: {
    path: path.resolve(__dirname, '../backend/static/frontend'),
    filename: 'main.js',
    publicPath: '/static/frontend/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: path.resolve(__dirname, '../backend/templates/index.html'),
      inject: true,
    }),
    new webpack.ProvidePlugin({
        "React": "react",
     }),
     new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/images'),
          to: path.resolve(__dirname, '../backend/static/frontend/images'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'production', // Change to 'development' for dev builds
};
