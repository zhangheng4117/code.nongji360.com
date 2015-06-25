/**
 * @Purpose: 提示消息自动隐藏
 * @Author: zhangheng
 * @Created: 2014-07-09 15:17
 * @Usage: inform('Hello');
 			inform('Hello', function(){null});
			inform('Hello', function(){null}, 0);
			inform('Hello', null, '<div>{message}</div>');
 */


/**
 * @Purpose: 提示消息主题模版
 * @Type: array
 */
var themeInform = [
	'<div style="height:40px;line-height:40px;padding:0 10px;background:#feff99;border:solid #ffba43 1px;font-size:16px;text-align:center;">{message}</div>'
];


/**
 * @Purpose: 提示消息自动隐藏
 * @Param: string message 提示消息
 * @Param: function 消息框隐藏回调函数
 * @Param: int | string 主题模版，数字则调用预置主题模版，字符串即自定义主题模版
 * @Author: zhangheng
 * @Created: 2014-07-09 15:17
 */
function inform(message, fn, theme)
{
	if ( undefined==message ) message = '设置成功';
	if ( undefined==theme ) theme = 0;
	if ( /^[\d]+$/.test(theme) ) theme = themeInform[parseInt(theme)];
	theme = theme.replace('{message}', message);
	
	var $box=$(theme).appendTo($('body')), $window=$(window);
	$box.css({'position':'fixed', 'zIndex':99999});
	var boxWidth=$box.outerWidth(), boxHeight=$box.outerHeight(),
		marginHorizontal=($window.width()-boxWidth)/2,
		marginVertical=($window.height()-boxHeight)/2;
	
	/**
	 * @Purpose: 设置消息框位置
	 */
	var _ie6 = $.browser ? ( $.browser.msie && $.browser.version<7 ) : ( window['Browser'] && Browser.msie && Browser.version<7 );
	if ( _ie6 )
	{
		$box.css({'position':'absolute', 'top':marginVertical+$window.scrollTop()+'px', 'left':marginHorizontal+$window.scrollLeft()+'px'});
	}
	else
	{
		$box.css({'top':marginVertical+'px', 'left':marginHorizontal+'px'});
	}
	
	window.setTimeout(function(){
		$box.fadeOut(1000, function(){
			$box.remove();
			if ( 'function'==typeof(fn) ) fn();
		});
	}, 2000);
}