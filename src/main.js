import React from "react";
import { MDXProvider, mdx } from "@mdx-js/react";
import Code from "./components/code";
import Wrapper from "./wrapper";
import Box from "./components/box";

export { mdx };

export const components = {
  code: Code,
  wrapper: Wrapper,
  Box,
};

export function Provider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

globalThis.mdx = mdx;
