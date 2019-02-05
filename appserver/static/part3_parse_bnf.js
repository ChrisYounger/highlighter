var fs = require('fs');
 

(async function() {
    var contents = fs.readFileSync('spl.bnf', 'utf8');
    var cfg = parseINIString(contents);
    var results = {};
    for (var stanza in cfg) {
        if (cfg.hasOwnProperty(stanza)) {
            // Start by looking at the search commands only and resolve from there
            if (/-command$/.test(stanza)) {
                if (cfg[stanza].usage.indexOf("public") > -1){ 
                    var command = stanza.replace(/-command/,'');
                    delete cfg[stanza].maintainer;
                    delete cfg[stanza]['appears-in'];

// [addcoltotals-command]
// appears-in = 3.0
// category = reporting
// comment1 = Compute the sums of all the fields, and put the sums in a summary event called "change_name".
// comment2 = Add a column total for two specific fields in a table.
// comment3 = Augment a chart with a total of the values present.
// description = Appends a new result to the end of the search result set.
//  The result contains the sum of each numeric field or you can specify which fields
//  to summarize. Results are displayed on the Statistics tab. If the labelfield argument
//  is specified, a column is added to the statistical results table with the name
//  specified.
// example1 = ... | addcoltotals labelfield=change_name label=ALL
// example2 = sourcetype=access_* | table userId bytes avgTime duration | addcoltotals bytes duration
// example3 = index=_internal source=*metrics.log group=pipeline |stats avg(cpu_seconds) by processor |addcoltotals labelfield=processor
// maintainer = steveyz
// related = stats
// shortdesc = Appends a new result to the end of the search result set.
// syntax = addcoltotals (labelfield=<field>)? (label=<string>)? <field-list>?
// tags = total add calculate sum
// usage = public

                    results[command] = cfg[stanza];
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