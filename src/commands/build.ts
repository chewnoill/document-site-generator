import { Command, flags } from "@oclif/command";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as Webpack from "webpack";
import buildFolder from "../webpack/content-builder.config";

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

    const outputFolder = args.outputFolder || "out";
    const config = buildFolder(args.folder, outputFolder);

    const webpackConfig = [
      {
        ...config,
        mode: "development" as const,
      },
    ];
    Webpack(webpackConfig).run(() => {
      console.log("done...");
    });
  }
}
