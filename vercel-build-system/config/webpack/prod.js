const { merge } = require('webpack-merge')
const common = require('./common.js')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    ...common.output,
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js'
  },
  module: {
    rules: [
      ...common.module.rules.map(rule => {
        if (rule.test && rule.test.toString().includes('css')) {
          return {
            ...rule,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    auto: true,
                    localIdentName: '[hash:base64:5]'
                  },
                  importLoaders: 1
                }
              }
            ]
          }
        }
        return rule
      })
    ]
  },
  plugins: [
    ...common.plugins,
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[name].[contenthash].chunk.css'
    }),
    ...(process.env.ANALYZE === 'true'
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../../reports/bundle-analyzer-report.html',
            openAnalyzer: false
          })
        ]
      : [])
  ],
  optimization: {
    ...common.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      ...common.optimization.splitChunks,
      cacheGroups: {
        ...common.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    assetFilter: function (assetFilename) {
      return !/\.map$/.test(assetFilename)
    }
  },
  stats: {
    colors: false,
    reasons: false,
    errorDetails: true,
    children: false,
    chunks: false,
    modules: false,
    chunkModules: false,
    entrypoints: false,
    assets: true,
    version: false,
    timings: true,
    hash: true,
    builtAt: true,
    warnings: true,
    errors: true,
    publicPath: true,
    outputPath: true
  }
})
