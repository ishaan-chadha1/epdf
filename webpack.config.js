const path = require('path');

module.exports = {
  // Set the mode to 'development' or 'production'
  mode: 'development',

  // Entry point of your application
  entry: './index.ts',

  // Configure how modules are resolved
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js'],
  },

  // Configure the output directory and publicPath for the devServer
  output: {
    filename: 'bundle.js', // The name of the output bundle
    path: path.resolve(__dirname, 'dist'), // The output path
  },

  // Configure the dev server
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // The static files will be served from here
    },
    compress: true, // Enable gzip compression
    port: 9000, // The port on which the server will be started
  },

  // Module rules for how to handle different file types
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Add css-loader and style-loader to handle CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add file-loader to handle image files
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
