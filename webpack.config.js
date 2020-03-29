const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  //devtool: "eval-source-map",
  entry: "./js/app.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "docs")
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Matter: "./../assets/matter.min.js"
    })
  ]
};
