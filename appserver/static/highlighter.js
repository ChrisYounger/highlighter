// Copyright (C) 2019 Chris Younger

/*

TODO
- add tooltips
- add flowchart 
- try add auto-indenting
- fix right click menu

 */
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
	"app/highlighter/spl_language"
], function(
	mvc,
	$,
	moment,
	DashboardController,
	LayoutView,
	Dashboard,
	wat,
	spl_language
) {

	monaco.editor.defineTheme('vs-dark-spl', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'function', foreground: 'c586c0' }, // pink
			{ token: 'command', foreground: '569cd6', fontStyle: 'bold' }, // blue - make bold?
			{ token: 'pipe', foreground: 'd4d4d4', fontStyle: 'bold' }, // white bold
			{ token: 'argument', foreground: '3dc9b0' }, // teal
			{ token: 'keyword', foreground: 'dd6a6f' }, // normal  AND|OR|WHERE etc
			{ token: 'operator', foreground: 'd4d4d4' }, // red
			{ token: 'string', foreground: 'ce9178' }, // orange
			{ token: 'number', foreground: 'b5cea8' }, // green 
			{ token: 'delimiter', foreground: 'DCDCDC' }, // gray 
			{ token: 'invalid', foreground: 'FF0000' }, // red 
			{ token: 'macro.comment', foreground: '608B4E' }, // green
			{ token: 'macro.comment.wrap', foreground: '808080' }, // grey
			{ token: 'macro.args', foreground: '74B0DF' }, // macro args
			{ token: 'macro.function', foreground: '9CDCFE' }, // macro name
		]	
	});
	monaco.editor.defineTheme('vs-spl', {
		base: 'vs',
		inherit: true,
		rules: [
			{ token: 'function', foreground: 'CF00CF' }, // pink
			{ token: 'command', foreground: '2662FC' }, // blue - make bold?
			{ token: 'pipe', foreground: '000000', fontStyle: 'bold' }, // white bold
			{ token: 'argument', foreground: '02ac76' }, // 
			{ token: 'keyword', foreground: 'ff6928' }, // orange  AND|OR|WHERE etc
			{ token: 'operator', foreground: '808080' }, // 
			{ token: 'string', foreground: 'A31515' }, // teal
			{ token: 'number', foreground: '09885A' }, // green 
			{ token: 'delimiter', foreground: '383838' }, // gray 
			{ token: 'invalid', foreground: 'FF0000' }, // red 
			{ token: 'macro.comment', foreground: '008000' }, // green
			{ token: 'macro.comment.wrap', foreground: '808080' }, // grey
			{ token: 'macro.args', foreground: 'AF00DB' }, // macro args
			{ token: 'macro.function', foreground: 'FF00FF' }, // macro name
		]	
	});

	// Register a new simple language for prettying up git diffs
	monaco.languages.register({id: 'spl'});
	monaco.languages.setMonarchTokensProvider('spl', spl_language.lang);

	var $dashboardBody = $('.dashboard-body');
	var $hl_app_bar = $(".hl_app_bar");
	var mode = "spl";
	var theme = "vs-dark";
	var model = monaco.editor.createModel("\
| search earliest=0 latest=now NOT (search=\"*$search_input$*\" OR admin=true OR splunk_server=*IDX01) \n\
| rest splunk_server=local count=2 aa=bb cc=\"dd\" /services/saved/searches \n\
    [| lookup bads.csv OUTPUT bad_ip  acceptable AS good_ip\n\
    | fields bad_ip \n\
    | format] \n\
| rename eai:acl.owner AS Author eai:acl.sharing AS Permissions eai:acl.app AS App search AS \"Saved Search\" \n\
| eval md5 = md5(filename) \n\
| stats avg(field) AS avg perc95(dddgf) AS percentage eai:acl.app AS App search AS \"Saved Search\" \n\
| fields Author Permissions App \"Saved Search\"\n\
| eval datamodel2=case(match(search, \"src_dest_tstats\"), mvappend(\"Network_Traffic\"), match(search, \"(access_tracker|inactive_account_usage)\")");
	var editor = monaco.editor.create($(".hl_container")[0], {
		automaticLayout: true,
		model: model,
		scrollBeyondLastLine: false,
		wordWrap: "on"
	});

	$hl_app_bar.on("click", "a", function(e){
		e.preventDefault();
		var $this = $(this)
		var val = $this.attr("data-val");
		if ($this.hasClass("hl_theme")) {
			theme = val;
			localStorage.setItem('hl_theme', val);
			$(".hl_theme").removeClass("hl_selected");
		} else {
			mode = val;
			localStorage.setItem('hl_mode', val);
			$(".hl_mode").removeClass("hl_selected");
		}
		// Need to use our custom styles if in spl editor mode
		if (mode === "spl") { 
			monaco.editor.setTheme(theme + "-spl");
		} else {
			monaco.editor.setTheme(theme);
		}
		$dashboardBody.removeClass("hl_vs hl_vs-dark").addClass("hl_" + theme);
		monaco.editor.setModelLanguage(model, mode);
		$this.addClass("hl_selected");
	});

	// Load previous values from local storage
	$hl_app_bar.find("a.hl_theme[data-val=" + (localStorage.getItem('hl_theme') || "vs-dark") + "]").click();
	$hl_app_bar.find("a.hl_mode[data-val=" + (localStorage.getItem('hl_mode') || "spl") + "]").click();

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
