const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');

function formatter(opts){
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

const OPTIONS_DEFAULT = {
    className: 'markdown-doc',
    mdOptions: {
        html: true,
        xhtmlOut: true,
        typographer: true,
        breaks: true,
        linkify: true
    },
    vuePattern: 'vue+',
    vueRender: null,
    codeRender: null,
    customizeMd: null,
    formatter
}

module.exports = function (root){
    const cfgPath = path.resolve(root, 'md-loader.cfg.js');
    let options = fs.existsSync(cfgPath) ? require(cfgPath) : {};
    options = Object.assign({}, options);
    options = deepmerge(OPTIONS_DEFAULT, options);
    options.className =
        Array.isArray(options.className)
            ? options.className
            : (options.className||'').split(',');
    return options;
}
