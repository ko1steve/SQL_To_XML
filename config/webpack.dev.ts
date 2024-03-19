import * as Path from 'path'
import * as WebpackMerge from 'webpack-merge'
import * as Common from './webpack.common'

const appDir = Path.dirname(__dirname)

module.exports = WebpackMerge.merge(Common, {
  output: {
    path: Path.join(__dirname, './../dist')
  },
  devtool: 'inline-source-map',
  mode: 'development',

  devServer: {
    static: Path.join(appDir, '../src'),

    port: 8018,

    host: '127.0.0.1',

    hot: true
  }
})