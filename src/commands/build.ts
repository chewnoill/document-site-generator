import { Command, flags } from "@oclif/command";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as Webpack from "webpack";
import * as path from "path";
import contentConfig from "../webpack/content-loader.config";
import { buildHTML } from "../mdx-template";
import { resolveFileList, selectEntrypoint } from "../utils";

export default class Run extends Command {
  static description = "Builds the contents of [FOLDER] ";

  static examples = [`$ document-site-builder build docs`];

  static flags = {
    help: flags.help({ char: "h" }),
    outputFolder: flags.string({
      char: "o",
      default: "out",
      helpValue: "output folder",
    }),
  };

  static args = [
    {
      name: "folder",
      required: true,
      description: "folder to process",
      default: "docs",
    },
  ];

  async run() {
    const { args } = this.parse(Run);

    const folder = args.folder;

    const files = resolveFileList(folder);

    const resolveModules = path.resolve(__dirname, "../..", "node_modules");

    const webpackConfig = [
      {
        ...contentConfig,
        mode: "development" as const,
        output: {
          ...contentConfig.output,
          filename: "[name].bundle.js",
          path: path.resolve(folder, "..", args.outputFolder),
        },
        resolveLoader: {
          modules: [resolveModules],
        },
        entry: {
          ...files.reduce(
            (acc, filepath) => ({
              ...acc,
              [selectEntrypoint(folder, filepath)]: filepath,
            }),
            {}
          ),
        },
        plugins: [
          ...files.map(
            (filename) =>
              new HtmlWebpackPlugin({
                inject: "head",
                scriptLoading: "blocking",
                chunks: [selectEntrypoint(folder, filename)],
                filename: selectEntrypoint(folder, filename) + "/index.html",
                templateContent: buildHTML({
                  staticMDX: "",
                  script: "const MDXContent = docLoader.default;",
                  mainScript:
                    '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
                }),
              })
          ),
        ],
      },
    ];
    Webpack(webpackConfig).run(() => {
      console.log("done...");
    });
  }
}
