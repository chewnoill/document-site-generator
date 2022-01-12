import * as Handlebars from "handlebars";

const template = Handlebars.compile(`<html>
<head>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  {{{mainScript}}}
</head> 
<body>
<div id="root" style="display: flex;justify-content: center;">{{{staticMDX}}}</div>
<script>
    const mdx = main.mdx;
    {{{script}}}
    main.Entrypoint(MDXContent, "root")
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

export function buildDynamicHTML(file) {
  return template({
    staticMDX: "code.staticMDX",
    script: "const MDXContent = docLoader.default;",
    mainScript:
      '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
  });
}

export function buildStaticHTML(filepath) {
  return template({
    staticMDX: "===placeholder===",
    script: "const MDXContent=docLoader.default;",
    mainScript: '<script src="/main.js"></script>',
  });
}
