import * as path from "path";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import contentConfig from "./content-loader.config";
import staticContentConfig from "./content-loader-static.config";
import buildFolder from "./content-builder.config";

const folder = "./docs";

const webpackConfig = buildFolder(folder, "out", '/');

module.exports = [
  {
    ...webpackConfig[0],
    mode: "development",
    devServer: {
      port: 9000,
    },
  },
  ...webpackConfig.slice(1)
];
