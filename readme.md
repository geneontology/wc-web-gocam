

# GOCam Browser Components

This is repo for GOCam browser and its related components


| GH folder                                                                                     | Description    | Component Docs                                                                              | NPM package                                                                                    |
| --------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [wc-gocam-table](https://github.com/geneontology/wc-web-gocam/tree/master/wc-gocam-table)     | GO Cam Browser | [docs](https://github.com/geneontology/wc-web-gocam/blob/master/wc-gocam-table/readme.md)   | [@geneontology/wc-gocam-table](https://www.npmjs.com/package/@geneontology/wc-gocam-table)     |
| [wc-goc-paginator](https://github.com/geneontology/wc-web-gocam/tree/master/wc-goc-paginator) | GO Cam Browser | [docs](https://github.com/geneontology/wc-web-gocam/blob/master/wc-goc-paginator/readme.md) | [@geneontology/wc-goc-paginator](https://www.npmjs.com/package/@geneontology/wc-goc-paginator) |


## Examples

### - [basic example](https://github.com/geneontology/wc-web-gocam/blob/master/examples/basic-example-no-pagination.html) 
  This is the basic example of integrating the GOCam browser table'

### - [Table with Pagination](https://github.com/geneontology/wc-web-gocam/blob/master/examples/with-pagination.html) 
  The table can work well with a separate pagination component. 

### - [Table with Multiple Pagination](https://github.com/geneontology/wc-web-gocam/blob/master/examples/with-multiple-pagination.html) 
  In case some use case want to put pagination at the top and bottom of the table. This is an example of how to sync multiple pagination. 
  *Note: make sure pagination class in included in table attr pagination-class*



## For the Developers

To start building a new web component using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/ionic-team/stencil-component-starter.git wc-gocam-table
cd wc-gocam-table
git remote rm origin
```

and run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

Need help? Check out our docs [here](https://stenciljs.com/docs/my-first-component).


## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.


## Using this component

There are three strategies we recommend for using web components built with Stencil.

The first step for all three of these strategies is to [publish to NPM](https://docs.npmjs.com/getting-started/publishing-npm-packages).

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/wc-gocam-table@0.0.1/dist/wc-gocam-table.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install wc-gocam-table --save`
- Put a script tag similar to this `<script src='node_modules/wc-gocam-table/dist/wc-gocam-table.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install wc-gocam-table --save`
- Add an import to the npm packages `import wc-gocam-table;`
- Then you can use the element anywhere in your template, JSX, html etc
