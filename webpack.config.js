webpack = require('webpack');
path = require('path');
var __DEV = (process.env.DEV === 'true');

var entry = {};
var plugins = [];

if (__DEV) {
  entry.demo = './demo/demo.js';
} else {
  entry.ed = './src/main.js'
  plugins.push( new webpack.optimize.UglifyJsPlugin() );
}

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: './build/',
    publicPath: '/webpack-memory/',
    filename: '[name].js',
    library: 'TheGridEd',
    libraryTarget: 'commonjs'
  },
  debug: __DEV,
  devtool: (__DEV ? 'cheap-module-eval-source-map' : null),
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: 'babel-loader', 
        include: [
          path.resolve(__dirname, 'demo'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules', 'prosemirror')
        ],
        // Need this here for prosemirror til it has own .babelrc
        query: {
          presets: ['es2015']
        }
      },
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader', 
      //   include: [/demo/, /src/]
      // },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
