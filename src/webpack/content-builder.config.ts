import HtmlWebpackPlugin = require("html-webpack-plugin");
import { buildHTML } from "../mdx-template";
import * as path from "path";
import contentConfig from "./content-loader.config";
import {
  resolveFileList,
  selectEntrypoint,
  selectEntrypointHtml,
} from "../utils";

export default function buildFolder(folder: string, outputFolder: string){

    const files = resolveFileList(folder);

    const entry = files.reduce((acc, filepath) => {
      return {
        ...acc,
        [selectEntrypoint(folder, filepath)]: filepath,
      };
    }, {});

    const resolveModules = [
      path.resolve(__dirname, "..", "..", "node_modules"),
      path.resolve(__dirname, "..", "..", ".."),
    ];

    const webpackConfig = 
      {
        ...contentConfig,
        output: {
          ...contentConfig.output,
          publicPath: "auto",
          path: path.resolve(folder, "..", outputFolder),
        },
        devServer: {
          port: 9000,
        },
        resolveLoader: {
          modules: resolveModules,
        },
        mode: "development" as const,
        entry,
        plugins: [
          ...files.reduce(
            (acc, filename) => [
              ...acc,
              new HtmlWebpackPlugin({
                inject: "head",
                scriptLoading: "blocking",
                chunks: [selectEntrypoint(folder, filename)],
                filename: selectEntrypointHtml(folder, filename),
                templateContent: buildHTML({
                  staticMDX: "",
                  script: "const MDXContent = docLoader.default;",
                  mainScript:
                    '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
                }),
              }),
            ],
            []
          ),
        ],
      };
    return webpackConfig;

}

