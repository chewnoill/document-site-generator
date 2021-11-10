import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import { SourceMapGenerator } from 'source-map'
import { buildDynamicHTML } from "../mdx-template";
import path = require("path");

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


    const resolveModules = path.resolve(__dirname,'../..','node_modules')
    const webpackConfig = [{
      mode: "development" as const,
      output: {
        library: 'docLoader',
        libraryTarget: 'umd',
        globalObject: 'this',
      },
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@emotion/*': '@emotion/*',
      },
      resolve: {
        modules: [resolveModules],
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
      devServer: {},
      module: {
        rules: [
          {
            test: /\.mdx?$/,
            use: [
              { loader: "babel-loader", options: { 
                presets: ["@babel/preset-react"].map(require.resolve as any)
              } },
              {
                loader: '@mdx-js/loader',
                /** @type {import('@mdx-js/loader').Options} */
                options: {
                  SourceMapGenerator,
                },
              },
            ]
          }
        ]
      },
      plugins: [...files.map(filename => new HtmlWebpackPlugin({
        inject: 'head',
        scriptLoading: 'blocking',
        chunks: [selectEntrypoint(filename)],
        filename: selectEntrypoint(filename) + ".html",
        templateContent: buildDynamicHTML()
      })),
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
