(function($){
	var config = {
		ie6:( $.browser && $.browser.msie && $.browser.version<7 ) || ( window['Browser'] && Browser.msie && Browser.version<7 ),
		window:$(window),
		winOffset:{},
		bodyOffset:{},
		init:false
	};
	
	$.fn.MyDialog = $.fn.dialog = function(option){
		config.object = this;
		
		if(config.ie6){
			config.iframe = $("iframe#dialogIframe");
			if(0==config.iframe.size()){
				config.iframe = $("<iframe id=\"dialogIframe\" frameborder=\"0\" scrolling=\"no\" style=\"display:none;\"></iframe>").appendTo("body");
			}
		}
		
		if(!config.body){
			$(document).ready(function(){
				initialize();
			});
			while(!config.body){continue;}
		}
		
		if(typeof option=="string"){config.bgColor = option;}
		else if(option){
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
		/*显示对话框*/
		show:function(){
			config.fullScreen.show();
			if(config.ie6) config.iframe.show();
			config.object.show(1, function(){
				setPosition();
				if ( 'function'===typeof(config.fn) ) config.fn();
			});
		},
		hide:function(fn){
			if(!config.object) return false;
			config.fullScreen.hide();
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
	
	/*设置当前对话框的位置，默认在屏幕中间*/
	var setPosition = function(){
		var coord = {
			left:((config.winOffset.width-config.object.outerWidth())/2)+config.window.scrollLeft()+"px",
			top:((config.winOffset.height-config.object.outerHeight())/2)+config.window.scrollTop()+"px"
		};
		
		if(config.ie6)
		{
			config.iframe.css({
				"width":config.object.outerWidth(),
				"height":config.object.outerHeight(),
				"position":"absolute",
				"left":coord.left,
				"top":coord.top,
				"zIndex":"99996"
			});
			
			config.object.css({
				"position":"absolute",
				"left":coord.left,
				"top":coord.top,
				"zIndex":"99997"
			});
		}
		else
		{
			config.object.css({
				"position":"fixed",
				"left":(config.winOffset.width-config.object.outerWidth())/2+"px",
				"top":(config.winOffset.height-config.object.outerHeight())/2+"px",
				"zIndex":"99997"
			});
		}
		config.init = true;
	};
	
	
	var realTime = function(){
		initialize();
		fullScreen();
		setPosition();
	}
})(jQuery);