/*
**	投票+1放大显示功能
**	Author: zhangxp
**	Copyright (c) 2014 www.nongji360.com,All Rights Reserved
**	Created: 2014-05-16
**	Modified: 2014-05-16
**	Version: 2014.0516.1
*/
// ****************使用方法******************
/*$(document).ready(function(){
	//调用插件开始
		$.tipsBox({
						obj: $this,
						str: "<b style='font-family:Microsoft YaHei;'>+1</b>",
						interval:500,
						callback: function() {
							//alert(5);
						}
					});
	//调用插件结束
	})*/

// ****************创建插件开始******************
 (function($) {
        $.extend({
            tipsBox: function(options) {
                options = $.extend({
                    obj: null,  //jq对象，要在那个html标签上显示
                    str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                    startSize: "12px",  //动画开始的文字大小
                    endSize: "30px",    //动画结束的文字大小
                    interval: 600,  //动画时间间隔
                    color: "red",    //文字颜色
                    callback: function() {}    //回调函数
                }, options);
                $("body").append("<span class='num'>"+ options.str +"</span>");
                var box = $(".num");
                var left = options.obj.offset().left + options.obj.width() / 2;
                var top = options.obj.offset().top - options.obj.height();
                box.css({
                    "position": "absolute",
                    "left": left + "px",
                    "top": top + "px",
                    "z-index": 9999,
                    "font-size": options.startSize,
                    "line-height": options.endSize,
                    "color": options.color
                });
                box.animate({
                    "font-size": options.endSize,
                    "opacity": "0",
                    "top": top - parseInt(options.endSize) + "px"
                }, options.interval , function() {
                    box.remove();
                    options.callback();
                });
            }
        });
    })(jQuery);

// ****************创建插件结束******************