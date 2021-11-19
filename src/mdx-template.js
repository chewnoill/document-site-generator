const Handlebars = require("handlebars");
const { renderToString } = require("mdx-hydra/build/render-to-string");
const emoji = require("remark-emoji");
const rehypePrism = require("@mapbox/rehype-prism");

const template = Handlebars.compile(`<html>
  <head>
  <script crossOrigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossOrigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  {{{mainScript}}}
  </head> 
<body>
<div id="root">
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

exports.buildHTML = function buildHTML({ staticMDX, script, mainScript }) {
  return template({
    staticMDX,
    script,
    mainScript,
  });
};

exports.buildDynamicHTML = function buildDynamicHTML(content) {
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
};

exports.buildStaticHTML = function buildStaticHTML(content) {
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
};
