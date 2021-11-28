import * as path from "path";
import mainConfig from "./main.config";

const resolveModules = path.resolve(__dirname, "..", "..", "node_modules");

module.exports = {
  ...mainConfig,
  mode: "production",
  output: {
    path: path.resolve(resolveModules, "..", "out"),
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolveLoader: {
    modules: [resolveModules],
  },
};
