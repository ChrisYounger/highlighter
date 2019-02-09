// Copyright (C) 2019 Chris Younger

/*

TODO
- add flowchart? 
- add better descriptions in pullout drawer
- add URL state

Helpful resources:
- How to write a lanuage: https://microsoft.github.io/monaco-editor/monarch.html#htmlembed
- API: https://microsoft.github.io/monaco-editor/api/index.html
- Playground: https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

 */
// The splunk webserver prepends all scripts with a call to i18n_register() for internationalisation. This fails for web-workers becuase they dont know about this function yet.
// The options are patch the function on-the-fly like so, or to edit the file on the filesystem (which makes upgrading monaco harder)
function i18n_register(){/*console.log('i18n_register shimmed');*/}
(function() { 
	var mode = "min"; // or dev
	require.config({ 
		paths: {
			'vs': (typeof standaloneMode !== "undefined") ? 'node_modules/monaco-editor/'+mode+'/vs' : '../app/highlighter/node_modules/monaco-editor/'+mode+'/vs', 
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

// This javascript supports running on GitHub published pages (standalone mode) or inside Splunk as an app.
if (typeof standaloneMode !== "undefined") {
	require(["vs/editor/editor.main","jquery","spl_language"], startHighlighter);
} else {
	require(["vs/editor/editor.main","jquery","app/highlighter/spl_language","splunkjs/mvc","splunkjs/mvc/simplexml","splunkjs/mvc/layoutview","splunkjs/mvc/simplexml/dashboardview"], startHighlighter);
}

function startHighlighter(undefined, $, spl_language, mvc, DashboardController, LayoutView, Dashboard) {

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

	var hashAtLoad = decodeURIComponent(document.location.hash.substr(1));

	// Register a new simple language for prettying up git diffs
	monaco.languages.register({id: 'spl'});
	monaco.languages.setMonarchTokensProvider('spl', spl_language.lang);
	// Go through the SPL tokens and determine what command is currently hovered
	function determineCurrentCommand(model, position) {
		var contents = model.getValue();
		var tokenized = monaco.editor.tokenize(contents ,'spl');
		var currentCommand = "search";
		for (var i = 0; i < tokenized.length; i++) {
			for (var j = 0; j < tokenized[i].length; j++) {
				if (tokenized[i][j].type === "command.spl") {
					var endPosition;
					if ((j + 1) < tokenized[i].length) {
						endPosition = tokenized[i][(j+1)].offset;
					} else {
						endPosition = model.getLineLength(i+1);
					}									//startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number
					currentCommand = model.getValueInRange(new monaco.Range( (i+1), (tokenized[i][j].offset+1), (i+1), (endPosition+1) ));
				}
				if ((i+1) >= position.lineNumber  && (tokenized[i][j].offset+1) >= position.column) {
					return currentCommand;
				}
			}
		}
		return currentCommand;
	}
	var tooltips_path = "/static/app/highlighter/spl.json";
	if (typeof standaloneMode !== "undefined") {
		tooltips_path = "spl.json";
	}
	// Async get the json file of the command descriptions etc - for the tooltips
	$.getJSON(tooltips_path, function( data ) {
		monaco.languages.registerHoverProvider('spl', {
			provideHover: function(model, position) {
				if (mode !== "spl") {
					return;
				}
				var currentCommand = determineCurrentCommand(model, position);
				return new Promise(function(resolve, reject) {
					resolve({
						range: new monaco.Range(position.lineNumber, 1, position.lineNumber, model.getLineLength(position.lineNumber)),
						contents: [
							{ value: '**' + currentCommand + '**' },
							{ value: (data[currentCommand].description || "") + "\n\n```plaintext\n\n\n" + data[currentCommand].syntax + '\n```\n' }
						]
					});
				});
			}
		});		
	});

	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			showToast('Copied to clipboard!');
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}
		document.body.removeChild(textArea);
	}
	function copyTextToClipboard(text) {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			showToast('Copied to clipboard!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}

	var $dashboardBody = $('.dashboard-body');
	var $hl_app_bar = $(".hl_app_bar");
	var mode = "spl";
	var theme = "vs-dark";
	var model = monaco.editor.createModel("\
\n\n`comment(\"Paste SPL query here...\")`\n\n\
| search earliest=0 latest=now NOT (search=\"*$search_input$*\" OR user=*dmin) \n\
| rest splunk_server=local count=2 aa=bb cc=\"dd\" /services/saved/searches \n\
    | append [| lookup bads.csv OUTPUT bad_ip  acceptable AS good_ip\n\
    | fields bad_ip \n\
    | format] \n\
`comment(\"This is a comment\")`\n\
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
	// Click handlers
	$hl_app_bar.on("click", "a", function(e){
		e.preventDefault();
		var $this = $(this);
		var val = $this.attr("data-val");
		if ($this.hasClass("hl_theme") || $this.hasClass("hl_mode")) {
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
			updateUrlHash();
		} else if (val === "autoformat") {
			reformatCode();
		} else if (val === "copy") {
			editor.setSelection(new monaco.Range(0, 0, 999999999, 999999999));
			editor.trigger('source','editor.action.clipboardCopyAction');
			showToast('Copied to clipboard!');
		} else if (val === "copyhtml") {
			var coloredPromise = monaco.editor.colorize(model.getValue(), mode);
			var css = $(".monaco-colors").text();
			var stylemap = {};
			css.replace(/\.(\S+)\s*{([^}]+)}/g, function(all, g1, g2){
				stylemap[g1] = $.trim(g2);
				return '';
			});
			var fgcolor = $(".monaco-editor").css('color');
			var bgcolor = $(".monaco-editor").css('background-color');
			coloredPromise.then(function (html) {
				var str = "<div style='font-family: Consolas, \"Courier New\", monospace; font-weight: normal; font-size: 14px; line-height: 19px; letter-spacing: 0px; color:"+fgcolor+"; background-color:"+bgcolor+";padding:10px;margin:5px;'>"
				str += html.replace(/<span class="([^"]+)">/g, function (all, g1) {
					var classes = g1.split(" ");
					var str = '<span style="';
					for (var k = 0; k < classes.length; k++) {
						if (stylemap.hasOwnProperty(classes[k])) {
							str += stylemap[classes[k]];
							if (! /;\s*$/.test(stylemap[classes[k]])) {
								str += ";";
							}
						} else {
							console.error("cant find style:" + classes[k])
						}
					}
					return str + '">';
				})
				str += "</div>";
				copyTextToClipboard(str);
			});
		} else {
			alert("coming soon");
		}
	});

	function showToast(message) {
		var t = $('.hl_toaster');
		t.find('span').text(message);
		t.addClass('hl_show');
		setTimeout(function(){
			t.removeClass('hl_show');
		},3000);
	}

	function reformatCode() {
		// TODO there is a bug here where \n's inside strings will be removed
		var contents = model.getValue().replace(/[\r\n]+/g,'');
		var tokenized = monaco.editor.tokenize(contents ,'spl');
		var currentIndentLevel = 0;
		var deleteNextWhiteSpace = true;
		var doNewLine = false;
		var breakOnNextToken = false;
		var prevTok = "";
		var result = "";
		for (var i = 0; i < tokenized.length; i++) {
			for (var j = 0; j < tokenized[i].length; j++) {
				doNewLine = false;
				// Skip whitespace after a pipe, becuase we add it ourselves to be exactly 1 character
				if ((deleteNextWhiteSpace || breakOnNextToken) && tokenized[i][j].type === "white.spl") {
					continue;
				}
				deleteNextWhiteSpace = false;
				if (breakOnNextToken) {
					doNewLine = true;
				}
				breakOnNextToken = false
				if (tokenized[i][j].type === "macro.comment.wrap.close.spl") {
					breakOnNextToken = true;
				}				
				// Force a newline before a pipe, except if we just started a new line from a left square bracket
				if (tokenized[i][j].type === "pipe.spl" || tokenized[i][j].type === "delimiter.square.spl.close") {
					//deleteNextWhiteSpace = true;
					doNewLine = true;
				}
				if (tokenized[i][j].type === "macro.comment.wrap.open.spl"){
					// add extra blank line before comments
					if (prevTok !== "macro.comment.wrap.close.spl") {
						result += "\n";
					}
					doNewLine = true;
				}
				// TODO there is a bug here in that this might be a few delimiters joined together. This would be super rare though
				// Force a new line before an opening left square bracket
				if (tokenized[i][j].type === "delimiter.square.spl"){
					if (contents.substr(tokenized[i][j].offset, 1) === "[") {
						currentIndentLevel++;
						tokenized[i][j].type = "delimiter.square.spl.open";
					} else {
						currentIndentLevel--;
						currentIndentLevel = Math.max(currentIndentLevel, 0);
						tokenized[i][j].type = "delimiter.square.spl.close";
					}
				}
				// Figure out how many characters the token is
				var endPosition;
				if ((j + 1) < tokenized[i].length) {
					endPosition = tokenized[i][(j+1)].offset;
				} else {
					endPosition = contents.length;
				}
				var tok = contents.substring(tokenized[i][j].offset, endPosition);
				if (doNewLine) {
					result += "\n" + "\t".repeat(currentIndentLevel);
					deleteNextWhiteSpace = true;
				}
				if (tokenized[i][j].type === "white.spl") {
					result += " ";
				} else {
					result += tok;
				}
				// always make sure there is exactly one space between pipe and command
				if (tokenized[i][j].type === "pipe.spl") {
					result += " ";
					deleteNextWhiteSpace = true;
				}

				if (tokenized[i][j].type !== "white.spl") {
					prevTok = tokenized[i][j].type;
				}
			}
		}
		// remove any leading blank lines or spaces
		result = result.replace(/^\s+/,"");

		// set value in a way that it can be undo'ed
		editor.executeEdits('beautifier', [{ identifier: 'delete', range: new monaco.Range(1, 1, 10000, 1), text: '', forceMoveMarkers: true }]);
		editor.executeEdits('beautifier', [{ identifier: 'insert', range: new monaco.Range(1, 1, 1, 1), text: result, forceMoveMarkers: true }]);
	}

	function updateUrlHash(){
		var hash = "#" + theme + "," + mode + "," + encodeURIComponent(model.getValue());
		if (history.replaceState) {
			// TODO we might not need to encodeURIComponent when using replaceState?
			history.replaceState(null, null, hash);
		} else {
			location.hash = hash;
		}		
	}

	// Set the "CTLR-|" hotkey to reformat 
	$(window).on('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (event.which) {
			case 220: // pipe character
				event.preventDefault();
				if (mode === "spl") {
					reformatCode();
				}
				break;
			}
		}
	});

	// On changes update URL hash
	editor.onDidChangeModelContent(updateUrlHash);

	// Load previous values from local storage, or load from URL hash
	console.log(hashAtLoad);
	if (hashAtLoad) {
		hashAtLoad.replace(/^([^,]+),([^,]+),([\s\S]*)$/, function(all, g1, g2, g3){
			$hl_app_bar.find("a.hl_theme[data-val=" + g1 + "]").click();
			$hl_app_bar.find("a.hl_mode[data-val=" + g2 + "]").click();
			model.setValue(g3);	
		})		
	} else {
		$hl_app_bar.find("a.hl_theme[data-val=" + (localStorage.getItem('hl_theme') || "vs-dark") + "]").click();
		$hl_app_bar.find("a.hl_mode[data-val=" + (localStorage.getItem('hl_mode') || "spl") + "]").click();
	}

	$(".hl_spinner").remove();
	$("body").css("overflow","");
	$dashboardBody.removeClass("hl_loading");	
	
	if (typeof standaloneMode === "undefined") {
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
	}
}
