(function(){
	/**
	* @Purpose: 页面引用当前js文件script对象
	* @Type: object
	*/
	var _current = document.getElementsByTagName("script");
	_current = _current[_current.length-1];
	
	/**
	* @Purpose: 页面引用当前js文件的src路径
	* @Type: string
	*/
	http.url = _current.src;
	
	/**
	* @Purpose: 获取参数firstScroll true|false 默认false 第一次加载页面是是否滚动至当前script标签所在的位置
	* @Type: string
	*/
	var firstScroll = http.get("firstScroll");
	
	
	/**
	* @Purpose: 当前页面文件路径
	* @Type: string
	*/
	var _url = location.href;
	_url = _url.replace("http://"+document.domain+(!!location.port ? ":"+location.port : ""), "");
	_url = _url.substr(0, _url.indexOf("?")>-1 ? _url.indexOf("?") : _url.length).replace(/[\/]/g, "_");
	_url = "njScrollHere"+_url;
	if ( _url.indexOf(".")>-1 )
	{
		_url = _url.substr(0, _url.indexOf("."));
	}
	_url = _url.replace(/-[\d]+$/, "");
	
	/**
	* @Purpose: 滚动位置高度
	* @Type: integer
	*/
	var _top = -1;
	
	if ( ""==getCookie(_url) )
	{
		if ( "true"==firstScroll )
		{
			/**
			* @Purpose: 滚动位置标签id
			* @Type: string
			*/
			var _scrollId = "njScrollHere_"+(new Date()).getTime();
			document.write("<span id=\""+_scrollId+"\" style=\"float:none;width:0px;height:0px;margin:0;padding:0;overflow:hidden;\"></span>");
			
			/**
			* @Purpose: 滚动位置标签jQuery对象
			* @Type: object
			*/
			var _jScroll = $("#"+_scrollId);
			
			_top = _jScroll.offset().top;
		}
	}
	else
	{
		_top = getCookie(_url);
		if ( isNaN(parseFloat(_top)) )
		{
			_top = -1;
		}
	}
	
	/**
	* @Purpose: 如果_top不等于-1则滚动
	*/
	if ( -1!=_top )
	{
		$("html,body").animate({"scrollTop":_top+"px"}, 500);
	}
	
	/**
	* @Purpose: 记录当前页面滚动的高度
	*/
	$(window).scroll(function(){
		setCookie(_url, $(this).scrollTop());
	});
})();