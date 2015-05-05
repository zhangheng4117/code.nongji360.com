(function(){
	var _current = document.getElementsByTagName('script');
	_current = _current[_current.length-1];
	
	http.url = _current.src;
	
	var articleId = http.get('id');
	
	if ( /^[\d]+$/.test(articleId) )
	{
		statSpecial();
	}
	
	
	
	function statSpecial()
	{
		var params = {
			'article_id':articleId,
			'browser':Browser.browser,
			'browser_version':Browser.version,
			'screen_width':window.screen.availWidth || window.screen.width,
			'screen_height':window.screen.availHeight || window.screen.height,
			'referer':document.referrer
		};
	
		$.ajax({
			'url':HTTP_ZT+'/stat?r='+(new Date().getTime()),
			'dataType':'jsonp',
			'jsonpCallback':'jsonpCallback',
			'data':params,
			'processData':true,
			'type':'get',
			'success':function(data){},
			'error':function(XMLHttpRequest, textStatus, errorThrown){}
		});
	}
})();



/**
 * @purpose jsonp的回调函数，不可删除
 */
function jsonpCallback(){}