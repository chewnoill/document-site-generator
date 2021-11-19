import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import { buildHTML } from '../mdx-template';

const path = require("path");
const contentConfig = require("../../webpack.content-loader.config");

function selectEntrypoint(filename: string) {
  return path.basename(filename).split('.')[0];
}

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

export default class Run extends Command {
  static description = "describe the command here";

  static examples = [`$ docs run `];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "folder" }];

  async run() {
    const { args } = this.parse(Run);

    const folder = path.resolve(args.folder);

    const files = resolveFileList(folder);

    const entry = files.reduce((acc, filepath) => {
      return {
        ...acc,
        [selectEntrypoint(filepath)]: filepath,
      };
    }, {});

    const resolveModules = [path.resolve(__dirname, '..', '..', 'node_modules')]
    const webpackConfig = [
      {
        ...contentConfig,
        output: {
          ...contentConfig.output,
          publicPath: "auto",
        },
        devServer:{
          port: 9000,
        },
        mode: "development",
        entry,
        plugins: [
          ...files
            .reduce(
              (acc, filename) => ([
                ...acc,
                new HtmlWebpackPlugin({
                  inject: "head",
                  scriptLoading: "blocking",
                  chunks: [selectEntrypoint(filename)],
                  filename: selectEntrypoint(filename) + ".html",
                  templateContent: buildHTML({
                    staticMDX: "",
                    script: "const MDXContent = docLoader.default;",
                    mainScript: '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
                  }),
                }),
              ]), [])
            
        ],
      }
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
