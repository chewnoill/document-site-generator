import * as ReactDOM from "react-dom";
import * as React from "react";
import { MDXProvider, mdx } from "@mdx-js/react";
import Code from "./components/code";
import Wrapper from "./wrapper";
import Box from "./components/box";
import Stl from "./components/stl";

export { mdx };

export const components = {
  code: Code,
  wrapper: Wrapper,
  Box,
  Stl,
};

export function Provider({ children }) {
  return React.createElement(MDXProvider, { components }, children);
}

globalThis.mdx = mdx;

export function Entrypoint(content, rootId) {
  ReactDOM.hydrate(
    React.createElement(Provider, {
      children: React.createElement(content, {}),
    }),
    document.getElementById(rootId)
  );
}
