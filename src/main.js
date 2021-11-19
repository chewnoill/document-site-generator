import React from "react";
import styled from "@emotion/styled";
import { MDXProvider, mdx } from "@mdx-js/react";
import Code from "./components/code";

export { mdx };

const Wrapper = styled.article`
  margin: 0px 40px;
  h1 {
    font-size: 42px;
  }
`;

export const components = {
  code: Code,
  wrapper: Wrapper,
};

export function Provider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

globalThis.mdx = mdx;
