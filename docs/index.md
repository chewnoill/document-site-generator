# Document Site Generator

There are a lot of tools already to transform markdown content into static html, this by itself is not interesting.
With access to runtime javascript, we can use all of the browser tools and render some pretty neat things.

### Like rendering 3d Objects

```mdx
import Colosseum from './Colosseum.stl';

<Stl url={Colosseum}/>
```

import Colosseum from './Colosseum.stl';

<Stl url={Colosseum}/>

## What does this do?

A command line interface to read markdown text,
and produce the static assets necessary to render
the content in a browser.

```mermaidjs

graph LR

md[Your Markdown Text]
js[Runtime Javascript]
static[Static HTML content]

md --> js 
md --> static
```

This is mostly done by webpack and existing tooling.
Once the markdown has been separated into these two base components, we build a html file that gets sent to users.
This is a fairly basic template:

```html
<html>
<body>
<div id="root">
    {{{Static HTML content}}}
</div>
<script>
    const mdx = main.mdx;
    {{{Runtime Javascript}}}
    main.Entrypoint(MDXContent, "root")
</script>
</body>
</html>

```

This webpack config is shipped as a standalone CLI tool, distributed by npm.

```bash
npx document-site-builder -h
```

to run a local dev server to preview md files from your docs folder

```bash
npx document-site-builder dev docs
```

to build static content suitable for hosting on any static content deliver service.

```bash
npx document-site-builder build docs
```

