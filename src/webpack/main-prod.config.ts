import * as path from "path";
import mainConfig from "./main.config";

export default {
  ...mainConfig,
  mode: "production" as const,
  output: {
    path: path.resolve(__dirname, "..", "..", "lib"),
    library: "main",
    libraryTarget: "umd",
    globalObject: "this",
  },
};
