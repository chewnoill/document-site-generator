const path = require("path");

const resolveModules = path.resolve(__dirname, "node_modules");

module.exports = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "out"),
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  entry: {
    main: "./src/main.js",
  },
  resolveLoader: {
    modules: [resolveModules],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"].map(require.resolve),
            },
          },
        ],
      },
    ],
  },
};
