// JavaScript Document
//
// +------------------------------------------------------------------------------------------------+
// | jQuery 1.7.2																					|
// +------------------------------------------------------------------------------------------------+
// | Copyright (c) 2008-2015 www.nongji360.com														|
// +------------------------------------------------------------------------------------------------+
// | 倒计时功能，然后用callback()函数来校验值														|
// | Author: zhangxp 719655765@qq.com														|
// +------------------------------------------------------------------------------------------------+
//
// jquery.countdown.js, V 2015.0818.1
	// ****************创建插件开始******************
	(function($){
	$.fn.countDown = function(options) {  
	//设置默认的参数s      
		var defaults = {  
			time:10,//用秒数计算
			text:"秒后可再次获取",//显示文本 默认为空
			refreshTime:1000,//刷新频率 默认是1秒一刷新 
			callstart:function($params){},	 //点击操作的时候运行的函数
			callback: function($params){}    //回调函数     
		};     
		//设置默认的参数e
		var opts = $.extend(defaults, options);  
		//执行的代码s	
		var $t=	opts.time;
		var $this=this;
		opts.callstart($this);
		callrun($this,$t);
		//执行的代码e		
		
		function callrun($obj,$time){
			$obj.prop('disabled',true).val($time--+""+opts.text);		
			refrsh($obj,$time);
		}	
		function refrsh($obj,$time) {
			setTimeout(function(){		
				if(0==$time){	
					opts.callback($obj);			
				}
				else{			
					callrun($obj,$time);
				}
			},1000);
		}	
		return this;	
	}; 		
	})(jQuery);  