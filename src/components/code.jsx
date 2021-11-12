import Mermaid from "./mermaid";
import "prismjs/themes/prism.css";

export default function Code({ className, children }) {
  const lang = className ? className.split("-")[1] : "text";
  switch (lang) {
    case "mermaidjs":
      return <Mermaid>{children}</Mermaid>;
    default:
      return <code>
        {children}
      </code>;
  }
}