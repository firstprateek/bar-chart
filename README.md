# wepack-starter-template

A minimal starter project for building frontend applications, bundled using Webpack 5.

## Getting started

Install dependencies (incl. webpack). Note: This project only defines dev dependencies.

```bash
npm i
```

Entry point is src/index.js. Built content is stored under dist/. To build your project, run:
```bash
npm run build
```

To launch development server, run:
```bash
npm run dev
```

To deploy the built index.html page to the project's github page `https://<username>.github.io/<project-name>/`, first build your changes and then run:
```bash
npm run deploy
```

## Remove un-needed code

Clean up unused assets and code from:

- src/assets
- src/styles
- src/helloWorld.js

## Update description

- README.md
- package.json
- meta tags in template.html
