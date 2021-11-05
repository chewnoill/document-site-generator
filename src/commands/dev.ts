import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as Webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import { SourceMapGenerator } from 'source-map'
import renderToString from 'mdx-hydra/renderToString'

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
              { loader: "babel-loader", options: { } },
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
        templateContent:
          `<html>
  <head>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <script src="/provider.js"></script>
  </head> 
  <body>
    <div id="root"></div>
    <script>
    ReactDOM.render(
      React.createElement(provider.default, {},
        React.createElement(docLoader.default, {components: provider.components})), 
      document.getElementById("root")
    );
    </script>
  </body>
</html>`
      })),
      ],
    },
    {
      mode: "development" as const,
      output: {
        library: 'provider',
        libraryTarget: 'umd',
        globalObject: 'this',
      },
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
      },
      entry: {
        'provider': './src/provider.js'
      },
      devServer: {},
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ["@babel/env", "@babel/react"]
              }
            }]
          }
        ]
      },
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
