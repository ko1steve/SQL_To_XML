import * as Path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ESLintPlugin from 'eslint-webpack-plugin';

const appDir = Path.dirname( __dirname );

module.exports = {
	context: Path.join( __dirname, '../src' ),
	entry: [ './main.ts' ],
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [ 'style-loader', 'css-loader' ],
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'null-loader'
			},
			{
				test: /\.json$/,
				loader: 'json5-loader',
				options: {
					esModule: false,
				},
				type: 'javascript/auto'
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js', '.css', '.scss' ],
		modules: [
			Path.resolve( appDir, 'src' ),
			Path.resolve( appDir, 'node_modules' )
		],
		alias: {
			'src': Path.resolve( appDir, 'src/' )
		}
	},
	target: 'web',

	plugins: [
		new ESLintPlugin({
			extensions: ['ts', 'tsx'],
		}),
		new HtmlWebpackPlugin( {
			file: Path.join( appDir, 'dist', 'index.html' ),
			template: './index.html'
		} )
	]
};