import * as emoji from "remark-emoji";
import rehypePrism from "@mapbox/rehype-prism";

export default {
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
        test: /\.(png|svg|jpg|jpeg|gif|stl)$/i,
        type: "asset/resource",
      },
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"].map(require.resolve as any),
            },
          },
          {
            loader: "@mdx-js/loader",
            options: {
              jsxImportSource: "@emotion/react",
              providerImportSource: "@mdx-js/react",
              renderer: "",
              remarkPlugins: [emoji],
              rehypePlugins: [],
            },
          },
        ],
      },
    ],
  },
};
