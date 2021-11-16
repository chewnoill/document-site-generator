const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { buildHTML } = require("./src/mdx-template");

const resolveModules = path.resolve(__dirname, "node_modules");

function selectEntrypoint(filename) {

  return path.basename(filename).split(".")[0];
}

const folder = "./docs";
const files = fs
  .readdirSync(folder)
  .map((filename) => path.resolve(".", folder, filename))
  .filter((filename) => fs.lstatSync(filename).isFile());

const contentConfig = require("./webpack.content-loader.config");
const mainConfig = require("./webpack.main.config.js");

module.exports = [
  {
    ...mainConfig,
    mode: "development",
    output: {
      ...mainConfig.output,
      path: path.resolve(__dirname, "out"),
    },
    resolveLoader: {
      modules: [resolveModules],
    },
      devServer: {
        port:9000
      },
  },
  {
    ...contentConfig,
    mode: "development",
    entry: {
      ...files.reduce((acc, filePath) => {
        return {
          ...acc,
          [selectEntrypoint(filePath)]: filePath,
        };
      }, {}),
    },
    plugins: [
      ...files.map(
        (filename) =>
          new HtmlWebpackPlugin({
            inject: "head",
            scriptLoading: "blocking",
            chunks: [selectEntrypoint(filename)],
            filename: selectEntrypoint(filename) + ".html",
            templateContent: buildHTML({
              staticMDX: "",
              script: "const MDXContent = docLoader.default;",
              mainScript: '<script src="main.js"></script>',
            }),
          })
      ),
    ],
  },
];
