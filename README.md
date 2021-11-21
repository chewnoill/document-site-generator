
# Document Site Builder

An exercise in configuring webpack.

## Development Webpack configuration

[webpack.dev.config.js](./webpack.dev.config.js)

Document Site Developer build

`yarn dev`


static content
---

```
src/main.js --> /out/main.js
```

Requires, but does not include, React/ReactDom in the bundle.
see (webpack.main.config.js)[./webpack.main.config.js] for details.

CLI Client
---

Responsible for reading a local folder, running webpack dev server

mdx-template
