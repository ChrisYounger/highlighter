var fs = require('fs');
 

(async function() {
    var contents = fs.readFileSync('spl.bnf', 'utf8');
    var cfg = parseINIString(contents);
    var results = [];
    for (var stanza in cfg) {
        if (cfg.hasOwnProperty(stanza)) {
            // Start by looking at the search commands only and resolve from there
            if (/-command$/.test(stanza)) {
                if (cfg[stanza].usage.indexOf("public") > -1){ 
                    var command = stanza.replace(/-command/,'');
                    // delete the command from the line, then start replacing tokens. go three levels deep
                    var args = cfg[stanza].syntax.replace(/^\s*\S+\s*/,'').replace(/<([^>]+)>/g, function(all,m1){
                        if (cfg.hasOwnProperty(m1)) {
                            // prevent recursion
                            return cfg[m1].syntax.replace(new RegExp(m1, 'i'), '_RECURSION_');
                        }
                        return "NOTFOUND(" + m1+ ")";
                    }).replace(/<([^>]+)>/g, function(all,m1){
                        if (cfg.hasOwnProperty(m1)) {
                            return cfg[m1].syntax.replace(new RegExp(m1, 'i'), '_RECURSION_');;
                        }
                        return "NOTFOUND(" + m1+ ")";
                    }).replace(/<([^>]+)>/g, function(all,m1){
                        if (cfg.hasOwnProperty(m1)) {
                            return cfg[m1].syntax.replace(new RegExp(m1, 'i'), '_RECURSION_');;
                        }
                        return "NOTFOUND(" + m1+ ")";
                    })

                    var obj = {
                        command: command, 
                        orig: args,
                        remaining: args,
                        renameAs: false, 
                        usesEval: false,
                        usesAggs: false,
                        keywords: [],
                        args:[],
                    };
                    //(as NOTFOUND(field:newfield))? 
                    obj.remaining = obj.remaining.replace(/\(?as NOTFOUND\([^\)]+\)\)?\??/ig,function(){
                        obj.renameAs = true;
                        return '';
                    });  
                    // (labelfield=NOTFOUND(field))?
                    // (labelfield=NOTFOUND(int))?
                    // (labelfield=NOTFOUND(string))?
                    // (labelfield=NOTFOUND(bool))?
                    obj.remaining = obj.remaining.replace(/\((\w+)=NOTFOUND\([^\(\s\|\)]+\)(\(s\|m\|h\|d\))?[\?\)]*/gi, function(all, m1){
                        obj.args.push(m1);
                        return '';
                    });
                    //classfield=NOTFOUND(field)
                    obj.remaining = obj.remaining.replace(/(\w+)=NOTFOUND\([^\(\s\|\)]+\)/gi, function(all, m1){
                        obj.args.push(m1);
                        return '';
                    });
                    
                    //method=(histogram|zscore|iqr)?
                    obj.remaining = obj.remaining.replace(/(\w+)=\(\S+\)\??/gi, function(all, m1){
                        obj.args.push(m1);
                        return '';
                    });
                    //[retries=N]
                    obj.remaining = obj.remaining.replace(/\[(\w+)=[^\]]+\]/gi, function(all, m1){
                        obj.args.push(m1);
                        return '';
                    });                       
                    obj.remaining = obj.remaining.replace(/\((\w+)=NOTFOUND[^\s\|]+/gi, function(all, m1){
                        obj.args.push(m1);
                        return '';
                    });
                    //"((maxrows|maxcols)=NOTFOUND(int)|(mincolcover|minrowcover)=NOTFOUND(num)|| )* NOTFOUND(field) NOTFOUND(field)",
                    obj.remaining = obj.remaining.replace(/\(([^\)]+?)\)=/gi, function(all, m1){
                        obj.args.push.apply(obj.args, m1.split("\|"));
                        return '';
                    });                         
                    // TODO
                    // stats functions, and convert functions like these:
                    //" (auto(\"(\" (NOTFOUND(wc-field))? \")\")?|dur2sec\"(\"NOTFOUND(wc-field)?\")\"|mstime\"(\" NOTFOUND(wc-field)? \")\"|memk\"(\" NOTFOUND(wc-field)? \")\"|none\"(\" NOTFOUND(wc-field)? \")\"|num\"(\"NOTFOUND(wc-field)? \")\"|rmunit\"(\" NOTFOUND(wc-field)? \")\"|rmcomma\"(\"NOTFOUND(wc-field)? \")\"|ctime\"(\"NOTFOUND(wc-field)?\")\"|mktime\"(\"NOTFOUND(wc-field)?\")\" )+",
                    //"( minspan=(<int>(<timescale>)?)?)|span=(<int>(<timescale>)?|(<num>)?log(<num>)?)|(start|end)=NOTFOUND(num)|aligntime=(earliest|latest|NOTFOUND(time-specifier)) )* NOTFOUND(field) "
                    // Special keywords: By where over
                    // special eval/fieldformat/where/also used in stats functions funcitons abs|case|ceiling|cidrmatch|coalesce|commands|exact|exp|false|floor|if|ifnull|isbool|isint|isnotnull|isnull|isnum|isstr|len|like|ln|log|lower|match|max|md5|min|mvappend|mvcount|mvdedup|mvindex|mvfilter|mvfind|mvjoin|mvrange|mvsort|mvzip|now|null|nullif|pi|pow|random|relative_time|replace|round|searchmatch|sha1|sha256|sha512|sigfig|spath|split|sqrt|strftime|strptime|substr|time|tostring|trim|ltrim|rtrim|true|typeof|upper|urldecode|validate|tonumber|acos|acosh|asin|asinh|atan|atan2|atanh|cos|cosh|hypot|sin|sinh|tan|tanh
                    results.push(obj);
                    //AS NOTFOUND(field))?
                    //console.log(command, args);

                }
            }
            
        }
    }
    console.log(JSON.stringify(results,null,3));
})();

function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        paramWrap: /^\s(.*?)\s*$/,
        param: /^([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    var lastsection = null;
    var lastparam = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(regex.paramWrap.test(line)){
            var match = line.match(regex.paramWrap);
            if (lastsection !== null && lastparam !== null) {
                value[lastsection][lastparam] += "\n" + match[1]
            } else {
                console.log("very unexpected line:", line);
            }

        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
                lastsection = section;
                lastparam = match[1];
            }else{
                value[match[1]] = match[2];
                lastsection = null;
                lastparam = match[1];
            }
        }else if(line.length == 0 && section){
            section = null;
        } else {
            //console.log("unexpected line: ", line);
            if (lastsection !== null && lastparam !== null) {
                value[lastsection][lastparam] += "\n" + line
            } else {
                console.log("very unexpected line:", line);
            }            
        };
    });
    return value;
}