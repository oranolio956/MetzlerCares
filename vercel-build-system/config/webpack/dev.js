const { merge } = require('webpack-merge');
const common = require('./common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../../public'),
      publicPath: '/'
    },
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      logging: 'warn',
      progress: true
    }
  },
  output: {
    ...common.output,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js'
  },
  optimization: {
    ...common.optimization,
    minimize: false,
    splitChunks: {
      ...common.optimization.splitChunks,
      chunks: 'async'
    }
  },
  module: {
    rules: [
      ...common.module.rules,
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: {
    colors: true,
    reasons: true,
    errorDetails: true,
    children: false,
    chunks: false,
    modules: false,
    chunkModules: false,
    entrypoints: false,
    assets: false,
    version: false,
    timings: true,
    hash: false,
    builtAt: true,
    warnings: true,
    errors: true
  }
});
