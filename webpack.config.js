module.exports = {
  context: __dirname,
  entry: "./javascript/main.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.node$/,
        loader: "node-loader"
      }
    ]
  }
};
