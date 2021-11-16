    const webpackConfig = [{
      mode: "development",
      output: {
        library: 'docLoader',
        libraryTarget: 'umd',
        globalObject: 'this',
      },
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
      },
      resolve: {
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
              {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-react"].map(require.resolve)
                }
              },
              {
                loader: '@mdx-js/loader',
                options: {
                  renderer: ``
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
