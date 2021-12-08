const markdown = require('./markdown');
const fileutils = require('./fileutils');
const md5 = require('md5');
const getOptions = require('./options');

let $options = null;

module.exports = function (source){
    const rootDir = fileutils.unifyPath(this.rootContext);
    const sourcePath = fileutils.unifyPath(this.resourcePath);
    const docName = fileutils.getFileName(sourcePath);
    const components = [];
    let cid = 0;
    markdown.setVuePipe(function (code){
        const name = `VueBlock${cid}`;
        const block = md5(`${sourcePath}${cid++}`);
        fileutils.pipeBlock(rootDir, block, code);
        const cfg = {name, code, template: `<${name}/>`}
        cfg.import = fileutils.getImport(name, block);
        components.push(cfg);
        return cfg;
    })
    const options = $options || ($options=getOptions(rootDir));
    const template = markdown.render(source, options);
    return options.formatter({docName, template, components, className: options.className});
}
