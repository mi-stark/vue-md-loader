# [@mistark/vue-md-loader](https://github.com/mi-stark/vue-md-loader)
A Webpack loader that compiles markdown document into Vue component.  
Languages: [English](https://github.com/mi-stark/vue-md-loader) | [简体中文](./readme_zh-CN.md)

## Installation

Install via npm:
```console
npm install @mistark/vue-md-loader --save-dev
```

Usage with webpack.config  

**webpack.config.js**

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.md$/i,
                loader: "vue-loader!@mistark/vue-md-loader"
            },
        ],
    },
};
```

Disable eslint's verification of markdown documents

**.eslintignore**

```console
**/*.md
```

## Usage
You can require markdown file like this:

```vue
<template>
  <div>
    <div>The content of the document is as follows：</div>
    <markdown-doc/>
  </div>
</template>
<script>
import MarkdownDoc from './markdown-doc.md'
export default {
  components: {MarkdownDoc}
}
</script>
```

## Config

You can define personalized configuration in `md-loader.cfg.js`

|               Name                |       type        |    default     | Description                                                                                  |
|:---------------------------------:|:-----------------:|:--------------:|:---------------------------------------------------------------------------------------------|
|           **className**           | `string   array`  | `markdown-doc` | className for root Element.                                                                  |
|   **[`mdOptions`](#mdOptions)**   |     `object`      |                | Initialization parameters of [markdown-it](https://markdown-it.docschina.org "markdown-it"). |
|         **`vuePattern`**          | `function regexp` |     `vue+`     | Match code blocks that need to be compiled into vue components                               |
|   **[`vueRender`](#vueRender)**   |    `function`     |     `null`     | Vue code block rendering function.                                                           |
|  **[`codeRender`](#codeRender)**  |    `function`     |     `null`     | Code block rendering function.                                                               |
| **[`customizeMd`](#customizeMd)** |    `function`     |     `null`     | customize markdown-it instance.                                                              |
|   **[`formatter`](#formatter)**   |    `function`     |                | Vue component source formatter.                                                              |

### `mdOptions`

type: `object`  
default:
```js
{
    html: true,
    xhtmlOut: true,
    typographer: true,
    breaks: true,
    linkify: true
}
```

### `vueRender`
type: `function`  
default: `null`

**md-loader.cfg.js**

```js
module.exports = {
    vuePattern: /^\s*vue\s*$/,
    vueRender: function(opts){
        // console.log('>>>>source code')
        // console.log(opts.code)
        return `<div>this is a vue live demo</div><div>${opts.templete}</div>`
    }
};
```

### `codeRender`
type: `function`  
default: `null`

**md-loader.cfg.js**

```js
module.exports = {
    codeRender: function(tokens, idx){
        const token = tokens[idx];
        const codeHtml = this.utils.escapeHtml(token.content);
        return `<div>this is a code block</div><pre><code class="${token.info}">${codeHtml}</code></pre>`
    }
};
```

### `customizeMd`
type: `function`  
default: `null`

**md-loader.cfg.js**

```js
const container = require('markdown-it-container');
module.exports = {
    customizeMd: function(md){
        md.use(container, 'tip');
        md.use(container, 'warning')
    }
};
```

### `formatter`
type: `function`  
default:

```js
function(opts){
    const imports = opts.components.map((cfg)=> cfg.import).join('\n');
    const declares = opts.components.map((cfg)=> cfg.name).join();
    const className = opts.className.map(s => `'${s}'`).join();
    return `<template>
  <section :class="className">${opts.template}</section>
</template>

<script>
${imports}
export default {
  name: '${opts.docName}',
  components: {${declares}},
  data(){
    return {
      className: [${className}]
    }
  }
}
</script>`
}
```


## License

[MIT](./LICENSE)
