const path = require("path");
const fs = require("fs");
const resolveModules = path.resolve(__dirname, "node_modules");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const emoji = require("remark-emoji");
const rehypePrism = require("@mapbox/rehype-prism");

function selectEntrypoint(filename) {
  return filename.split(".")[0];
}
const folder = "./docs";
const files = fs.readdirSync(folder);

module.exports = [
  {
    mode: "development",
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
  },
  {
    mode: "development",
    output: {
      library: "docLoader",
      libraryTarget: "umd",
      globalObject: "this",
    },
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    entry: {
      ...files.reduce(
        (acc, filename) => ({
          ...acc,
          [selectEntrypoint(filename)]: "./" + folder + "/" + filename,
        }),
        {}
      ),
    },
    module: {
      rules: [
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-react"].map(require.resolve),
              },
            },
            {
              loader: "@mdx-js/loader",
              options: {
                jsxImportSource: "@emotion/react",
                providerImportSource: "@mdx-js/react",
                renderer: '',
                remarkPlugins: [emoji],
                rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...files.map(
        (filename) =>
          new HtmlWebpackPlugin({
            inject: "head",
            scriptLoading: "blocking",
            chunks: [selectEntrypoint(filename)],
            filename: selectEntrypoint(filename) + ".html",
            templateContent: `<html>
  <head>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <script src="main.js"></script>
  </head> 
<body>
<div id="root"></div>
<script>
    const mdx = main.mdx;
    const MDXContent = docLoader.default;
    ReactDOM.render(
      React.createElement(
        main.Provider, {},
        React.createElement(docLoader.default)),
      document.getElementById("root")
    );
</script>
</body>
</html>`,
          })
      ),
    ],
  },
];
