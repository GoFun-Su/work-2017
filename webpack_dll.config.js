const webpack = require("webpack");
const loaderConfig = require("./loaders.config.js");
const path = require("path");

module.exports = {
	resolve: {
		extensions: [".js", ".css"]
		
	},
	entry: {
		dll : ["jquery", "vue", "vuex", "vue-router", 		
		"bootstrap/dist/css/bootstrap", "element-ui"]
	},
	output: {
		path: path.join(__dirname, "js"),
		filename: "MyDll.[name].js",
		library: "[name]_[hash]"
	},	
	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, "js", "[name]-manifest.json"),
			name: "[name]_[hash]"			
		}),
	],
	module: {
		loaders : loaderConfig
	}
}
