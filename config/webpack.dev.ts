import * as Path from 'path';
import * as Merge from 'webpack-merge';
import * as Common from './webpack.common';

const appDir = Path.dirname( __dirname );

module.exports = Merge( Common, {
	output: {
		path: Path.join( __dirname, './../dist' )
	},
	devtool: 'inline-source-map',
	mode: 'development',

	devServer: {
		contentBase: Path.join( appDir, '../src' ),

		port: 8018,

		host: '127.0.0.1',

		hot: true
	}
} );