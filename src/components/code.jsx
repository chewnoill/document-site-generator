import Mermaid from "./mermaid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight as styles } from "react-syntax-highlighter/dist/esm/styles/prism";

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
        >
          {children}
        </SyntaxHighlighter>
      );
  }
}
