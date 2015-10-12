// JavaScript Document

(function($){
	$.fn.showTag = function(options) {
		//设置默认的参数s
		var defaults = {
			rbox:$('body'), //position：relative的框
			msg:'提示的信息' , //提示的信息
			l:($(window).width()-500)/2+"px",
			t:($(window).height())/3+"px",
			w:'500px',
			h:'200px',
			pos:'fixed',
			time:'1500',
			ff:function(){}
		};

		var opts = $.extend(defaults, options);

		//执行的代码
		$("#showtag").remove();
		at(opts.rbox,opts.msg,opts.t,opts.l,opts.w,opts.h,opts.pos);//调用内部的函数
		window.setTimeout(function(){
			$("#showtag").fadeOut(function(){
				$(this).remove();
				opts.rbox.css({'position':''});
				opts.ff();
			})
		}, opts.time);
	};

	//本类内部的方法
	var at=function(R,msg,t,l,w,h,pos){
		R.css({'position':'relative'}).append("<div id='showtag' style='position:"+pos+"; z-index:1000; width:"+w+"; height:"+h+"; top:"+t+"; left:"+l+";'><table><tr><td>"+msg+"</td></tr></table></div>");
	}
})(jQuery);