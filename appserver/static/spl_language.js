(function (global, factory) {
    if (typeof define === 'function' && define.amd)
        define(function() { return factory(global, global.document, undefined); });
    else if (typeof module === 'object' && typeof module.exports === 'object')
        module.exports = factory(global, global.document, undefined);
    else
        factory(global, global.document, undefined);
}(typeof window !== 'undefined' ? window : this,
    function(window, document, undefined) {
        return { 
            lang: {
                defaultToken: 'invalid',
                ignoreCase: true,
                //brackets: [
                //    { open: '[', close: ']', token: 'delimiter.square' },
                //    { open: '(', close: ')', token: 'delimiter.parenthesis' }
                //],
                // These are splunk commands that dont have special handling
                commandBasics: ["addinfo","audit","cofilter","correlate","datamodel","delete","fields","file","filldown","from","gauge","geomfilter","highlight","iconify","localop","multisearch","nomv","overlap","pivot","regex","relevancy","reltime","return","reverse","table","tail","typer","uniq","untable"],
                commonEvalFunctions: ['abs','case','ceiling','cidrmatch','coalesce','commands','exact','exp','false','floor','if','ifnull','isbool','isint','isnotnull','isnull','isnum','isstr','len','like','ln','log','lower','match','max','md5','min','mvappend','mvcount','mvdedup','mvindex','mvfilter','mvfind','mvjoin','mvrange','mvsort','mvzip','now','null','nullif','pi','pow','random','relative_time','replace','round','searchmatch','sha1','sha256','sha512','sigfig','spath','split','sqrt','strftime','strptime','substr','time','tostring','trim','ltrim','rtrim','true','typeof','upper','urldecode','validate','tonumber','acos','acosh','asin','asinh','atan','atan2','atanh','cos','cosh','hypot','sin','sinh','tan','tanh'],
                commonAggFunctions: ['sparkline','c','count','dc','distinct_count','mean','avg','stdev','stdevp','var','varp','sum','sumsq','min','max','mode','median','earliest','first','last','latest','perc','p','exactperc','upperperc','list','values','range','estdc','estdc_error','earliest_time','latest_time','perc70','perc80','perc90','perc91','perc92','perc93','perc94','perc95','perc96','perc97','perc98','perc99'],
                commonConvertFunctions: ['auto', 'dur2sec', 'mstime', 'memk', 'none', 'num', 'rmunit', 'rmcomma', 'ctime', 'mktime'],

abstractCommandArguments: ['maxterms','maxlines'],
addcoltotalsCommandArguments: ['labelfield','label'],
addtotalsCommandArguments: ['row','col','labelfield','label','fieldname'],
analyzefieldsCommandArguments: ['classfield'],
anomaliesCommandArguments: ['threshold','labelonly','normalize','maxvalues','field','blacklist','blacklistthreshold'],
anomaliesCommandKeywords: ['BY'],
anomalousvalueCommandArguments: ['minsupcount','maxanofreq','minsupfreq','minnormfreq','pthresh','action'],
anomalydetectionCommandArguments: ['pthresh','cutoff','method','action','action'],
appendCommandArguments: ['extendtimerange','maxtime','maxout','timeout'],
appendcolsCommandArguments: ['override','extendtimerange','maxtime','maxout','timeout'],
appendpipeCommandArguments: ['run_in_preview'],
archivebucketsCommandArguments: ['forcerun','retries'],
arulesCommandArguments: ['sup','conf'],
associateCommandArguments: ['supcnt','supfreq','improv'],
autoregressCommandArguments: ['p'],
binCommandArguments: ['bins','minspan'],
bucketdirCommandArguments: ['maxcount','countfield','sep','pathfield','sizefield'],
chartCommandArguments: ['sep','format','cont','limit','minspan','minspan','useother','useother','aligntime','span','start','end','nullstr','otherstr','bins'],
chartCommandKeywords: ['WHERE','OVER','NOT','AND','OR','XOR','LIKE','BY'],
clusterCommandArguments: ['t','delims','showcount','countfield','labelfield','field','labelonly','match'],
collectCommandArguments: ['addtime','index','index','file','spool','marker','testmode','run_in_preview','host','source','sourcetype'],
concurrencyCommandArguments: ['start','output','duration'],
contingencyCommandArguments: ['usetotal','totalstr','maxrows','maxcols','mincolcover','minrowcover'],
convertCommandArguments: ['timeformat'],
dbinspectCommandArguments: ['index','corruptonly','span'],
dedupCommandArguments: ['keepevents','keepempty','consecutive'],
dedupCommandKeywords: ['sortby'],
deltaCommandArguments: ['p'],
diffCommandArguments: ['position1','position2','attribute','diffheader','context','maxlen'],
erexCommandArguments: ['fromfield','maxtrainers','examples','counterexamples'],
evalCommandArguments: ['field'],
evalCommandKeywords: ['AND','OR','XOR','NOT','LIKE'],
eventcountCommandArguments: ['index','summarize','report_size','list_vix'],
eventstatsCommandArguments: ['allnum'],
eventstatsCommandKeywords: ['BY'],
extractCommandArguments: ['segment','reload','kvdelim','pairdelim','limit','maxchars','mv_add','clean_keys'],
fieldformatCommandKeywords: ['AND','OR','XOR','NOT','LIKE'],
fieldsummaryCommandArguments: ['maxvals'],
fillnullCommandArguments: ['value'],
findtypesCommandArguments: ['max'],
foreachCommandArguments: ['fieldstr','matchstr','matchseg1','matchseg2','matchseg3'],
formatCommandArguments: ['maxresults','mvsep'],
gentimesCommandArguments: ['increment','start','end'],
geomCommandArguments: ['gen'],
geostatsCommandArguments: ['translatetoxy','latfield','longfield','outputlatfield','outputlongfield','globallimit','locallimit','binspanlat','maxzoomlevel','binspanlong'],
headCommandArguments: ['limit','null','keeplast'],
headCommandKeywords: ['AND','OR','XOR','NOT','LIKE'],
historyCommandArguments: ['events'],
inputCommandArguments: ['sourcetype','index','add','remove'],
inputcsvCommandArguments: ['dispatch','append','start','max','events'],
inputcsvCommandKeywords: ['WHERE'],
inputlookupCommandArguments: ['append','start','max'],
inputlookupCommandKeywords: ['WHERE'],
iplocationCommandArguments: ['prefix','allfields','lang'],
joinCommandArguments: ['left','right','usetime','earlier','overwrite','max','type','field'],
joinCommandKeywords: ['WHERE'],
kmeansCommandArguments: ['reps','maxiters','t','k','cfield','showcentroid','dt'],
kvformCommandArguments: ['form','field'],
loadjobCommandArguments: ['events','job_delegate','artifact_offset','ignore_running','savedsearch'],
localizeCommandArguments: ['maxpause','timeafter','timebefore'],
lookupCommandArguments: ['local','update','event_time_field'],
lookupCommandKeywords: ['OUTPUTNEW','OUTPUT'],
makecontinuousCommandArguments: ['bins','minspan','span','start','end','aligntime'],
makejsonCommandArguments: ['output'],
makemvCommandArguments: ['delim','allowempty','setsv','tokenizer'],
makeresultsCommandArguments: ['count','annotate','splunk_server','splunk_server_group'],
mapCommandArguments: ['maxsearches','search'],
mcollectCommandArguments: ['index','file','split','spool','prefix_field','host','source','sourcetype'],
metadataCommandArguments: ['index','splunk_server','splunk_server_group','datatype','type'],
metasearchCommandArguments: ['savedsearch','savedsplunk','field','eventtypetag','hosttag'],
metasearchCommandKeywords: ['IN'],
meventcollectCommandArguments: ['index','split','spool','prefix_field','host','source','sourcetype'],
mstatsCommandArguments: ['prestats','append','backfill','update_period','span','savedsearch','savedsplunk','field'],
multikvCommandArguments: ['conf','copyattrs','forceheader','multitable','noheader','rmorig','fields','filter'],
mvcombineCommandArguments: ['delim'],
mvexpandCommandArguments: ['limit'],
outlierCommandArguments: ['param','uselower','mark','action'],
outputcsvCommandArguments: ['append','create_empty','override_if_empty','dispatch','usexml','singlefile'],
outputlookupCommandArguments: ['append','create_empty','override_if_empty','max','key_field','createinapp','output_format'],
outputtelemetryCommandArguments: ['input','type','component','support','anonymous','license','optinrequired'],
outputtextCommandArguments: ['usexml'],
predictCommandArguments: ['correlate','future_timespan','holdback','period','suppress','algorithm','upper','lower'],
rangemapCommandArguments: ['default','field'],
rareCommandArguments: ['showcount','showperc','limit','countfield','percentfield','useother','otherstr'],
rareCommandKeywords: ['BY'],
redistributeCommandArguments: ['num_of_reducers'],
redistributeCommandKeywords: ['BY'],
replaceCommandKeywords: ['WITH','IN'],
restCommandArguments: ['count','splunk_server','splunk_server_group','timeout'],
rexCommandArguments: ['field','max_match','offset_field','mode'],
rtorderCommandArguments: ['discard','buffer_span','max_buffer_size'],
savedsearchCommandArguments: ['nosubstitution'],
scriptCommandArguments: ['maxinputs'],
scrubCommandArguments: ['dictionary','timeconfig','namespace','public-terms','private-terms','name-terms'],
searchCommandArguments: ['index','sourcetype','source','eventtype','tag','host','earliest','latest','_index_earliest','_index_latest','savedsearch','savedsplunk','field'],
searchCommandKeywords: ['BY','WHERE','OVER','AND','OR','XOR','NOT','TERM','IN','CASE'],
searchtxnCommandArguments: ['max_terms','use_disjunct','eventsonly'],
selfjoinCommandArguments: ['overwrite','max','keepsingle'],
sendemailCommandArguments: ['to','from','cc','bcc','paperorientation','priority','papersize','content_type','format','subject','message','footer','sendresults','inline','sendcsv','sendpdf','pdfview','server','graceful','width_sort_columns','use_ssl','use_tls','maxinputs','maxtime'],
setCommandKeywords: ['union','diff','intersect'],
shapeCommandArguments: ['maxvalues','maxresolution'],
sichartCommandArguments: ['sep','format','cont','limit','minspan','start','end','span','bins','usenull','useother','otherstr','nullstr'],
sichartCommandKeywords: ['BY','WHERE','OVER','AND','OR','XOR','NOT'],
sirareCommandArguments: ['showcount','showperc','limit','countfield','percentfield','useother','otherstr'],
sirareCommandKeywords: ['BY'],
sistatsCommandArguments: ['partitions','allnum','delim'],
sistatsCommandKeywords: ['BY'],
sitimechartCommandArguments: ['sep','format','fixedrange','partial','cont','limit','minspan','bins','usenull','useother','nullstr','otherstr'],
sitimechartCommandKeywords: ['LIKE','NOT','AND','OR','XOR','WHERE','LIKE','BY'],
sitopCommandArguments: ['showcount','showperc','limit','countfield','percentfield','useother','otherstr'],
sitopCommandKeywords: ['BY'],
sortCommandKeywords: ['auto','str','ip','num','desc','d'],
spathCommandArguments: ['output','path','input'],
statsCommandArguments: ['partitions','allnum','delim'],
statsCommandKeywords: ['by'],
strcatCommandArguments: ['allrequired'],
streamstatsCommandArguments: ['reset_on_change','current','window','time_window','global','allnum','reset_before'],
streamstatsCommandKeywords: ['LIKE','NOT','AND','OR','XOR','WHERE','LIKE','BY'],
tagsCommandArguments: ['outputfield','inclname','inclvalue'],
timechartCommandArguments: ['sep','format','fixedrange','partial','cont','limit','minspan'],
timechartCommandKeywords: ['LIKE','NOT','AND','OR','XOR','WHERE','BY'],
timewrapCommandArguments: ['time_format','align','series'],
topCommandArguments: ['showcount','showperc','limit','countfield','percentfield','useother','otherstr'],
topCommandKeywords: ['BY'],
transactionCommandArguments: ['name','maxspan','maxopentxn','delim','maxpause','maxevents','connected','unifyends','keeporphans','maxopenevents','keepevicted','mvlist','nullstr','mvraw','startswith','endswith'],
transposeCommandArguments: ['column_name','header_field','include_empty'],
trendlineCommandArguments: ['sma','ema','wma'],
tstatsCommandArguments: ['prestats','local','append','summariesonly','allow_old_summaries','span','sid','datamodel','chunk_size','savedsearch','savedsplunk','field'],
tstatsCommandKeywords: ['LIKE','NOT','AND','OR','XOR','WHERE','BY','IN','GROUPBY'],
typeaheadCommandArguments: ['max_time','index','collapse','prefix','count'],
unionCommandArguments: ['extendtimerange','maxtime','maxout','timeout'],
whereCommandKeywords: ['LIKE','NOT','AND','OR','XOR','LIKE'],
x11CommandArguments: ['mult','add'],
xmlkvCommandArguments: ['maxinputs'],
xmlunescapeCommandArguments: ['maxinputs'],
xpathCommandArguments: ['field','outfield','default'],
xyseriesCommandArguments: ['grouped','sep','format'],



                tokenizer: {
                    root: [
                        { include: '@commonPreamble' },
                        [/\|/, {token: 'pipe', next: '@aaCommand'}],
                        // Search command starts everything off 
                        { include: '@searchCommand' },
                    ],
                    aaCommand: [
                        { include: '@whitespace' },
                        [/[\w@#$]+/, {
                            cases: {

'abstract': { token: 'command', next: '@abstractCommand' },
'accum': { token: 'command', next: '@accumCommand' },
'addcoltotals': { token: 'command', next: '@addcoltotalsCommand' },
'addtotals': { token: 'command', next: '@addtotalsCommand' },
'analyzefields': { token: 'command', next: '@analyzefieldsCommand' },
'anomalies': { token: 'command', next: '@anomaliesCommand' },
'anomalousvalue': { token: 'command', next: '@anomalousvalueCommand' },
'anomalydetection': { token: 'command', next: '@anomalydetectionCommand' },
'append': { token: 'command', next: '@appendCommand' },
'appendcols': { token: 'command', next: '@appendcolsCommand' },
'appendpipe': { token: 'command', next: '@appendpipeCommand' },
'archivebuckets': { token: 'command', next: '@archivebucketsCommand' },
'arules': { token: 'command', next: '@arulesCommand' },
'associate': { token: 'command', next: '@associateCommand' },
'autoregress': { token: 'command', next: '@autoregressCommand' },
'bin': { token: 'command', next: '@binCommand' },
'bucketdir': { token: 'command', next: '@bucketdirCommand' },
'chart': { token: 'command', next: '@chartCommand' },
'cluster': { token: 'command', next: '@clusterCommand' },
'collect': { token: 'command', next: '@collectCommand' },
'concurrency': { token: 'command', next: '@concurrencyCommand' },
'contingency': { token: 'command', next: '@contingencyCommand' },
'convert': { token: 'command', next: '@convertCommand' },
'dbinspect': { token: 'command', next: '@dbinspectCommand' },
'dedup': { token: 'command', next: '@dedupCommand' },
'delta': { token: 'command', next: '@deltaCommand' },
'diff': { token: 'command', next: '@diffCommand' },
'erex': { token: 'command', next: '@erexCommand' },
'eval': { token: 'command', next: '@evalCommand' },
'eventcount': { token: 'command', next: '@eventcountCommand' },
'eventstats': { token: 'command', next: '@eventstatsCommand' },
'extract': { token: 'command', next: '@extractCommand' },
'fieldformat': { token: 'command', next: '@fieldformatCommand' },
'fieldsummary': { token: 'command', next: '@fieldsummaryCommand' },
'fillnull': { token: 'command', next: '@fillnullCommand' },
'findtypes': { token: 'command', next: '@findtypesCommand' },
'foreach': { token: 'command', next: '@foreachCommand' },
'format': { token: 'command', next: '@formatCommand' },
'gentimes': { token: 'command', next: '@gentimesCommand' },
'geom': { token: 'command', next: '@geomCommand' },
'geostats': { token: 'command', next: '@geostatsCommand' },
'head': { token: 'command', next: '@headCommand' },
'history': { token: 'command', next: '@historyCommand' },
'input': { token: 'command', next: '@inputCommand' },
'inputcsv': { token: 'command', next: '@inputcsvCommand' },
'inputlookup': { token: 'command', next: '@inputlookupCommand' },
'iplocation': { token: 'command', next: '@iplocationCommand' },
'join': { token: 'command', next: '@joinCommand' },
'kmeans': { token: 'command', next: '@kmeansCommand' },
'kvform': { token: 'command', next: '@kvformCommand' },
'loadjob': { token: 'command', next: '@loadjobCommand' },
'localize': { token: 'command', next: '@localizeCommand' },
'lookup': { token: 'command', next: '@lookupCommand' },
'makecontinuous': { token: 'command', next: '@makecontinuousCommand' },
'makejson': { token: 'command', next: '@makejsonCommand' },
'makemv': { token: 'command', next: '@makemvCommand' },
'makeresults': { token: 'command', next: '@makeresultsCommand' },
'map': { token: 'command', next: '@mapCommand' },
'mcollect': { token: 'command', next: '@mcollectCommand' },
'metadata': { token: 'command', next: '@metadataCommand' },
'metasearch': { token: 'command', next: '@metasearchCommand' },
'meventcollect': { token: 'command', next: '@meventcollectCommand' },
'mstats': { token: 'command', next: '@mstatsCommand' },
'multikv': { token: 'command', next: '@multikvCommand' },
'mvcombine': { token: 'command', next: '@mvcombineCommand' },
'mvexpand': { token: 'command', next: '@mvexpandCommand' },
'outlier': { token: 'command', next: '@outlierCommand' },
'outputcsv': { token: 'command', next: '@outputcsvCommand' },
'outputlookup': { token: 'command', next: '@outputlookupCommand' },
'outputtelemetry': { token: 'command', next: '@outputtelemetryCommand' },
'outputtext': { token: 'command', next: '@outputtextCommand' },
'predict': { token: 'command', next: '@predictCommand' },
'rangemap': { token: 'command', next: '@rangemapCommand' },
'rare': { token: 'command', next: '@rareCommand' },
'redistribute': { token: 'command', next: '@redistributeCommand' },
'rename': { token: 'command', next: '@renameCommand' },
'replace': { token: 'command', next: '@replaceCommand' },
'rest': { token: 'command', next: '@restCommand' },
'rex': { token: 'command', next: '@rexCommand' },
'rtorder': { token: 'command', next: '@rtorderCommand' },
'savedsearch': { token: 'command', next: '@savedsearchCommand' },
'script': { token: 'command', next: '@scriptCommand' },
'scrub': { token: 'command', next: '@scrubCommand' },
'search': { token: 'command', next: '@searchCommand' },
'searchtxn': { token: 'command', next: '@searchtxnCommand' },
'selfjoin': { token: 'command', next: '@selfjoinCommand' },
'sendemail': { token: 'command', next: '@sendemailCommand' },
'set': { token: 'command', next: '@setCommand' },
'shape': { token: 'command', next: '@shapeCommand' },
'sichart': { token: 'command', next: '@sichartCommand' },
'sirare': { token: 'command', next: '@sirareCommand' },
'sistats': { token: 'command', next: '@sistatsCommand' },
'sitimechart': { token: 'command', next: '@sitimechartCommand' },
'sitop': { token: 'command', next: '@sitopCommand' },
'sort': { token: 'command', next: '@sortCommand' },
'spath': { token: 'command', next: '@spathCommand' },
'stats': { token: 'command', next: '@statsCommand' },
'strcat': { token: 'command', next: '@strcatCommand' },
'streamstats': { token: 'command', next: '@streamstatsCommand' },
'tags': { token: 'command', next: '@tagsCommand' },
'timechart': { token: 'command', next: '@timechartCommand' },
'timewrap': { token: 'command', next: '@timewrapCommand' },
'top': { token: 'command', next: '@topCommand' },
'transaction': { token: 'command', next: '@transactionCommand' },
'transpose': { token: 'command', next: '@transposeCommand' },
'trendline': { token: 'command', next: '@trendlineCommand' },
'tstats': { token: 'command', next: '@tstatsCommand' },
'typeahead': { token: 'command', next: '@typeaheadCommand' },
'union': { token: 'command', next: '@unionCommand' },
'where': { token: 'command', next: '@whereCommand' },
'x11': { token: 'command', next: '@x11Command' },
'xmlkv': { token: 'command', next: '@xmlkvCommand' },
'xmlunescape': { token: 'command', next: '@xmlunescapeCommand' },
'xpath': { token: 'command', next: '@xpathCommand' },
'xyseries': { token: 'command', next: '@xyseriesCommand' },

                                '@commandBasics': {token: 'command', next: '@commandBasic'},
                                '@default': 'identifier'
                            }
                        }],
                        ['', '', '@pop'],
                    ],



abstractCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@abstractCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

accumCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	{ include: '@commonPostamble' },
],

addcoltotalsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@addcoltotalsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

addtotalsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@addtotalsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

analyzefieldsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@analyzefieldsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

anomaliesCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@anomaliesCommandArguments': 'argument',
			'@anomaliesCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

anomalousvalueCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@anomalousvalueCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

anomalydetectionCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@anomalydetectionCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

appendCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@appendCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

appendcolsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@appendcolsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

appendpipeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@appendpipeCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

archivebucketsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@archivebucketsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

arulesCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@arulesCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

associateCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@associateCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

autoregressCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@autoregressCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

binCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@binCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

bucketdirCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@bucketdirCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

chartCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@chartCommandArguments': 'argument',
			'@chartCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

clusterCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@clusterCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

collectCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@collectCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

concurrencyCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@concurrencyCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

contingencyCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@contingencyCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

convertCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonConvertFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@convertCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

dbinspectCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@dbinspectCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

dedupCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@dedupCommandArguments': 'argument',
			'@dedupCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

deltaCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@deltaCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

diffCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@diffCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

erexCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@erexCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

evalCommand: [
	{ include: '@commonPreamble' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonEvalFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@evalCommandArguments': 'argument',
			'@evalCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

eventcountCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@eventcountCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

eventstatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@eventstatsCommandArguments': 'argument',
			'@eventstatsCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

extractCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@extractCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

fieldformatCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@fieldformatCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

fieldsummaryCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@fieldsummaryCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

fillnullCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@fillnullCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

findtypesCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@findtypesCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

foreachCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@foreachCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

formatCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@formatCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

gentimesCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@gentimesCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

geomCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@geomCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

geostatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {	
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@geostatsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

headCommand: [
	{ include: '@commonPreamble' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonEvalFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@headCommandArguments': 'argument',
			'@headCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

historyCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@historyCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

inputCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@inputCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

inputcsvCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@inputcsvCommandArguments': 'argument',
			'@inputcsvCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

inputlookupCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@inputlookupCommandArguments': 'argument',
			'@inputlookupCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

iplocationCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@iplocationCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

joinCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@joinCommandArguments': 'argument',
			'@joinCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

kmeansCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@kmeansCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

kvformCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@kvformCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

loadjobCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@loadjobCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

localizeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@localizeCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

lookupCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@lookupCommandArguments': 'argument',
			'@lookupCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

makecontinuousCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@makecontinuousCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

makejsonCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@makejsonCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

makemvCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@makemvCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

makeresultsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@makeresultsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

mapCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@mapCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

mcollectCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@mcollectCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

metadataCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@metadataCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

metasearchCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@metasearchCommandArguments': 'argument',
			'@metasearchCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

meventcollectCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@meventcollectCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

mstatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@mstatsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

multikvCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@multikvCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

mvcombineCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@mvcombineCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

mvexpandCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@mvexpandCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

outlierCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@outlierCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

outputcsvCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@outputcsvCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

outputlookupCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@outputlookupCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

outputtelemetryCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@outputtelemetryCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

outputtextCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@outputtextCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

predictCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@predictCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

rangemapCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@rangemapCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

rareCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@rareCommandArguments': 'argument',
			'@rareCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

redistributeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@redistributeCommandArguments': 'argument',
			'@redistributeCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

renameCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	{ include: '@commonPostamble' },
],

replaceCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@replaceCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

restCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@restCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

rexCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@rexCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

rtorderCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@rtorderCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

savedsearchCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@savedsearchCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

scriptCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@scriptCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

scrubCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@scrubCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

searchCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@searchCommandArguments': 'argument',
			'@searchCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

searchtxnCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@searchtxnCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

selfjoinCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@selfjoinCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sendemailCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@sendemailCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

setCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@setCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

shapeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@shapeCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sichartCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@sichartCommandArguments': 'argument',
			'@sichartCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sirareCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@sirareCommandArguments': 'argument',
			'@sirareCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sistatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@sistatsCommandArguments': 'argument',
			'@sistatsCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sitimechartCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@sitimechartCommandArguments': 'argument',
			'@sitimechartCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sitopCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@sitopCommandArguments': 'argument',
			'@sitopCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

sortCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@sortCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

spathCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@spathCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

statsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@statsCommandArguments': 'argument',
			'@statsCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

strcatCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@strcatCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

streamstatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@streamstatsCommandArguments': 'argument',
			'@streamstatsCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

tagsCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@tagsCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

timechartCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@timechartCommandArguments': 'argument',
			'@timechartCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

timewrapCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@timewrapCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

topCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@topCommandArguments': 'argument',
			'@topCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

transactionCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@transactionCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

transposeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@transposeCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

trendlineCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@trendlineCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

tstatsCommand: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonAggFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@tstatsCommandArguments': 'argument',
			'@tstatsCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

typeaheadCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@typeaheadCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

unionCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@unionCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

whereCommand: [
	{ include: '@commonPreamble' },
	[/(?:count|perc(?:70|80|9\d)|(?:md5|sha1|sha256|sha512|atan2|dur2sec|[a-zA-Z_]+)(?=\d*\s*\())/, {
		cases: {
			'@commonEvalFunctions': 'function',
			'@default': 'identifier.badfunction'
		}
	}],
	[/\w+/, {
		cases: {
			'@whereCommandKeywords': 'keyword',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

x11Command: [
	{ include: '@commonPreamble' },
	{ include: '@renameAs' },
	[/\w+/, {
		cases: {
			'@x11CommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

xmlkvCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@xmlkvCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

xmlunescapeCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@xmlunescapeCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

xpathCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@xpathCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],

xyseriesCommand: [
	{ include: '@commonPreamble' },
	[/\w+/, {
		cases: {
			'@xyseriesCommandArguments': 'argument',
			'@default': 'identifier.badarg'
		}
	}],
	{ include: '@commonPostamble' },
],




                


                    commandBasic: [
                        { include: '@commonPreamble' },
                        { include: '@commonPostamble' },
                    ],
                    commonPreamble: [
                        { include: '@whitespace' },
                        { include: '@strings' },
                        { include: '@numbers' },			
                        //[/[\]\[\(\)]/, '@brackets'],
                        [/\(/, 'brackets.open'],
                        [/\)/, 'brackets.close'],
                        [/\[/, 'subsearch.start', '@aaCommand'],
                        [/\]/, 'subsearch.end'],
                    ],
                    commonPostamble: [
                        [/[!<>=,%\+\.\*\-\/]+/, {token: 'operator'}],
						//Gobble up unexpected things (negated character class)
                        [/[^\s\|\(\)\[\]!<>=,%\+\.\*\-\/]+/, 'identifier.postamble'],
                        ['', '', '@pop'],
                    ],
                    renameAs: [
                        // This regex allows matching the right side of "as". I wonder if it becomes a bit much though
                        //[/(as)(\s+)((?:\"[^\"]*\"|\'[^\'']*\'|[\w]+))/, ['metatag','white','string']],
                        // Simplier version
                        [/(as)(\s+)/, ['keyword','white']],
                    ],
                    whitespace: [
                        [/\s+/, 'white'],
                        [/`\s*comment\s*\(\s*"/, 'macro.comment.wrap.open', '@commentsEnd'],
                        [/(`)(\s*\w+)([^`]*)(`)/, ['macro.function','macro.function','macro.args','macro.function']]
                    ],	
					commentsEnd: [
                        //[/[^\\"]+$/, 'string', '@pop'],
                        [/"\s*\)\s*`/, 'macro.comment.wrap.close', '@pop'],
                        [/\\./, 'macro.comment'],
                        [/[^\\"]+/, 'macro.comment'],
                        //[/\\./, 'macro.comment'],
                        //[/\\$/, 'macro.comment']
                    ],
                    numbers: [
                        [/0[xX][0-9a-fA-F]*/, 'number'],
                        [/[$][+-]*\d*(\.\d*)?/, 'number'],
                        [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
                    ],
                    // Recognize strings, including those broken across lines with \ (but not without)
                    strings: [
                        //[/'$/, 'string.escape', '@pop'],
                        [/'/, 'string.escape', '@stringBody'],
                        //[/"$/, 'string.escape', '@pop'],
                        [/"/, 'string.escape', '@dblStringBody']
                    ],
                    stringBody: [
                        //[/[^\\']+$/, 'string', '@pop'],
                        [/[^\\']+/, 'string'],
                        [/\\./, 'string'],
                        [/'/, 'string.escape', '@pop'],
                        //[/\\$/, 'string']
                    ],
                    dblStringBody: [
                        //[/[^\\"]+$/, 'string', '@pop'],
                        [/[^\\"]+/, 'string'],
                        [/\\./, 'string'],
                        [/"/, 'string.escape', '@pop'],
                        //[/\\$/, 'string']
                    ]			
                }
            }
        }
    }
));
