const emoji = require("remark-emoji");
const rehypePrism = require("@mapbox/rehype-prism");
 
module.exports = {
  output: {
    library: "docLoader",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
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
              renderer: "",
              remarkPlugins: [emoji],
              rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
            },
          },
        ],
      },
    ],
  },
};
