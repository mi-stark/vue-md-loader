const path = require('path');
const fs = require('fs');

const CACHE_DIR = 'node_modules/.cache/vue-md-loader';
const IMPORT_BASE = '.cache/vue-md-loader';

function cacheRoot(root){
    const tempDir = path.resolve(root, CACHE_DIR);
    if(!fs.existsSync(tempDir)){
        mkdirIfAbsent(root, CACHE_DIR);
    }
    return tempDir;
}

let mid = 0;
function getFileName(str) {
    if(/.*[/\\](.+)\.md$/.test(str)){
        return path.parse(str).name;
    }else {
        return `markdown-doc${mid++}`;
    }
}

function mkdirIfAbsent(root, dir){
    (dir || '').split(/\\|\//).forEach(sub => {
        const filepath = path.resolve(root, sub);
        if (!fs.existsSync(filepath)){
            fs.mkdirSync(filepath);
        }
        root = filepath;
    });
}

function pipeBlock(root, name, data){
    fs.writeFileSync(`${cacheRoot(root)}/${name}.vue`, data);
}

function getImport(name, block){
    return `import ${name} from '${IMPORT_BASE}/${block}';`
}

const unifyPath = str => (str || '').replace(/\\/g, '/');

module.exports = {
    getFileName,
    pipeBlock,
    getImport,
    unifyPath
};
