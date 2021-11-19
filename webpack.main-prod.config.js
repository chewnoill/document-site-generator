const path = require("path");

const mainConfig = require("./webpack.main.config.js");

const resolveModules = path.resolve(__dirname, "node_modules");

module.exports = {
  ...mainConfig,
  mode: "production",
  output: {
    path: path.resolve(__dirname, "out"),
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolveLoader: {
    modules: [resolveModules],
  },
};
