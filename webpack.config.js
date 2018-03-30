var webpack = require("webpack")
var path = require("path")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var axios = require("axios")
var webpack = require("webpack")
const loaderConfig = require("./loaders.config.js")

// {
// test: /\.(js|vue)$/,
// loader: 'eslint-loader',
// enforce: 'pre',
// include: [path.resolve('src')],
// options: {
//   formatter: require('eslint-friendly-formatter')
// }
// },
module.exports = {
	entry: {		
		material : path.resolve('./src/material/main.js'),
		question : path.resolve('./src/question/main.js'),		
		bookmaker: path.resolve('./src/bookmaker/main.js'),
		login: path.resolve("./src/login/main.js"),
		bookManage: path.resolve('./src/bookManage/main.js'),
		management: path.resolve('./src/management/main.js'),
		personInfo: path.resolve('./src/personInfo/main.js'),
		"babel-polyfill":"babel-polyfill",
		'promise-polyfill':'promise-polyfill'
	},
	output: {
		path: path.resolve("./build"),
		filename: "[name].[chunkhash].bundle.js"
	},
	module: {
		loaders : loaderConfig
	},
	resolve: {
		extensions: ['.js', '.vue', '.css'],
		alias: {
			'Question': path.resolve('./src/question'),
			'BookMaker': path.resolve('./src/bookmaker'),
			'Material': path.resolve('./src/material'),			
			'Common': path.resolve('./src/common'),
			'Login': path.resolve('./src/login'),
			'bookManage': path.resolve('./src/bookManage'),
			'management': path.resolve('./src/management'),
			'personInfo': path.resolve('./src/personInfo'),
			'vue$': 'vue/dist/vue.esm.js',
			'jquery': 'jquery'
		}
	},	
	devServer : {
		proxy: {
			'/api': 'http://192.168.100.196:80'
			/*'**': 'http://192.168.100.152:10005'*/
		}
	},
	devtool: '#cheap-module-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'material',
			filename: 'material.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'material']
		}),
		new HtmlWebpackPlugin({
			title: 'question',
			filename: 'question.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'question']
		}),
		new HtmlWebpackPlugin({
			title: 'bookmaker',
			filename: 'bookmaker.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'bookmaker']
		}),
		new HtmlWebpackPlugin({
			title: 'login',
			filename: 'login.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'login']
		}),
		new HtmlWebpackPlugin({
			title: 'bookManage',
			filename: 'bookManage.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'bookManage']
		}),
		new HtmlWebpackPlugin({
			title: 'management',
			filename: 'management.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'management']
		}),
		new HtmlWebpackPlugin({
			title: 'personInfo',
			filename: 'personInfo.html',
			template: path.resolve("./test.html"),
			cache: true,
			inject: true,
			chunks: ['vendor', 'manifest', 'personInfo']
		}),
		new webpack.ProvidePlugin({
	      axios: 'axios',
	      'jQuery': "jquery",
	      $: "jquery",
	      'window.jQuery': 'jquery',
	      'window.$': 'jquery',
	      videojs: "video.js",
          "window.videojs": "video.js"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module){
				//return module.context && module.context.indexOf('node_modules') !== -1;
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, "..", "dll"),
			manifest: require("./js/dll-manifest.json")			
		})		
	]
}

