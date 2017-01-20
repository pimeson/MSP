const webpack = require('webpack');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  context: __dirname + '/Browser',
  entry: {
    app: './js/app.js'
  },
  output: {
    path: __dirname + '/Browser/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'ng-annotate!babel', exclude: /node_modules/ },
    ],
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
  }
};