// JavaScript Document
//
// +------------------------------------------------------------------------------------------------+
// | jQuery 1.7.2																					|
// +------------------------------------------------------------------------------------------------+
// | Copyright (c) 2008-2014 www.nongji360.com														|
// +------------------------------------------------------------------------------------------------+
// | 及时返回text的值 然后用callback()函数来校验值  类似验证码															|
// | Author: zhangxp 719655765@qq.com														|
// +------------------------------------------------------------------------------------------------+
//
// jquery.float.js, V 2014.0818.1
	//text 值 及时验证 包括验证码
	//返回的是 text的值
	// ****************创建插件开始******************
	(function($){
	$.fn.validtext = function(options) {  
	//设置默认的参数s      
	  var defaults = {         
		callback: function($txt) {}    //回调函数     
	  };     
	//设置默认的参数e
	var opts = $.extend(defaults, options);  
	//执行的代码s
	$(this).live("keyup blur mouseup paste",function(event){
		  if(event.type=='paste'){
			  if(window.clipboardData){//IE 鼠标粘贴事件触发
				  opts.val=window.clipboardData.getData("Text")
				  }
			  else{
				  opts.val=event.originalEvent.clipboardData.getData("Text")
				  }
			  
		  }else{			
				  opts.val=$(this).val();
		  }	
		  opts.callback(opts.val);
	})	
	//执行的代码e
	return this;
	}; 	
	})(jQuery);  