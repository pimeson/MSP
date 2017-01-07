const webpack = require('webpack');

module.exports = {
  context: __dirname + '/Browser',
  entry: {
    app: './js/app.js'
  },
  output: {
    path: __dirname + '/Browser/js',
    filename: 'bundle.js'
  },
  loaders: [{
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: [/node_modules/],
    query: {
        presets: ['es2015']
      }
  }, {
    test: /\.html$/,
    loader: 'html-loader',
    exclude: [/node_modules/]
  }, {
    test: /\.css$/,
    loader: "style!css",
    exclude: [/node_modules/]
  }, {
    test: /\.scss$/,
    loader: "style!css!sass",
    exclude: [/node_modules/]
  }],
  plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
  node: {
  fs: "empty"
  }
};