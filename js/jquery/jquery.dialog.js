(function($){
	var config = {
		ie6:( $.browser && $.browser.msie && $.browser.version<7 ) || ( window['Browser'] && Browser.msie && Browser.version<7 ),
		window:$(window),
		winOffset:{},
		bodyOffset:{},
		init:false,
		position:22,
		offset:false,
		mask:true
	};
	
	$.fn.MyDialog = $.fn.dialog = function(option){
		config.object = this;
		option = option || {};
		config.position = option.position || $.jqDialog.position.MIDDLE_CENTER;
		if ( undefined!=option.offset )
		{
			config.offset = option.offset;
		}
		if ( undefined!=option.mask )
		{
			config.mask = option.mask;
		}
		
		if(config.ie6){
			config.iframe = $("iframe#dialogIframe");
			if(0==config.iframe.size()){
				config.iframe = $("<iframe id=\"dialogIframe\" frameborder=\"0\" scrolling=\"no\" style=\"display:none;\"></iframe>").appendTo("body");
			}
		}
		
		if(!config.body){
			initialize();
			/*$(document).ready(function(){
				initialize();
			});
			while(!config.body){}*/
		}
		
		if (option)
		{
			config.bgColor = option.bgColor?option.bgColor:"#000000";
			config.opacity = option.opacity?option.opacity:"0.3";
			config.fn = 'function'==typeof(option.fn) ? option.fn : function(){};
		}else{
			config.bgColor = "#000000";
			config.opacity = "0.3";
		}
		
		if(!config.init){
			fullScreen();
		}
		$.jqDialog.show();
		
		config.window.unbind('scroll', realTime).bind('scroll', realTime)
			.unbind('resize', realTime).bind('resize', realTime);
		
		config.object.find("[rel='close'],[data-rel='close']").one("click",function(){
			$.jqDialog.hide();
		});
		
		config.object.focus();
		$.jqDialog.setPosition();
		return config.object;
	};
	
	$.jqDialog = {
		position:{
			'TOP_LEFT':11,
			'TOP_CENTER':12,
			'TOP_RIGHT':13,
			'MIDDLE_LEFT':21,
			'MIDDLE_CENTER':22,
			'MIDDLE_RIGHT':23,
			'BOTTOM_LEFT':31,
			'BOTTOM_CENTER':32,
			'BOTTOM_RIGHT':33
		},
		/*显示对话框*/
		show:function(){
			if ( true===config.mask )
			{
				config.fullScreen.show();
			}
			if(config.ie6) config.iframe.show();
			config.object.show(1, function(){
				setPosition();
				if ( 'function'===typeof(config.fn) ) config.fn();
			});
		},
		hide:function(fn){
			if(!config.object) return false;
			if ( true===config.mask )
			{
				config.fullScreen.hide();
			}
			if(config.ie6) config.iframe.hide();
			config.object.hide(fn);
		},
		setPosition:function(){
			if ( config.object && config.object.is(':visible') )
			{
				setPosition();
			}
		}
	};
	
	
	var initialize = function(){
		config.body = $("html");
		config.winOffset.width = config.window.width();
		config.winOffset.height = config.window.height();
		config.bodyOffset.width = config.body.get(0).scrollWidth;
		config.bodyOffset.height = config.body.get(0).scrollHeight;
	};
	
	
	/*全屏显示透明背景*/
	var fullScreen = function(){
		if ( true===config.mask )
		{
			var $full = $("#dialog-full-screen-opacity");
			if($full.size()==0){
				$full = $("<div id=\"dialog-full-screen-opacity\"></div>").appendTo($("body"));
			}
			$full.css({
				"width":Math.max(config.winOffset.width,config.bodyOffset.width)+"px",
				"height":Math.max(config.winOffset.height,config.bodyOffset.height)+"px",
				"backgroundColor":config.bgColor,
				"position":"absolute",
				"top":"0px","left":"0px","zIndex":"99996","opacity":config.opacity
			});
			config.fullScreen = $full;
		}
	};
	
	/*设置当前对话框的位置，默认在屏幕中间*/
	var setPosition = function(){
		var coord = {}, flagPosition = true;
		if(config.ie6)
		{
			config.iframe.css({
				"width":config.object.outerWidth(),
				"height":config.object.outerHeight(),
				"position":"absolute",
				"zIndex":"99996"
			});
			config.object.css({
				"position":"absolute",
				"zIndex":"99997"
			});

			switch ( config.position )
			{
				case $.jqDialog.position.TOP_LEFT :
					coord = {
						left:config.window.scrollLeft(),
						top:config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case  $.jqDialog.position.TOP_CENTER :
					coord = {
						left:((config.winOffset.width-config.object.outerWidth())/2)+config.window.scrollLeft(),
						top:config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.TOP_RIGHT :
					coord = {
						left:config.winOffset.width-config.object.outerWidth()+config.window.scrollLeft(),
						top:config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_LEFT :
					coord = {
						left:config.window.scrollLeft(),
						top:((config.winOffset.height-config.object.outerHeight())/2)+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_CENTER :
					coord = {
						left:((config.winOffset.width-config.object.outerWidth())/2)+config.window.scrollLeft(),
						top:((config.winOffset.height-config.object.outerHeight())/2)+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_RIGHT :
					coord = {
						left:config.winOffset.width-config.object.outerWidth()+config.window.scrollLeft(),
						top:((config.winOffset.height-config.object.outerHeight())/2)+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_LEFT :
					coord = {
						left:config.window.scrollLeft(),
						top:config.winOffset.height-config.object.outerHeight()+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_CENTER :
					coord = {
						left:((config.winOffset.width-config.object.outerWidth())/2)+config.window.scrollLeft(),
						top:config.winOffset.height-config.object.outerHeight()+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_RIGHT :
					coord = {
						left:config.winOffset.width-config.object.outerWidth()+config.window.scrollLeft(),
						top:config.winOffset.height-config.object.outerHeight()+config.window.scrollTop()
					};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				default :
					flagPosition = false;
					break;
			}
			if ( flagPosition )
			{
				config.iframe.css({"left":coord.left+'px', "top":coord.top+'px'});
				config.object.css({"left":coord.left+'px', "top":coord.top+'px'});
			}
		}
		else
		{
			config.object.css({"position":"fixed", "zIndex":"99997"});

			switch ( config.position )
			{
				case  $.jqDialog.position.TOP_LEFT :
					coord = {left:0, top:0};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case  $.jqDialog.position.TOP_CENTER :
					coord = {left:(config.winOffset.width-config.object.outerWidth())/2, top:0};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case  $.jqDialog.position.TOP_RIGHT :
					coord = {left:config.winOffset.width-config.object.outerWidth(), top:0};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_LEFT :
					coord = {
						left:0,
						top:(config.winOffset.height-config.object.outerHeight())/2
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_CENTER :
					coord = {
						left:(config.winOffset.width-config.object.outerWidth())/2,
						top:(config.winOffset.height-config.object.outerHeight())/2
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.MIDDLE_RIGHT :
					coord = {
						left:config.winOffset.width-config.object.outerWidth(),
						top:(config.winOffset.height-config.object.outerHeight())/2
					};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top += config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_LEFT :
					coord = {
						left:0,
						top:config.winOffset.height-config.object.outerHeight()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_CENTER :
					coord = {
						left:(config.winOffset.width-config.object.outerWidth())/2,
						top:config.winOffset.height-config.object.outerHeight()
					};
					if ( false!==config.offset )
					{
						coord.left += config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				case $.jqDialog.position.BOTTOM_RIGHT :
					coord = {
						left:config.winOffset.width-config.object.outerWidth(),
						top:config.winOffset.height-config.object.outerHeight()
					};
					if ( false!==config.offset )
					{
						coord.left -= config.offset.x;
						coord.top -= config.offset.y;
					}
					break;
				default :
					flagPosition = false;
					break;
			}
			if ( flagPosition )
			{
				config.object.css({"left":coord.left+'px', "top":coord.top+'px'});
			}
		}
		config.init = true;
	};
	
	
	var realTime = function(){
		initialize();
		fullScreen();
		setPosition();
	}
})(jQuery);