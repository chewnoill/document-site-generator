import * as Handlebars from 'handlebars';
import { renderToString } from 'mdx-hydra/build/render-to-string';

const template = Handlebars.compile(`<html>
  <head>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
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

// webpack development server, 
// builds this bundle and adds it 
// to the global scope
// under the name 'docLoader'. 
export function buildDynamicHTML() {
  return template({
    staticMDX: '',// not statically generated
    script: 'const MDXContent = docLoader.default;',
    mainScript: '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
  })
}

export function buildStaticHTML(content: string) {
  const code = renderToString({
    source: content,
    Wrapper: ({children})=>children,
  });

  return template({
    staticMDX: code.staticMDX,
    script: code.code,
    mainScript: '<script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>',
  })

}