import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import { mdx } from "@mdx-js/react";
const path = require("path");
const contentConfig = require("../../webpack.content-loader.config");
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

function selectEntrypoint(filename: string) {
  return path.basename(filename).split('.')[0];
}

export default class Run extends Command {
  static description = "describe the command here";

  static examples = [`$ docs run `];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "folder" }];

  async run() {
    const { args } = this.parse(Run);

    const folder = args.folder;

    const files = fs.readdirSync(folder)
      .map(filename => path.resolve(folder, filename))
      .filter(filename => fs.lstatSync(filename)
        .isFile())

    const entry = files.reduce((acc, filepath) => {
      return {
        ...acc,
        [selectEntrypoint(filepath)]: filepath,
      };
    }, {});

    const resolveModules = [path.resolve(__dirname, '..', '..', 'node_modules'), path.resolve("./", folder)]
    const webpackConfig = [{
      ...contentConfig,
      mode: "development" as const,
      devServer: { 
        port: 9000,
       },
      resolveLoader: {
        modules: resolveModules,
      },
      resolve: {
        modules: resolveModules,
      },
      target: "node",
      entry,
      plugins: [
        new StaticSiteGeneratorPlugin({
          globals: {
            mdx,
          },
          paths: ['/'],
          crawl: true,
        })
      ],
    }];
    const compiler = Webpack(webpackConfig);
    const devServerOptions = { ...webpackConfig[0].devServer, open: true };
    const server = new WebpackDevServer(devServerOptions, compiler);

    const runServer = async () => {
      await server.start();
    };
    runServer();
  }
}
