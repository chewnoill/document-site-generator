import { buildHTML } from "../mdx-template";
import * as ReactDOMServer from "react-dom/server";
import { mdx } from "@mdx-js/react";
import Wrapper from "../main/wrapper";

const components = { wrapper: Wrapper };

type Options = {
  entrypoint: string;
  filename: string;
  mainUrl: string;
};

export class RenderPlugin {
  static defaultOptions: Options = {
    entrypoint: "index",
    filename: "index.html",
    mainUrl: "https://quizzical-poincare-bb2498.netlify.app/main.js",
  };
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...RenderPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = RenderPlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;
    const sourceJs = this.options.entrypoint + ".js";
    const nodeSourceJs = this.options.entrypoint + ".node.js";
    const destHtml = this.options.filename;
    const mainUrl = this.options.mainUrl;
    compiler.hooks.afterCompile.tap({ name: pluginName }, function (params) {
      if (!params.assets[nodeSourceJs]) return;
      const source = params.assets[nodeSourceJs].source();

      // TODO: I don't really understand this
      const Module: any = module.constructor;
      const m = new Module();
      m.mdx = mdx;
      m._compile(`const mdx=module.mdx;` + source, nodeSourceJs);
      if(!m.exports?.default){
        return;
      }
      const staticReactContent = ReactDOMServer.renderToString(
        m.exports.default({ components })
      );
      const content = buildHTML({
        staticMDX: staticReactContent.trim(),
        script: "const MDXContent = docLoader.default;",
        mainScript: [
          `<script src="${mainUrl}"></script>`,
          `<script src="${sourceJs}"></script>`,
        ].join(""),
      });

      compiler.hooks.emit.tap(pluginName, (compilation) => {
        if (compilation.assets[destHtml]) {
          compilation.updateAsset(destHtml, new RawSource(content));
        } else {
          compilation.emitAsset(destHtml, new RawSource(content));
        }
      });
    });
  }
}
