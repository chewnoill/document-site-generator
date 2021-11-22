# Document Site Builder

## Getting Started

Starting a local development server,
to show a preview of your content in 
a browser window.

All mdx files in the designated folder
will be included as entrypoints.


```cmd
// with npx
npx document-site-builder dev <foldername>
```


```bash
$ document-site-builder -h
USAGE
  $ document-site-builder [COMMAND]

COMMANDS
  build  Builds the contents of [FOLDER]
  dev    Runs a webpack development service to see changes you make
         locally
  help   display help for document-site-builder
```

Running a dev server

```bash
$ document-site-builder dev -h
Runs a webpack development service to see changes you make locally

USAGE
  $ document-site-builder dev FOLDER

ARGUMENTS
  FOLDER  [default: docs] folder to watch

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ document-site-builder dev docs
```

Building static content

```bash
$ document-site-builder build -h
USAGE
  $ document-site-builder build FOLDER

ARGUMENTS
  FOLDER  [default: docs] folder to watch

OPTIONS
  -h, --help                        show CLI help
  -o, --outputFolder=output folder  [default: out]

EXAMPLE
  $ document-site-builder build docs
```
