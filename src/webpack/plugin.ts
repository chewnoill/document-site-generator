import { buildHTML } from "../mdx-template";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { mdx } from "@mdx-js/react";
import Wrapper from "../main/wrapper";
import {
  selectAbsJs,
  selectAbsMain,
  selectEntrypoint,
  selectEntrypointHtml,
} from "../utils";

const components = { wrapper: Wrapper };

type Options = {
  folder: string;
  filename: string;
  publicPath: string;
};

export class RenderPlugin {
  static defaultOptions: Options = {
    folder: "docs",
    filename: "index.md",
    publicPath: "/",
  };
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...RenderPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = RenderPlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;
    const sourceJs = selectAbsJs(
      this.options.publicPath,
      this.options.folder,
      this.options.filename
    );
    const nodeSourceJs =
      selectEntrypoint(this.options.folder, this.options.filename) + ".node.js";
    const destHtml = selectEntrypointHtml(
      this.options.publicPath,
      this.options.folder,
      this.options.filename
    );
    const mainUrl = selectAbsMain(
      this.options.publicPath,
      this.options.folder,
      this.options.filename
    );
    compiler.hooks.afterCompile.tap({ name: pluginName }, function (params) {
      if (!params.assets[nodeSourceJs]) return;
      const source = params.assets[nodeSourceJs].source();

      // TODO: I don't really understand this
      const Module: any = module.constructor;
      const m = new Module();
      m.mdx = mdx;
      m._compile(`const mdx=module.mdx;` + source, nodeSourceJs);
      if (!m.exports?.default) {
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
      params.deleteAsset(nodeSourceJs);

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
