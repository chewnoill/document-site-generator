export default {
  mode: "production",
  output: {
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {},
  entry: {
    main: "./lib/main/index.js",
    reveal: "./src/reveal.js",
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
              presets: ["@babel/preset-react"].map(require.resolve as any),
            },
          },
        ],
      },
    ],
  },
};
