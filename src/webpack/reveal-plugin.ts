import * as fs from "fs";
import { selectEntrypointHtml } from "../utils";
import { buildRevealTemplate } from "../reveal-template";

type Options = {
  publicPath: string;
  folder: string;
  filename: string;
};

export class RevealPlugin {
  static defaultOptions: Options = {
    publicPath: "/",
    folder: "docs",
    filename: "deck.slides.md",
  };
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...RevealPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = RevealPlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;
    const publicPath = this.options.publicPath;
    const filename = this.options.filename;

    const destHtml = selectEntrypointHtml(
      this.options.publicPath,
      this.options.folder,
      this.options.filename
    );
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
        },
        (_, callback) => {
          const htmlContent = buildRevealTemplate({
            script: `<script src="${publicPath}reveal.js"></script>`,
            markdown: fs.readFileSync(filename).toString(),
          });
          if (compilation.assets[destHtml]) {
            compilation.updateAsset(destHtml, new RawSource(htmlContent));
          } else {
            compilation.emitAsset(destHtml, new RawSource(htmlContent));
          }
          callback();
        })
      })
  }
}
