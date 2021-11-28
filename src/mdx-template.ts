import * as Handlebars from "handlebars";
import { renderToString } from "mdx-hydra/build/render-to-string";
import * as emoji from "remark-emoji";
import rehypePrism from "@mapbox/rehype-prism";

const template = Handlebars.compile(`<html>
  <head>
  <script crossOrigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossOrigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  {{{mainScript}}}
  </head> 
<body>
<div id="root" style="display: flex;justify-content: center;">
  {{{staticMDX}}}
</div>
<script>
    const mdx = main.mdx;
    {{{script}}}
    ReactDOM.render(
      React.createElement(
        main.Provider, {},
        React.createElement(MDXContent, {})),
      document.getElementById("root")
    );
</script>
</body>
</html>`);

export function buildHTML({ staticMDX, script, mainScript }) {
  return template({
    staticMDX,
    script,
    mainScript,
  });
}

export function buildDynamicHTML(content) {
  const code = renderToString({
    source: content,
    Wrapper: ({ children }) => children,
  });

  return template({
    staticMDX: code.staticMDX,
    script: "const MDXContent = docLoader.default;",
    mainScript:
      '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
  });
}

export function buildStaticHTML(content) {
  const code = renderToString({
    source: content,
    Wrapper: ({ children }) => children,
    remarkPlugins: [emoji],
    rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
  });

  return template({
    staticMDX: code.staticMDX,
    script: code.code,
    mainScript:
      '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
  });
}
