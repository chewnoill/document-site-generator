import path = require("path");

const base_dir = path.resolve(__dirname, "..", "..");

const productionModules = [
  path.resolve(base_dir, "node_modules"),
  path.resolve(base_dir, ".."),
];

const entry = {
  main: path.resolve(base_dir, "lib", "main", "index.js"),
  reveal: path.resolve(base_dir, "lib", "reveal.js"),
};

export const mainConfig = {
  mode: "production" as const,
  output: {
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
    filename: "[name].js",
  },
  externals: {
    React: "react",
    ReactDOM: "react-dom",
  },
  entry,
  resolve: {
    extensions: [".js", ".jsx"],
  },
  performance: {
    hints: false as const,
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
  resolveLoader: {
    modules: productionModules,
  },
};

export default mainConfig;

export const mainProdConfig = {
  ...mainConfig,
  entry: {
    main: path.resolve(__dirname, "..", "main/index.js"),
    reveal: path.resolve(__dirname, "..", "reveal.js"),
  },
};
