// JavaScript Document
//
// +------------------------------------------------------------------------------------------------+
// | jQuery 1.7.2																					|
// +------------------------------------------------------------------------------------------------+
// | Copyright (c) 2008-2015 www.nongji360.com														|
// +------------------------------------------------------------------------------------------------+
// | 滑动延迟显示														|
// | Author: zhangxp 719655765@qq.com														|
// +------------------------------------------------------------------------------------------------+
//
// jquery.float.js, V 2014.0818.1
 
(function($){ 
$.fn.hoverDelay = function(options){ 
var defaults = { 
hoverDuring: 500, 
outDuring: 0, 
hoverEvent: function(t){ 
$.noop(); 
}, 
outEvent: function(t){ 
$.noop(); 
} 
}; 
var sets = $.extend(defaults,options || {}); 
var hoverTimer, outTimer; 
return $(this).each(function(){ 
var $this=$(this);
$(this).hover(function(){ 
clearTimeout(outTimer); 
hoverTimer = setTimeout(function(){
	sets.hoverEvent($this);
}, sets.hoverDuring); 
},function(){ 
clearTimeout(hoverTimer); 
outTimer = setTimeout(function(){
	sets.outEvent($this);
}, sets.outDuring); 
}); 
}); 
} 
})(jQuery); 

