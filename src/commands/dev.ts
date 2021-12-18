import { Command, flags } from "@oclif/command";
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import { buildHTML } from "../mdx-template";
import * as path from "path";
import contentConfig from "../webpack/content-loader.config";
import {
  resolveFileList,
  selectEntrypoint,
  selectEntrypointHtml,
} from "../utils";
import buildFolder from "../webpack/content-builder.config";

export default class Run extends Command {
  static description =
    "Runs a webpack development service to see changes you make locally";

  static examples = [`$ document-site-builder dev docs`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "folder",
      required: true,
      description: "folder to watch",
      default: "docs",
    },
  ];

  async run() {
    const { args } = this.parse(Run);

    const folder = path.resolve(args.folder);
    const config = buildFolder(folder,'out');
    const webpackConfig = [
      {
        ...config,
        devServer: {
          port: 9000,
        },
        mode: "development" as const,
      },
    ];
    const compiler = Webpack(webpackConfig);
    const devServerOptions = { ...webpackConfig[0].devServer, open: true };
    const server = new WebpackDevServer(devServerOptions, compiler);

    const runServer = async () => {
      await server.start();
    };
    runServer();
  }
}
