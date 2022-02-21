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
import { RevealPlugin } from "./reveal-plugin";

function selectEntry(folder) {
  return (acc, filepath) => ({
    ...acc,
    [selectEntrypoint(folder, filepath)]: filepath,
  });
}

export default function buildFolder(
  folder: string,
  outputFolder: string,
  publicPath: string
) {
  const files = resolveFileList(folder);
  const slides = files.filter((filename) => filename.endsWith(".slides.md"));
  const pages = files.filter((filename) => !filename.endsWith(".slides.md"));
  const entryPages = pages.reduce(selectEntry(folder), {});
  // we need to build js bundles for all entrypoints
  const entrySlides = files.reduce(selectEntry(folder), {});

  const resolveModules = [
    path.resolve(__dirname, "..", "..", "node_modules"),
    path.resolve(__dirname, "..", "..", ".."),
  ];

  const outputPath = path.resolve(folder, "..", outputFolder);

  const webpackConfig = [
    {
      ...mainConfig,
      output: {
        ...mainConfig.output,
        path: outputPath,
      },
    },
    {
      ...contentConfig,
      output: {
        ...contentConfig.output,
        path: outputPath,
        publicPath,
      },
      resolveLoader: {
        modules: resolveModules,
      },
      mode: "production" as const,
      entry: { ...entryPages, ...entrySlides },
    },
    {
      ...staticContentConfig,
      output: {
        ...staticContentConfig.output,
        path: outputPath,
        publicPath,
      },
      entry: entryPages,
      resolveLoader: {
        modules: resolveModules,
      },
      plugins: [
        ...pages.map(
          (filename) =>
            new RenderPlugin({
              folder,
              filename,
              publicPath,
            })
        ),
        ...slides.reduce(
          (acc, filename: string) => [
            ...acc,
            new RevealPlugin({
              folder,
              filename,
              publicPath,
            }),
          ],
          []
        ),
      ],
    },
  ];
  return webpackConfig;
}
