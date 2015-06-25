//
// +------------------------------------------------------------------------------------------------+
// | jQuery 1.4.2																					|
// +------------------------------------------------------------------------------------------------+
// | Copyright (c) 2008-2014 www.nongji360.com														|
// +------------------------------------------------------------------------------------------------+
// | 页面滚动高度至指定位置则指定对象浮动在页面顶部															|
// | Author: zhangheng zhangheng4117@163.com														|
// +------------------------------------------------------------------------------------------------+
//
// jquery.float.js, V 2014.0320.1, 2010-03-20 15:50


(function($){
	$.fn.float = function(opt){
		if ( undefined==opt )
		{
			opt = {};
		}
		var _this = $(this);
		
		/**
		* @Purpose: 不横过(当前对象底端不覆盖)指定选择器
		*/
		opt.isUnCross = undefined!=opt.unCross;
		if ( opt.isUnCross )
		{
			opt.isUnCross = $(opt.unCross).size()>0;
		}
		_this.data("njFloatIsUnCross", opt.isUnCross);
		if ( opt.isUnCross )
		{
			_this.data("njFloatUnCross", opt.unCross);
		}
		
		/**
		* @Purpose: 当前对象绝对高度
		* @Type: integer
		*/
		var _top = _this.offset().top;
		_this.data("njFloatTop", _top);
		
		/**
		* @Purpose: 标签css名
		* @Type: string
		*/
		var _labelClass = "njFloat_"+Math.ceil((new Date()).getTime()*Math.random());
		_this.data("njFloatClass", _labelClass);
		
		/**
		* @Purpose: 是否是ie6
		* @Type: boolean
		*/
		var _ie6 = $.browser.msie && $.browser.version<7;
		
		/**
		* @Purpose: CSS样式字符串
		* @Type: string
		*/
		var _cssText = "<style type=\"text/css\">";
		if ( _ie6 )
		{
			_cssText += "html{background:url(about:black) no-repeat fixed;}."+_labelClass+"{position:absolute;top:expression(offsetParent.scrollTop);}";
		}
		else
		{
			_cssText += "."+_labelClass+"{position:fixed;top:0px;}";
		}
		_cssText += "</style>";
		_this.before(_cssText);
		
		
		/**
		* @Purpose: 窗口滚动事件，判断滚动高度是否大于当前对象top位置
		*/
		$(window).scroll(function(){
			/**
			* @Purpose: 滚动高度
			* @Type: integer
			*/
			var _scrollTop = $(this).scrollTop();
			
			if ( _scrollTop>_this.data("njFloatTop") )
			{
				var _isUnCross = _this.data("njFloatIsUnCross"),
					_scrollHeight = -1,
					_windowHeight = $(window).height(),
					_currWindowHeight = 0;
				if ( true===_isUnCross )
				{
					_scrollHeight = Math.ceil($(_this.data("njFloatUnCross")).offset().top);
				}
				
				_this.addClass(_this.data("njFloatClass"));
				
				if ( _isUnCross )
				{
					/**
					* @Purpose: 启用限制横过指定元素
					*/
					if ( _scrollTop+_this.outerHeight(true)>_scrollHeight )
					{
						if ( _ie6 )
						{
							
						}
						else
						{
							_this.css({"top":"auto","bottom":(_windowHeight-_scrollHeight+_scrollTop)+"px"});
						}
					}
					else
					{
						if ( _ie6 )
						{
							_this.css({"top":"expression(offsetParent.scrollTop)","bottom":"auto"});
						}
						else
						{
							_this.css({"top":"0px","bottom":"auto"});
						}
					}
				}
			}else{
				_this.removeClass(_this.data("njFloatClass"));
			}
		});
		
		return _this;
	}
})(jQuery);