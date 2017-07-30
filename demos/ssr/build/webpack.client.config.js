const webpack = require("webpack")
const merge = require("webpack-merge")

const HTMLPlugin = require("html-webpack-plugin")

const base = require("./webpack.base.config")
const config = require("../config")

const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")

// minify options to be used in production mode
// https://github.com/kangax/html-minifier#options-quick-reference
const minifyOptions = {
	collapseWhitespace: true,
	removeComments: true,
	ignoreCustomComments: [/vue-ssr-outlet/]
}

const clientConfig = merge(base, {
	plugins: [
		// strip dev-only code in Vue source
		new webpack.DefinePlugin({
			"process.env.VUE_ENV": "'client'"
		}),
		// generate output HTML
		new HTMLPlugin({
			template: "src/index.template.html",
			minify: config.isProduction ? minifyOptions : {}
		}),
		new VueSSRClientPlugin()
	]
})

if (config.isProduction) {
	clientConfig.plugins.push(
		// minify JS
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	)
}

if(!config.isTesting) {
	clientConfig.plugins.push(
		// extract vendor chunks for better caching
		// https://github.com/Narkoleptika/webpack-everything/commit/b7902f60806cf40b9d1abf8d6bb2a094d924fff7
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: function(module) {
				return module.context && module.context.indexOf("node_modules") !== -1
			}
		}),
		// any other js goes here
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest"
		})
	)
}

if(config.isProduction) {
	clientConfig.plugins.push(
			new webpack.optimize.ModuleConcatenationPlugin()
	)
}

module.exports = clientConfig
