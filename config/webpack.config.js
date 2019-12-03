const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const plugins = [
  new CopyWebpackPlugin([
    path.resolve(__dirname, '../src/client/static/index.html')
  ]),
];

module.exports = {
  mode: "production",
  entry: "./src/client/static/index.js",
  plugins: plugins,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../src/client/dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(css)$/i,
        loader: ["style-loader", "css-loader"]
      },
    ]
  },
};
