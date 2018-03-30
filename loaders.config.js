module.exports = [			
	{
    test: /\.vue/, 
    loader: "vue-loader", 
    options: { 
      loaders: {
        'scss': 'vue-style-loader!css-loader!sass-loader',
        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
      }
    }
  },
	{test: /\.js$/, loader: "babel-loader", exclude: /node_modules/},
	{test: /\.css$/, loader: "style-loader!css-loader"},
  {test: /\.less$/,loader: "style-loader!css-loader!less-loader"},  
	{
        test: /\.(png|jpe?g|gif|svg|woff2|woff|svg|eot|ttf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      
  }
]