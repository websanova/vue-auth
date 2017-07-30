const path = require("path")
const webpack = require("webpack")

const config = require("../config")

const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")

const commonPlugins = [
	new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(config.nodeEnv),
		"PRODUCTION": config.isProduction
	})
]

module.exports = {
	devtool: config.isProduction
		? false
		: "inline-source-map",

	entry: {
		app: "./src/entry-client.js"
	},

	output: {
		path: path.resolve(__dirname, "../dist"),
		publicPath: "/dist/",
		filename: "js/[name].[chunkhash:16].js"
	},

	resolve: {
		alias: {
			"static": path.resolve(__dirname, "../static"),
			"src": path.resolve(__dirname, "../src"),
			"components": path.resolve(__dirname, "../src/components"),
			"images": path.resolve(__dirname, "../src/images"),
			"router": path.resolve(__dirname, "../src/router"),
			"store": path.resolve(__dirname, "../src/store"),
			"styles": path.resolve(__dirname, "../src/styles"),
			"mixins": path.resolve(__dirname, "../src/mixins"),
			"views": path.resolve(__dirname, "../src/views")
		},
    extensions: ['.js', '.vue', '.scss']
	},
	resolveLoader: {
		alias: {
			'scss-loader': 'sass-loader'
		}
	},
	module: {
		noParse: /es6-promise\.js$/, // avoid webpack shimming process
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					preserveWhitespace: false,
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: "img/[name].[hash:16].[ext]"
				}
			}
		]
	},

	performance: {
		maxEntrypointSize: 250000,
		hints: config.isProduction ? "warning" : false
	},

	plugins: config.isProduction ? commonPlugins : commonPlugins.concat([
		new FriendlyErrorsPlugin()
	])
}
