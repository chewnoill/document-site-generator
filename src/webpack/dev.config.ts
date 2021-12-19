import * as path from "path";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { buildHTML } from "../mdx-template";
import contentConfig from "./content-loader.config";
import mainConfig from "./main.config.js";
import { selectEntrypoint, selectEntrypointHtml } from "../utils";
import { buildRevealTemplate } from "../reveal-template";

const resolveModules = [
  path.resolve(__dirname, "..", "..", "node_modules"),
  path.resolve(__dirname, "..", "..", ".."),
];

const folder = "./docs";

function resolveFileList(folder) {
  return fs.readdirSync(folder).reduce((acc, filename) => {
    if (filename === "public") return acc;
    const subPath = path.resolve(folder, filename);
    if (fs.lstatSync(subPath).isFile()) {
      return [...acc, subPath];
    }
    return [...acc, ...resolveFileList(subPath)];
  }, []);
}

const files = resolveFileList(folder);

module.exports = [
  {
    ...mainConfig,
    mode: "development",
    resolveLoader: {
      modules: resolveModules,
    },
    devServer: {
      port: 9000,
    },
  },
  {
    ...contentConfig,
    mode: "development",
    entry: {
      ...files.reduce((acc, filePath) => {
        return {
          ...acc,
          [selectEntrypoint(folder, filePath)]: filePath,
        };
      }, {}),
    },
    plugins: [
      ...files.map((filename) => {
        if (filename.endsWith(".slides.md")) {
          return new HtmlWebpackPlugin({
            inject: "head",
            scriptLoading: "blocking",
            chunks: [],
            filename: selectEntrypointHtml(folder, filename),
            templateContent: buildRevealTemplate({
              script: '<script src="reveal.js"></script>',
              markdown: fs.readFileSync(filename),
            }),
          });
        }
        return new HtmlWebpackPlugin({
          inject: "head",
          scriptLoading: "blocking",
          chunks: [selectEntrypoint(folder, filename)],
          filename: selectEntrypointHtml(folder, filename),
          templateContent: buildHTML({
            staticMDX: "",
            script: "const MDXContent = docLoader.default;",
            mainScript: '<script src="main.js"></script>',
          }),
        });
      }),
    ],
  },
];
