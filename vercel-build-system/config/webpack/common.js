const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../../src/index.js'),
    server: path.resolve(__dirname, '../../src/server.js')
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js',
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@/components': path.resolve(__dirname, '../../src/components'),
      '@/pages': path.resolve(__dirname, '../../src/pages'),
      '@/utils': path.resolve(__dirname, '../../src/utils'),
      '@/hooks': path.resolve(__dirname, '../../src/hooks'),
      '@/styles': path.resolve(__dirname, '../../src/styles'),
      '@/api': path.resolve(__dirname, '../../api')
    },
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      os: false,
      url: false,
      querystring: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
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
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/data/[name].[contenthash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../../public'),
          to: path.resolve(__dirname, '../../dist'),
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new Dotenv({
      path: path.resolve(__dirname, '../../.env'),
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20
        }
      }
    },
    runtimeChunk: 'single'
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
