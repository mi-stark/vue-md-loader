# [@mistark/vue-md-loader](https://github.com/mi-stark/vue-md-loader)
一个将 markdown 文档编译成 Vue 组件的 Webpack 加载器.  
语言: [English](https://github.com/mi-stark/vue-md-loader) | [简体中文](./readme_zh-CN.md)

## 开始

```console
npm install @mistark/vue-md-loader --save-dev
```

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
禁用eslint对后缀为".md"文件的校验

**.eslintignore**

```console
**/*.md
```

## 配置

在工程根目录下的 `md-loader.cfg.js` 文件添加自定义配置

|                属性名                |       类型        |    默认值     | 说明                                                     |
|:---------------------------------:|:-----------------:|:--------------:|:-------------------------------------------------------|
|           **className**           | `string   array`  | `markdown-doc` | 组件根元素的class名称.                                         |
|   **[`mdOptions`](#mdOptions)**   |     `object`      |                | [markdown-it](https://markdown-it.docschina.org)的初始化参数 |
|         **`vuePattern`**          | `function regexp` |     `vue+`     | vue代码块的的匹配器                                            |
|   **[`vueRender`](#vueRender)**   |    `function`     |     `null`     | vue代码块的的渲染器.                                           |
|  **[`codeRender`](#codeRender)**  |    `function`     |     `null`     | 普通代码块的渲染器.                                             |
| **[`customizeMd`](#customizeMd)** |    `function`     |     `null`     | 自定义markdown-it实例.                                      |
|   **[`formatter`](#formatter)**   |    `function`     |                | 根据解析后的参数格式化vue组件代码.                                    |

### `mdOptions`

类型: `object`  
默认值:
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
类型: `function`  
默认值: `null`  

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
类型: `function`  
默认值: `null`  

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
类型: `function`  
默认值: `null`  

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
类型: `function`  
默认值:

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


## 许可

[MIT](./LICENSE)
