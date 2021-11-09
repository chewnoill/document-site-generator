const path = require("path");
module.exports = {
  mode: "development",
  output: {
    path: path.resolve(__dirname,"out"),
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
  devServer: {},
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env", "@babel/react"],
            },
          },
        ],
      },
    ],
  },
};
