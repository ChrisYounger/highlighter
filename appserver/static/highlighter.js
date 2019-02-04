// Copyright (C) 2019 Chris Younger

// The splunk webserver prepends all scripts with a call to i18n_register() for internationalisation. This fails for web-workers becuase they dont know about this function yet.
// The options are patch the function on-the-fly like so, or to edit the file on the filesystem (which makes upgrading monaco harder)
(function() { 
	var mode = "min"; // or dev
	require.config({ 
		paths: {
			'vs': '../app/highlighter/node_modules/monaco-editor/'+mode+'/vs', 
		}
	});
	var scripts = document.getElementsByTagName("script");
	var src = scripts[scripts.length-1].src; 
	window.MonacoEnvironment = {
		getWorkerUrl: function(workerId, label) {
			return "data:text/javascript;charset=utf-8," + encodeURIComponent(
				//"console.log('shimming i18n_register for worker'); "+
				"function i18n_register(){/*console.log('i18n_register shimmed');*/} "+
				"self.MonacoEnvironment = { baseUrl: '" + src.substring(0, src.lastIndexOf('/')) + "/node_modules/monaco-editor/"+mode+"/' }; "+
				"importScripts('" + src.substring(0, src.lastIndexOf('/')) + "/node_modules/monaco-editor/"+mode+"/vs/base/worker/workerMain.js');"
			);
		}
	};
})();

require([
	"splunkjs/mvc",
	"jquery",
	"moment",
	"splunkjs/mvc/simplexml",
	"splunkjs/mvc/layoutview",
	"splunkjs/mvc/simplexml/dashboardview",
	"vs/editor/editor.main",
], function(
	mvc,
	$,
	moment,
	DashboardController,
	LayoutView,
	Dashboard,
	wat,
) {

	var $dashboardBody = $('.dashboard-body');
	var model = monaco.editor.createModel("\n\
| search earliest=0 latest=now NOT (search=\"*$search_input$*\" OR admin=true OR splunk_server=*IDX01) \n\
| rest splunk_server=local count=2 aa=bb cc=\"dd\" /services/saved/searches \n\
    [| inputlookup bads.csv OUTPUT bad_ip  acceptable AS good_ip\n\
    | fields bad_ip \n\
    | format] \n\
| rename eai:acl.owner AS Author eai:acl.sharing AS Permissions eai:acl.app AS App search AS \"Saved Search\" \n\
| stats avg(field) AS avg perc95(dddgf) AS percentage eai:acl.app AS App search AS \"Saved Search\" \n\
| fields Author Permissions App \"Saved Search\"");
	var editor = monaco.editor.create($(".hl_container")[0], {
		automaticLayout: true,
		model: model,
	});

	$(".hl_app_bar").on("click", "a", function(e){
		e.preventDefault();
		var $this = $(this)
		var val = $this.attr("data-val");
		if ($this.hasClass("hl_theme")) {
			monaco.editor.setTheme(val);
			localStorage.setItem('hl_theme', val);
			$(".hl_theme").removeClass("hl_selected");
		} else {
			monaco.editor.setModelLanguage(model, val);
			localStorage.setItem('hl_mode', val);
			$(".hl_mode").removeClass("hl_selected");
		}
		$this.addClass("hl_selected");
	});

	// Load previous values from local storage
	$(".hl_app_bar a.hl_theme[data-val=" + (localStorage.getItem('hl_theme') || "vs-dark") + "]").click();
	$(".hl_app_bar a.hl_mode[data-val=" + (localStorage.getItem('hl_mode') || "spl") + "]").click();

	// Register a new simple language for prettying up git diffs
	monaco.languages.register({ id: 'spl' });
	monaco.languages.setMonarchTokensProvider('spl', {
		defaultToken: 'invalid',
		ignoreCase: true,
		brackets: [
			{ open: '[', close: ']', token: 'delimiter.square' },
			{ open: '(', close: ')', token: 'delimiter.parenthesis' }
		],
		// These are splunk commands that dont have special handling
		commoncommands: [
			'fields', 'format', 'eval', 'eventstats', 'streamstats', 'stats', 'timechart', 'chart', 'rex', 'convert'
		],
		



		//WHEN usesConvert=true === "convert":["auto", "dur2sec", "mstime", "memk", "none", "num", "rmunit", "rmcomma", "ctime", "mktime"]
		//WHEN usesAgg=true === sparkline c|count|dc|distinct_count|mean|avg|stdev|stdevp|var|varp|sum|sumsq|min|max|mode|median|earliest|first|last|latest|(perc|p|exactperc|upperperc|list|values|range|estdc|estdc_error|earliest_time|latest_time
		//note with usersAgg, the match should be (\S+)\d*(  (because of "perc95" etc)
		//WHEN usesEval=true === abs|case|ceiling|cidrmatch|coalesce|commands|exact|exp|false|floor|if|ifnull|isbool|isint|isnotnull|isnull|isnum|isstr|len|like|ln|log|lower|match|max|md5|min|mvappend|mvcount|mvdedup|mvindex|mvfilter|mvfind|mvjoin|mvrange|mvsort|mvzip|now|null|nullif|pi|pow|random|relative_time|replace|round|searchmatch|sha1|sha256|sha512|sigfig|spath|split|sqrt|strftime|strptime|substr|time|tostring|trim|ltrim|rtrim|true|typeof|upper|urldecode|validate|tonumber|acos|acosh|asin|asinh|atan|atan2|atanh|cos|cosh|hypot|sin|sinh|tan|tanh





		//operators: [
		//	'AS', 'OR', 'IN'
		//],
		//escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
   		//builtinFunctions: [
			// Aggregate
			//'AVG', 'CHECKSUM_AGG', 'COUNT', 'COUNT_BIG', 'GROUPING', 'GROUPING_ID', 'MAX', 'MIN', 'SUM', 'STDEV', 'STDEVP', 'VAR', 'VARP',
		//],
		//builtinVariables: [
			//'splunk_server'
			// Configu 0x44 ration
			//'@@DATEFIRST', '@@DBTS', '@@LANGID', '@@LANGUAGE', '@@LOCK_TIMEOUT', '@@MAX_CONNECTIONS', '@@MAX_PRECISION', '@@NESTLEVEL',
			//'@@OPTIONS', '@@REMSERVER', '@@SERVERNAME', '@@SERVICENAME', '@@SPID', '@@TEXTSIZE', '@@VERSION',
		//],
		tokenizer: {
			root: [
				{ include: '@commonPreamble' },
				[/\|/, {token: 'strong', next: '@aaCommand'}],
				//[/[()\[\]]/, '@brackets'],
				// Search command starts everything off 
				{ include: '@searchCommand' },
			],
			aaCommand: [
				{ include: '@whitespace' },
				[/[\w@#$]+/, {
					cases: {
						'search' : { token: 'keyword', next: '@searchCommand' },
						'rest' : { token: 'keyword', next: '@restCommand' },
						'inputlookup' : { token: 'keyword', next: '@inputlookupCommand' },
						'stats' : { token: 'keyword', next: '@statsCommand' },
						'rename' : { token: 'keyword', next: '@renameCommand' },
						//rest <rest-uri> (count=<int>)? (<splunk-server-opt>)? (<splunk-server-group-opt>)* (<timeout-opt>)? (<get-arg-name>=<get-arg-value>)*
						'@commoncommands': {token: 'keyword', next: '@commonCommand'},
						//'@operators': 'metatag', //operators
						//'@builtinVariables': 'type.identifier.js',  // predefined originally
						//'@builtinFunctions': 'predefined',
						'@default': 'identifier'
					}
				}],
				['', '', '@pop'],
			],
			searchCommand: [
				{ include: '@commonPreamble' },
				[/earliest|latest/, 'type.identifier.js'],
				[/[<>=]/, {token: 'operator', /*next: '@rightSideString'*/}],
				[/NOT|OR|IN/, 'metatag'],
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],			
			restCommand: [
				{ include: '@commonPreamble' },
				[/splunk_server|count/, 'type.identifier.js'],
				[/[<>=]/, {token: 'operator', /*next: '@rightSideString'*/}],
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],
			inputlookupCommand: [
				{ include: '@commonPreamble' },
				[/OUTPUTNEW|OUTPUT/, 'type.identifier.js'],
				//[/[<>=]/, {token: 'operator', /*next: '@rightSideString'*/}],
				{ include: '@renameAs' },
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],
			statsCommand: [
				{ include: '@commonPreamble' },
				[/(?:perc95|avg|eval)(?=\s*\()/, 'keyword.flow'],
				//[/[<>=]/, {token: 'operator', /*next: '@rightSideString'*/}],
				{ include: '@renameAs' },
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],
			renameCommand: [
				{ include: '@commonPreamble' },
				{ include: '@renameAs' },
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],						
			commonCommand: [
				{ include: '@commonPreamble' },
				[/[^\|\s<>=!]+/, 'identifier'],
				['', '', '@pop'],
			],
			/*rightSideString: [
				//{ include: '@strings' },
				[/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
				[/[^\s\)]+/, {token: 'string', next: '@pop'}]
			],
			string: [
				[/[^\\"]+/,  'string'],
				[/@escapes/, 'string.escape'],
				[/\\./,      'string.escape.invalid'],
				[/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
			],			*/
			commonPreamble: [
				{ include: '@whitespace' },
				{ include: '@strings' },
				{ include: '@numbers' },			
				[/[()\[\]]/, '@brackets'],
			],
			renameAs: [
				// This regex allows matching the right side of "as". I wonder if it becomes a bit much though
				[/(as)(\s+)((?:\"[^\"]*\"|\'[^\'']*\'|[\w]+))/, ['metatag','white','string']],
				// Simplier version
				//[/(as)(\s+)/, ['metatag','white']],
			],
			whitespace: [
				[/\s+/, 'white'],
			],
			numbers: [
				[/0[xX][0-9a-fA-F]*/, 'number'],
				[/[$][+-]*\d*(\.\d*)?/, 'number'],
				[/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
			],
			// Recognize strings, including those broken across lines with \ (but not without)
			strings: [
				[/'$/, 'string.escape', '@popall'],
				[/'/, 'string.escape', '@stringBody'],
				[/"$/, 'string.escape', '@popall'],
				[/"/, 'string.escape', '@dblStringBody']
			],
			stringBody: [
				[/[^\\']+$/, 'string', '@popall'],
				[/[^\\']+/, 'string'],
				[/\\./, 'string'],
				[/'/, 'string.escape', '@popall'],
				[/\\$/, 'string']
			],
			dblStringBody: [
				[/[^\\"]+$/, 'string', '@popall'],
				[/[^\\"]+/, 'string'],
				[/\\./, 'string'],
				[/"/, 'string.escape', '@popall'],
				[/\\$/, 'string']
			]			
		}
	});

	$(".hl_spinner").remove();
	$dashboardBody.removeClass("hl_loading");	
	
	// Setup the splunk components properly
	$('header').remove();
	new LayoutView({ "hideAppBar": true, "hideChrome": false, "hideFooter": false, "hideSplunkBar": false, layout: "fixed" })
		.render()
		.getContainerElement()
		.appendChild($dashboardBody[0]);

	new Dashboard({
		id: 'dashboard',
		el: $dashboardBody,
		showTitle: true,
		editable: true
	}, { tokens: false }).render();

	DashboardController.ready();
	
	$("body").css("overflow","");

});
