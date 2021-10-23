const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const port = 1111;
const htmlPlugin = new HtmlWebPackPlugin({
 template: "./src/public/index.html",
 filename: "./index.html"
});
module.exports = {
mode: 'production',
entry: [
    './src/renderer.js'
],
  module: {
    rules: [{
   test: /\.js$/,
   exclude: /node_modules/,
   use: {
     loader: "babel-loader"
   }
 },
  {
   test: /\.css$/,
   use: ["style-loader", "css-loader"]
  },
  {
      test: /\.html$/,
      use: [
          {
              loader: "html-loader"
          }
      ]
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
    exclude: /node_modules/,
    use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
  }
]},
 plugins: [htmlPlugin],
 output: {
     filename: 'renderer.prod.js',
     path: path.resolve(__dirname, 'dist'),
     hashFunction: "xxhash64"
 }
};