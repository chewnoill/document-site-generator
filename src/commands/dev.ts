import { Command, flags } from "@oclif/command";
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import * as path from "path";
import buildFolder from "../webpack/content-builder.config";
import mainConfig from "../webpack/main.config";

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
    const config = buildFolder(folder, "out");
    const webpackConfig: any = [mainConfig, ...config];
    try {
      const compiler = Webpack(webpackConfig);
      const devServerOptions = {
        port: 9000,
        open: true,
      };
      const server = new WebpackDevServer(devServerOptions, compiler);
      const runServer = async () => {
        await server.start();
      };
      runServer().catch((error) => {
        console.log({ error });
      });
    } catch (e) {
      console.log({ error: e });
    }
  }
}
