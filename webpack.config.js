 var path = require('path');
 var webpack = require('webpack');
 var CopyWebpackPlugin = require('copy-webpack-plugin');
 module.exports = {
     entry: './src/app.js',
     output: {
         path: path.resolve(__dirname, 'public'),
         filename: 'app.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map',
     plugins: [
        new CopyWebpackPlugin([
            { 
                from: './index.html', 
                to: 'index.html' 
            }
        ], {
            copyUnmodified: true
        })
    ]
 };