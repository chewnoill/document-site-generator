import * as Handlebars from 'handlebars';
import { renderToString } from 'mdx-hydra/build/render-to-string';
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

const key = 'custom'
const cache = createCache({ key })
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)


const template = Handlebars.compile(`
<html>
  <head>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <script src="https://quizzical-poincare-bb2498.netlify.app/main.js"></script>
  </head> 
<body>
<div id="root">
{{{staticMDX}}}
</div>
<script>
    const mdx = main.mdx;
    {{{script}}}
    console.log({provider: main.Provider});
    ReactDOM.render(
      React.createElement(
        main.Provider, {},
        React.createElement(MDXContent, {})),
      document.getElementById("root")
    );
</script>
</body>
</html>`);

// webpack builds this bundle and adds it to the global
// under the name docLoader.
export function buildDynamicHTML() {
  return template({
    staticMDX: '',// not statically generated
    script: 'const MDXContent = docLoader.default;',
  })
}

export function buildStaticHTML(content: string) {
  const code = renderToString({
    source: content,
    Wrapper: ({ children }) => children
  });

  return template({
    staticMDX: code.staticMDX,
    script: code.code,
  })

}