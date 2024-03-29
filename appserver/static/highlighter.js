// Copyright (C) 2019 Chris Younger

/*

TODO
- add flowchart? 

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

	// Inject all the HTML contents
	$(".dashboard-body").html(
	"<div class='hl_app_bar'>"+
		"<span class='hl_title'>Theme:</span>"+
		"<a href='#' class='hl_theme hl_link' data-val='vs'>Light</a> | "+
		"<a href='#' class='hl_theme hl_link' data-val='vs-dark'>Dark</a> <!--| "+
		"<a href='#' class='hl_theme' data-val='hc-black'>High Contrast</a>-->"+

		"<span class='hl_title hl_title_leftpad'>Highlighting mode:</span>"+
		"<a href='#' class='hl_mode hl_link' data-val='spl'>Search SPL</a> | "+
		"<a href='#' class='hl_mode hl_link' data-val='ini'>Config file</a> | "+
		"<a href='#' class='hl_mode hl_link' data-val='html'>Dashboard (HTML)</a> | "+
		"<a href='#' class='hl_mode hl_link' data-val='javascript'>JS</a> | "+
		"<a href='#' class='hl_mode hl_link' data-val='css'>CSS</a>"+

		"<span class='hl_title hl_title_leftpad'>Actions:</span>"+
		"<a href='#' class='hl_action hl_link' data-val='copy'>Copy as rich text</a> | "+
		"<a href='#' class='hl_action hl_link' data-val='copyhtml'>Copy as HTML</a> | "+
		"<a href='#' class='hl_action hl_link' data-val='autoformat'>Autoformat (CTRL-|)</a> |"+
		"<a href='#' class='hl_action hl_link' data-val='decode'>Decode from URL</a> " + // "| "+
		//"<a href='#' class='hl_action hl_link' data-val='ast' style='color:#0b0b0b;'>Generate AST</a> |"+
		//"<a href='#' class='hl_action hl_link' data-val='parser' style='color:#0b0b0b;'>Parser</a> |"+
		//"<a href='#' class='hl_action hl_link' data-val='parserf' style='color:#0b0b0b;'>ParserFull</a>"+
	"</div>"+
	"<div class='hl_spinner spinner'>"+
		"<div class='bounce1'></div>"+
		"<div class='bounce2'></div>"+
		"<div class='bounce3'></div>"+
	"</div>"+
	"<div class='hl_container'></div>"+
	"<div class='hl_resize_height'><div class='hl_tab'>Search command documentation</div></div>"+
	"<div class='hl_description'><select class='hl_description_select'></select><div class='hl_description_content'></div></div>"+
	"<div class='hl_toaster'><span>Copied to clipboard!</span></div>");
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
	var tokens = [];
	var data = {};
	var $dashboardBody = $('.dashboard-body');
	var $hl_description = $(".hl_description");
	var $hl_description_select = $(".hl_description_select");
	var $hl_description_content = $(".hl_description_content");
	var $hl_resize_height = $(".hl_resize_height");
	var $hl_container = $(".hl_container");
	var $hl_app_bar = $(".hl_app_bar");
	var mode = "spl";
	var theme = "vs-dark";
	var model = monaco.editor.createModel("\n\n\n`comment(\"Paste SPL query here...\")`\n\n");
	var editor = monaco.editor.create($hl_container[0], {
		automaticLayout: true,
		model: model,
		scrollBeyondLastLine: false,
		wordWrap: "on"
	});
	var shown_log_message = false;

	// Register a new simple language for prettying up git diffs
	monaco.languages.register({id: 'spl'});
	monaco.languages.setMonarchTokensProvider('spl', spl_language.lang);
	// Go through the SPL tokens and determine what command is currently hovered
	function rebuildTokens() {
		if (mode !== "spl") {
			return;
		}
		var contents = model.getValue();
		var tokenized = monaco.editor.tokenize(contents ,'spl');
		tokens = [{cmd: 'search', start:0, line:0, end:0}];
		for (var i = 0; i < tokenized.length; i++) {
			for (var j = 0; j < tokenized[i].length; j++) {
				if (tokenized[i][j].type === "command.spl") {
					var endPosition = ((j + 1) < tokenized[i].length) ? tokenized[i][(j+1)].offset : model.getLineLength(i+1);
					tokens.push({
						cmd: model.getValueInRange(new monaco.Range( (i+1), (tokenized[i][j].offset+1), (i+1), (endPosition+1) )),
						line: i + 1,
						start: j + 1,
						// get the start point of the next token or the end of the line if there is no next token
						end: endPosition + 1,
					});
				}
			}
		}
	}
	
	// Determing what command is in the current position - including all fields and arguments
	function determineCurrentCommandFull(position) {
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i].line > position.lineNumber || (tokens[i].line === position.lineNumber+1 && position.column >= tokens[i].start)) {
				return {cmd: tokens[i-1].cmd, start_line: tokens[i-1].line, start_col: tokens[i-1].start, end_line: tokens[i].line, end_col: tokens[i].start};
			}
		}
		return {cmd: tokens[tokens.length-1].cmd, start_line: tokens[tokens.length-1].line, start_col: tokens[tokens.length-1].start, end_line: 999999999, end_col: 999999999};
	}

	// Determing what command is in the current position - excluding all fields and arguments
	function determineCurrentCommandExact(position) {
		for (var i = 0; i < tokens.length; i++) {
			if ((tokens[i].line === position.lineNumber && position.column >= tokens[i].start && position.column < tokens[i].end)) {
				return {cmd: tokens[i].cmd, start_line: tokens[i].line, start_col: tokens[i].start, end_line: tokens[i].line, end_col: tokens[i].end};
			}
		}
		return null;
	}

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

	var tooltips_path = "/static/app/highlighter/spl.json";
	if (typeof standaloneMode !== "undefined") {
		tooltips_path = "spl.json";
	}

	// Async get the json file of the command descriptions etc - for the tooltips
	$.getJSON(tooltips_path, function( d ) {
		data = d;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				$("<option></option>").text(key).appendTo($hl_description_select);
			}
		}
		$hl_description_select.val("search").change();

		/*  tooltips are annoying
		monaco.languages.registerHoverProvider('spl', {
			provideHover: function(model, position) {
				if (mode !== "spl") {
					return;
				}
				var tok = determineCurrentCommandFull(position);
				return new Promise(function(resolve, reject) {
					resolve({
						range: new monaco.Range(tok.start_line, tok.start_col, tok.end_line, tok.end_col),
						contents: [
							{ value: '**' + tok.cmd + '**' },
							{ value: (data[tok.cmd].shortdesc || "") + "\n\n```plaintext\n\n\n" + data[tok.cmd].syntax + '\n```\n' }
						]
					});
				});
			}
		});*/
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
			if (mode !== "spl") {
				$hl_description.add($hl_resize_height).hide();
			} else {
				$hl_description.add($hl_resize_height).show();
			}
			updateUrlHash();
		} else if (val === "autoformat") {
			reformatCode();
		} else if (val === "decode") {
			var contents = model.getValue();
			var parser = document.createElement('a'),
				searchObject = {},
				queries, split, i;
			// Let the browser do the work
			parser.href = contents;
			if (parser.search) {
				// Convert query string to object
				queries = parser.search.replace(/^\?/, '').split('&');
				for( i = 0; i < queries.length; i++ ) {
					split = queries[i].split('=');
					searchObject[split[0]] = split[1];
				}
				model.setValue(decodeURIComponent(searchObject["q"]));
			}

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
		} else if (val === "ast") {
			var service = mvc.createService({owner: "nobody"});
			var contents = model.getValue();
			if (! /^\s*(search\s|\|)/.test(contents)) {
				contents = "search " + contents; 
			}
			service.request("/servicesNS/admin/search/search/ast", "POST", null, null, JSON.stringify({"spl": contents}), {"Content-Type": "application/json"}, null).done(function(data) { 
				//model.setValue(contents + "\n\n" + JSON.stringify(JSON.parse(data),null,3));
				console.log(JSON.parse(data));
				if (! shown_log_message) {
					shown_log_message = true;
					alert("Results have been logged to console. (This message won't be shown again)");
				}
			}).fail(function() {
				alert("FAILED");
			});
		
		} else if (val === "parser") { // /services/search/parser?parse_only=t&q=savedsea
			var service = mvc.createService({owner: "nobody"});
			var contents = model.getValue();
			if (! /^\s*(search\s|\|)/.test(contents)) {
				contents = "search " + contents; 
			}
			//service.get('/services/search/parser?parse_only=t&q=' + encodeURIComponent(contents), null, function(err, r) {
			service.get('/servicesNS/admin/search/search/parser', {"parse_only": "t", "q": contents}, function(err, r) {
				if (err) {
					console.log("ERROR", err);
				} else {
					console.log(r);
					if (! shown_log_message) {
						shown_log_message = true;
						alert("Results have been logged to console. (This message won't be shown again)");
					}
				}

			}).fail(function() {
				alert("FAILED");
			});
		} else if (val === "parserf") { // /services/search/parser?parse_only=t&q=savedsea
			var service = mvc.createService({owner: "nobody"});
			var contents = model.getValue();
			if (! /^\s*(search\s|\|)/.test(contents)) {
				contents = "search " + contents; 
			}
			//service.get('/services/search/parser?parse_only=t&q=' + encodeURIComponent(contents), null, function(err, r) {
			service.get('/servicesNS/admin/search/search/parser', {"parse_only": "f", "q": contents}, function(err, r) {
				if (err) {
					console.log("ERROR", err);
				} else {
					console.log(r);
					if (! shown_log_message) {
						shown_log_message = true;
						alert("Results have been logged to console. (This message won't be shown again)");
					}
				}

			}).fail(function() {
				alert("FAILED");
			});
				
		} else {
			alert("coming soon");
		}
	});

	$(".hl_sharelink").on("click", function(e){
		e.preventDefault();
		var $modal = $('.hl_modal');
		var $closeButton = $("<button class='btn'>Close</button>").on("click", function(){ $modal.removeClass('hl_show'); });
		$modal.html("<div class='hl_spinner spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>");
		$modal.addClass('hl_show');
		//console.log("Submitting", "url=" + encodeURI("https://chrisyounger.github.io/highlighter/appserver/static/" + document.location.hash));
		$.ajax({
			type: "POST",
			url: "https://neqvtz3rxl.execute-api.us-east-1.amazonaws.com/default/splHighlighterShortLink",
			data:  "url=" + encodeURI("https://chrisyounger.github.io/highlighter/appserver/static/" + document.location.hash),
			dataType: "text"
		}).done(function(response){
			$modal.html("<div class='hp_shortlink_result'><input type='text' /><button class='btn'>Copy</button></div>");
			$modal.find("input").val(response);
			$modal.find(".hp_shortlink_result > button").on("click", function(){
				copyTextToClipboard(response);
			});
		}).fail(function() {
			console.log(arguments);
			$modal.html("<div class=''>Error creating short URL...</div>");

		}).always(function(){
			$("<div class='hl_modal_footer'></div>").append($closeButton).appendTo($modal);
		});
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
		if (mode !== "spl") {
			return;
		}
		var contents = model.getValue();
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
				breakOnNextToken = false;
				if (tokenized[i][j].type === "macro.comment.wrap.close.spl") {
					breakOnNextToken = true;
				}				
				// Force a newline before a pipe, except if we just started a new line from a left square bracket
				if (tokenized[i][j].type === "pipe.spl" && prevTok !== "subsearch.start.spl") {
					doNewLine = true;
				}
				if (tokenized[i][j].type === "macro.comment.wrap.open.spl"){
					// add second blank line before comments
					if (prevTok !== "macro.comment.wrap.close.spl") {
						result += "\n";
					}
					doNewLine = true;
				}
				if (tokenized[i][j].type === "subsearch.start.spl"){
					currentIndentLevel++;
					doNewLine = true;
				}
				if (tokenized[i][j].type === "subsearch.end.spl"){
					currentIndentLevel--;
					currentIndentLevel = Math.max(currentIndentLevel, 0);
					breakOnNextToken = true;
				
				}
				// Figure out how many characters the token is
				var endPosition = ((j + 1) < tokenized[i].length) ? tokenized[i][(j+1)].offset : model.getLineLength(i+1);
				var tok = model.getValueInRange(new monaco.Range( (i+1), (tokenized[i][j].offset+1), (i+1), (endPosition+1) ));

				if (doNewLine) {
					result += "\n" + "\t".repeat(currentIndentLevel);
					deleteNextWhiteSpace = true;
				}
				if (tokenized[i][j].type === "white.spl") {
					// Normalise whitespace (including newlines) to a single space.
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
		editor.executeEdits('beautifier', [{ identifier: 'delete', range: new monaco.Range(1, 1, 100000, 1), text: '', forceMoveMarkers: true }]);
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

	$hl_description_select.on("change", function(){
		var command = $(this).val();
		if (! command) { return; }
		var m = (data[command].description || "");
		$hl_description_content.empty();
		var $doco_links = $("<div></div>").appendTo($hl_description_content);
		$doco_links.append("<a href='http://docs.splunk.com/Documentation/Splunk/latest/SearchReference/" + command + "' class='hl_link' target='blank'>Official documentation</a>");
		if (data[command].hasOwnProperty("related")) {
			$doco_links.append("<span class='hl_seealso'> See also: </span>");
			var rels = data[command].related.split(",");
			var relsA = [];
			for (var k = 0; k < rels.length; k++) {
				var rel = $.trim(rels[k]);
				if (rel) {
					relsA.push("<a href='http://docs.splunk.com/Documentation/Splunk/latest/SearchReference/" + rel + "' class='hl_link' target='blank'>" + rel + "</a>");
				}
			}
			$doco_links.append(relsA.join(", "));
		}	

		var p = m.replace(/\\p\\/g,"\\i\\ \\i\\").split(/\\i\\/);
		for (var i = 0; i < p.length; i++) {
			$("<p class='hl_desc'></p>").text(p[i]).appendTo($hl_description_content);
		}

		$hl_description_content.append(
			$("<h4>Syntax</h4>"),
			$("<span class='hl_pre'></span>").text(data[command].syntax || ""),
		);				
		for (var i = 1; i < 6; i++) {
			if (data[command].hasOwnProperty("example" + i)) {
				$hl_description_content.append(
					$("<h4>Example "+ i + ": </h4>").append("<span class='hl_ex'>" + (data[command]['comment' + i] || "") + "</span"),
					$("<span class='hl_pre'></span>").text(data[command]['example' + i])
				);
			}
		}
	});
	
	editor.onDidChangeCursorPosition(function (e) {
		var tok = determineCurrentCommandFull(e.position);
		$hl_description_select.val(tok.cmd).change();
	});

	// Handler for resizing the tree pane/editor divider
	$hl_resize_height.on("mousedown", function(e) {
		e.preventDefault();
		$(document).on("mousemove.rowresize", function(e) {
			$hl_description.css("flex-basis", (window.innerHeight - e.pageY) + "px");
			$hl_container.css("flex-basis", (e.pageY - 81) + "px");
		});
	});
	$(document).on("mouseup",function(e) {
		$(document).off('mousemove.rowresize');
	});

	// On changes update URL hash
	editor.onDidChangeModelContent(function(){
		updateUrlHash();
		rebuildTokens();
	});

	// Load previous values from local storage, or load from URL hash
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
	$("body").css("overflow","hidden");
	if (typeof standaloneMode === "undefined") {
		$dashboardBody.css({
			"position": "absolute",
			"bottom": "0",
			"top": "34px"
		});
	}
}
