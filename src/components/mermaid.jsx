import * as React from "react";
import mermaid from "mermaid";
import styled from "@emotion/styled";

const Pre = styled.pre`
  background: rgba(255, 255, 255, 0.5);
`;

mermaid.initialize({
  theme: "default",
  startOnLoad: false,
});

export default React.memo(({ children }) => {
  const [content, setContent] = React.useState(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);

    try {
      mermaid.mermaidAPI.parse(children);
      mermaid.mermaidAPI.render("graphDiv", children, setContent);
    } catch (e) {
      setError(e.str || "Something went wrong");
      //cleanup that mermaid doesn't do correctly
      const oldGraph = document.getElementById("dgraphDiv");
      oldGraph && oldGraph.remove();
    }
  }, [children]);

  return (
    <Pre>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {error && <pre>{children}</pre>}
    </Pre>
  );
});
