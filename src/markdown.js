const Markdown = require('markdown-it');
const isFunc = f => typeof f === 'function';

function noop(v){return v};

let $fenceDefault = noop;

let $vuePipe = noop;

let $md = null;

function coverDefault(md, options={}){
    $fenceDefault = md.renderer.rules.fence;
    function isVueBlock(token){
        const lang = token.info.replace(/\s+/g, '');
        if(options.vuePattern instanceof RegExp){
            return options.vuePattern.test(lang);
        }else if(isFunc(options.vuePattern)){
            return options.vuePattern(token)
        }else {
            return lang === options.vuePattern
        }
    }
    md.renderer.rules.fence = function (tokens, idx) {
        const token = tokens[idx];
        let target;
        if(isVueBlock(token)){
            const piped = $vuePipe(token.content);
            target = piped.template;
            isFunc(options.vueRender) && (target = options.vueRender(piped, token));
        }else {
            const codeRender = isFunc(options.codeRender) ? options.codeRender : $fenceDefault;
            target = codeRender.apply($md, arguments);
        }
        return target;
    };
}

function render(source, opts){
    if(!$md){
        const mdOptions = Object.assign({}, opts.mdOptions);
        $md = new Markdown(mdOptions);
        coverDefault($md, opts)
        isFunc(opts.customizeMd) && opts.customizeMd($md);
    }
    return $md.render(source);
}

function setVuePipe(v){$vuePipe = v}

module.exports = {render, setVuePipe}
