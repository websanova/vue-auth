const webpack = require("webpack")
const merge = require("webpack-merge")
const base = require("./webpack.base.config")
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin")

module.exports = merge(base, {
	target: "node",
	devtool: "#source-map",
	entry: "./src/entry-server.js",
	output: {
		filename: "server-bundle.js",
		libraryTarget: "commonjs2"
	},
	externals: Object.keys(require("../package.json").dependencies),
	plugins: [
		new webpack.DefinePlugin({
			"process.env.VUE_ENV": "'server'"
		}),
		new VueSSRServerPlugin()
	]
})
