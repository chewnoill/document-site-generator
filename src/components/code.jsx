import Mermaid from "./mermaid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism as styles } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Code({ className, children }) {
  const lang = className ? className.split("-")[1] : "text";
  switch (lang) {
    case "mermaidjs":
      return <Mermaid>{children}</Mermaid>;
    default:
      return (
        <SyntaxHighlighter
          useInlineStyles={true}
          language={lang}
          style={styles}
          customStyle={{ background: "#F5F5F5" }}
        >
          {children}
        </SyntaxHighlighter>
      );
  }
}
