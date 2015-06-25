/*
**	双击显示输入框的插件(双击修改功能)
**	Author: zhangxp
**	Copyright (c) 2014 www.nongji360.com,All Rights Reserved
**	Created: 2014-05-13
**	Modified: 2014-05-13
**	Version: 2014.0513.1
*/
// ****************使用方法******************
/*$(document).ready(function(){
	//调用插件开始
		$("#mybox").Dbclick({
			okFun:function(e){
				e.html($(".upInput").val());
				}
			});
	//调用插件结束
	})*/

// ****************创建插件开始******************
(function($){//双击修改
$.fn.UpdateDbclick = function(options) {  
//设置默认的参数s      
  var defaults = {              
    parms: '', //参数
	UClass:'upInput',//双击后的输入框的class
	okFun: function(em){}   
  };     
//设置默认的参数e
var opts = $.extend(defaults, options);  
//执行的代码s
  $this=$(this);
  $(this).live("dblclick",function(){
	 	var $v=$(this).html();
		if($v.indexOf("INPUT")>0){
			}
		else{
			$(this).html("<input class='"+opts.UClass+"' rel='"+opts.parms+"' value='"+$v+"'>").find("."+opts.UClass+"").focus();
			}	
	  })
 $(this).find("."+opts.UClass+"").live("blur",function(){
	 opts.okFun($this);//当鼠标离开的时候处理的事件
	 }) 
//执行的代码e
//return this;
}; 
})(jQuery); 

// ****************创建插件结束******************