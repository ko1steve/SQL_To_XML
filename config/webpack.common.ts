import * as Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { ProvidePlugin } from 'webpack'

const appDir = Path.dirname(__dirname)

module.exports = {
  context: Path.join(appDir, 'src'),
  entry: ['./main.tsx'],
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'image/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json5-loader',
        options: {
          esModule: false
        },
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    modules: [
      Path.resolve(appDir, 'src'),
      Path.resolve(appDir, 'node_modules')
    ],
    alias: {
      src: Path.resolve(appDir, 'src/')
    }
  },
  target: 'web',

  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
    }),
    new ESLintPlugin({
      extensions: ['ts', 'tsx']
    }),
    new HtmlWebpackPlugin({
      file: Path.join(appDir, 'dist', 'index.html'),
      template: './index.html'
    })
  ]
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserWebpackPlugin()]
  // }
}
