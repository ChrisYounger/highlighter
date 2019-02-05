var fs = require('fs');
 

(async function() {
    var contents = fs.readFileSync('spec_data.json', 'utf8');
    var cfg = JSON.parse(contents);
    var basics = [];
    var top="";
    var middle="";
    var bottom="";
    for (var i = 0; i < cfg.length; i++){
/*
    input data looks like this:
   {
      "command": "abstract",
      "renameAs": false,
      "usesEval": false,
      "usesAggs": false,
      "keywords": [],
      "args": [
         "maxterms",
         "maxlines"
      ]
   },
   
*/
        // Check if its a boring command
        if (! cfg[i].renameAs && ! cfg[i].usesEval && ! cfg[i].usesAggs && cfg[i].keywords.length === 0 && cfg[i].args.length === 0) {
            basics.push(cfg[i].command);
        } else {
            middle += "'" + cfg[i].command + "': { token: 'command', next: '@" + cfg[i].command + "Command' },\n";
            var temp1 = "";
            if (cfg[i].args.length) {
                top += cfg[i].command + "CommandArguments: ['" + cfg[i].args.join("','")+ "'],\n"
            }
            if (cfg[i].keywords.length) {
                top += cfg[i].command + "CommandKeywords: ['" + cfg[i].keywords.join("','")+ "'],\n"
            }            
			bottom += cfg[i].command + "Command: [\n"+
				"	{ include: '@commonPreamble' },\n"+
                (cfg[i].renameAs ? "	{ include: '@renameAs' },\n" : "")+
                // start of functions
                ((cfg[i].usesEval || cfg[i].usesAggs || cfg[i].usesConvert) ?
				"	[/(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\\d*\\s*\\()/, {\n"+
				"		cases: {\n"+
                (cfg[i].usesEval ?
				"			'@commonEvalFunctions': 'function',\n"
                :"")+
                (cfg[i].usesAggs ?
				"			'@commonAggFunctions': 'function',\n"
                :"")+
                (cfg[i].usesConvert ?
				"			'@commonConvertFunctions': 'function',\n"
                :"")+
				"			'@default': 'identifier.badfunction'\n"+
				"		}\n"+
                "	}],\n" : "") +
                // start of keywords
                ((cfg[i].args.length || cfg[i].keywords.length) ?
				"	[/\\w+/, {\n"+
				"		cases: {\n"+
                (cfg[i].args.length ?
				"			'@" + cfg[i].command + "CommandArguments': 'argument',\n" // e.g. earliest|latest
                :"")+
                (cfg[i].keywords.length ?
				"			'@" + cfg[i].command + "CommandKeywords': 'keyword',\n" // e.g. /NOT|OR|IN/
                :"")+
                //(cfg[i].renameAs ?
				//"			'AS': 'keyword',\n" // as
                //:"")+
				"			'@default': 'identifier.badarg'\n"+
				"		}\n"+
				"	}],\n" : "") +
				"	{ include: '@commonPostamble' },\n"+
			"],\n\n"            
        }
    }
    
    console.log(top);
    console.log("\n\n##################\n\n");
    console.log(middle);
    console.log("\n\n##################\n\n");
    console.log(bottom);
    console.log("\n\n##################\n\n");
    console.log(JSON.stringify(basics));
   
    
})();
