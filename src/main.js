import React from "react";
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
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

globalThis.mdx = mdx;
