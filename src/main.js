import React from "react";
import styled from "@emotion/styled";
import { MDXProvider, mdx as renderer } from "@mdx-js/react";

export const mdx = renderer;

const components = {
  h1: styled.h1`
    color: tomato;
  `,
};

const styles = `
  h2 {
    color: tomato;
  }
`;

export function Provider({ children }) {
  return (
    <>
      <style>{styles}</style>
      <MDXProvider components={components}>{children}</MDXProvider>
    </>
  );
}
