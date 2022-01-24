import React from "react";
import Mermaid from "./mermaid";
import { CopyBlock, atomOneLight } from "react-code-blocks";

export default function Code({ className, children }) {
  const lang = className ? className.split("-")[1] : "text";
  switch (lang) {
    case "mermaidjs":
      return <Mermaid>{children}</Mermaid>;
    default:
      return (
        <CopyBlock
          language={lang}
          text={children.trim()}
          showLineNumbers={false}
          theme={{
            ...atomOneLight,
            backgroundColor:"#f5f5f5" ,

          }}
          wrapLines={true}
          codeBlock
        />
      );
  }
}
