import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { RenderPlugin } from "./plugin";
import * as path from "path";
import staticContentConfig from "./content-loader-static.config";
import contentConfig from "./content-loader.config";
import {
  resolveFileList,
  selectEntrypoint,
  selectEntrypointHtml,
} from "../utils";
import { buildRevealTemplate } from "../reveal-template";
import mainConfig from "./main.config";

export default function buildFolder(folder: string, outputFolder: string) {
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

  const webpackConfig = [
    {
      ...mainConfig,
      mode: "development" as const,
      resolveLoader: {
        modules: resolveModules,
      },
      devServer: {
        port: 9000,
      },
    },
    {
      ...contentConfig,
      output: {
        ...contentConfig.output,
        path: path.resolve(folder, "..", outputFolder),
      },
      devServer: {
        port: 9000,
      },
      resolveLoader: {
        modules: resolveModules,
      },
      mode: "production" as const,
      entry,
      plugins: [
        ...files
          .filter((filename) => filename.endsWith(".slides.md"))
          .reduce(
            (acc, filename: string) => [
              ...acc,
              new HtmlWebpackPlugin({
                inject: "head",
                chunks: [],
                filename: selectEntrypointHtml(folder, filename),
                templateContent: buildRevealTemplate({
                  script:
                    '<script src="https://quizzical-poincare-bb2498.netlify.app/reveal.js"></script>',
                  markdown: fs.readFileSync(filename),
                }),
              }),
            ],
            []
          ),
      ],
    },
    {
      ...staticContentConfig,
      entry,
      plugins: [
        ...files
          .filter((f) => !f.endsWith("slides.md"))
          .map(
            (filename) =>
              new RenderPlugin({
                entrypoint: selectEntrypoint(folder, filename),
                filename: selectEntrypointHtml(folder, filename),
                mainUrl:
                  "https://quizzical-poincare-bb2498.netlify.app/main.js",
              })
          ),
      ],
    },
  ];
  return webpackConfig;
}
