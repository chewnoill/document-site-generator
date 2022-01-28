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
