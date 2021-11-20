import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as Webpack from "webpack";
import * as path from "path";
import contentConfig from "../webpack/content-loader.config";
import { buildHTML } from '../mdx-template';

function selectEntrypoint(filename: string) {
  return filename.split('.')[0];
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

    const files = fs.readdirSync(folder);

    const resolveModules = path.resolve(__dirname, '../..', 'node_modules')
    const webpackConfig = [{
      ...contentConfig,
      mode: "development" as const,
      output: {
        ...contentConfig.output,
        filename: '[name].bundle.js',
        path: path.resolve(folder, '..','out'),
      },
      resolveLoader: {
        modules: [resolveModules],
      },
      entry: {
        ...files.reduce((acc, filename) => ({
          ...acc,
          [selectEntrypoint(filename)]: './' + folder + '/' + filename,
        }), {}),
      },
      plugins: [...files.map(filename => new HtmlWebpackPlugin({
        inject: 'head',
        scriptLoading: 'blocking',
        chunks: [selectEntrypoint(filename)],
        filename: selectEntrypoint(filename) + ".html",
        templateContent: buildHTML({
          staticMDX: "",
          script: "const MDXContent = docLoader.default;",
          mainScript: '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
        }),
      })),
      ],
    }];
    Webpack(webpackConfig).run(()=>{
      console.log('done...');
    });
  }
}
