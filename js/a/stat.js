(function(){
	if ( 'undefined'==typeof(objectId) || !/^[\d]+$/.test(objectId) ) return false;
	statHits();
})();

function statHits()
{
	var params = {
			'article_id':objectId,
			'browser':Browser.browser,
			'browser_version':Browser.version,
			'screen_width':window.screen.availWidth || window.screen.width,
			'screen_height':window.screen.availHeight || window.screen.height,
			'referer':document.referrer
		};
	if ( 'undefined'!=typeof(terminal) ) params.terminal = terminal;
	
	$.post('/stat?r='+(new Date().getTime()), params, function(res){
		/* null */
	});
}