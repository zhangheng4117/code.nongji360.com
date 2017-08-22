function statManualHits(statData)
{
	if ( 'object'!=typeof(statData) ) return false;

	var params = {
		'browser':Browser.browser,
		'browser_version':Browser.version,
		'screen_width':window.screen.availWidth || window.screen.width,
		'screen_height':window.screen.availHeight || window.screen.height,
		'referer':document.referrer,
		'request_uri':window.location.href
	};
	params = $.extend(params, statData);

	$.post('/stat?r='+(new Date().getTime()), params, function(res){
		/* null */
	});
}