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
	'<div style="line-height:26px;padding:5px 10px;background:#feff99;border:solid #ffba43 1px;font-size:16px;text-align:center;">{message}</div>',
	'<div data-rel-inform="true" style="width:auto;max-width:65%;padding:10px 20px;background:rgba(0,0,0,0.7);border-radius:30px;color:#fff;text-align:center;font-size:1.3em;font-weight:500;line-height:1.5em;">{message}</div>'
];


/**
 * @purpose 提示消息自动隐藏
 * @param message string 提示消息
 * @param fn function 消息框隐藏回调函数
 * @param theme int | string 主题模版，数字则调用预置主题模版，字符串即自定义主题模版
 * @author zhangheng
 * @created 2014-07-09 15:17
 */
function inform(message, fn, theme)
{
	if ( undefined==message ) message = '设置成功';
	if ( undefined!=fn && 'function'!=typeof(fn) && undefined==theme )
	{
		theme = fn;
	}
	if ( undefined==theme ) theme = 0;
	if ( /^[\d]+$/.test(theme) ) theme = themeInform[parseInt(theme)];
	theme = theme.replace('{message}', message);

	var $box=$(theme).appendTo($('body')), $window=$(window);
	$box.css({'position':'fixed', 'zIndex':99999});
	var boxWidth=$box.outerWidth(), boxHeight=$box.outerHeight(),
		marginHorizontal=($window.width()-boxWidth)/2,
		marginVertical=($window.height()-boxHeight)/2;

	/**
	 * @purpose 设置消息框位置
	 */
	var _ie6 = $.browser ? ( $.browser.msie && $.browser.version<7 ) :
		( window['Browser'] && Browser.msie && Browser.version<7 );
	if ( _ie6 )
	{
		$box.css({
			'position':'absolute', 'top':marginVertical+$window.scrollTop()+'px',
			'left':marginHorizontal+$window.scrollLeft()+'px'
		});
	}
	else
	{
		$box.css({'top':marginVertical+'px', 'left':marginHorizontal+'px'});
	}

	window.setTimeout(function(){
		$box.fadeOut(500, function(){
			$box.remove();
			if ( 'function'==typeof(fn) ) fn();
		});
	}, 1500);
}


/**
 * @purpose 提示消息自动隐藏
 * @param data object 提示消息
 * @param formId string form表单ID
 * @author zhangheng
 * @created 2017-12-05 10:28
 */
function informCallback(data, formId)
{
	var theme = themeInform[0],
		message = '', $field = null;

	if ( undefined!=data.field )
	{
		if ( undefined==formId )
		{
			$field = $('[name="'+data.field+'"]');
		}
		else if ( 'object'==typeof(formId) )
		{
			$field = formId.find('[name="'+data.field+'"]');
		}
		else
		{
			$field = $('#'+formId+' [name="'+data.field+'"]');
		}
	}

	if ( undefined!=data.code )
	{
		message = '错误代码：'+data.code;
		if ( IDENTIFY==data.code )
		{
			if ( null!=$field )
			{
				$field.val('');
			}
		}
	}
	if ( undefined!=data.message )
	{
		message = data.message;
	}
	else
	{
		message = '未知错误';
	}
	theme = theme.replace('{message}', message);

	var $box=$(theme).appendTo($('body')), $window=$(window);
	$box.css({'position':'fixed', 'zIndex':99999});
	var boxWidth=$box.outerWidth(), boxHeight=$box.outerHeight(),
		marginHorizontal=($window.width()-boxWidth)/2,
		marginVertical=($window.height()-boxHeight)/2;

	$box.css({'top':marginVertical+'px', 'left':marginHorizontal+'px'});

	var setFocus = function()
	{
		if ( null!=$field )
		{
			if ( 1==$field.size() )
			{
				$field.focus();
			}
			else
			{
				$($field.get(0)).focus();
			}
		}
	};

	window.setTimeout(function(){
		$box.fadeOut(500, function(){
			$box.remove();
			if ( undefined!=data.redirect )
			{
				window.location.href = data.redirect;
			}
			else
			{
				if ( undefined!=data.code && NO_LOGIN==data.code )
				{
					if ( 'function'==typeof(data.loginCallback) )
					{
						data.loginCallback(data);
					}
					else
					{
						var cryptUrl = window.CRYPT_URL ? window.CRYPT_URL :
							(data.REQUEST_URI ? data.REQUEST_URI.cryptUrl : '');
						window.location.href = HTTP_MOBILE_USER + '/auth/signin'+
							(cryptUrl ? '?uri='+cryptUrl : '');
					}
					return false;
				}
				setFocus();
			}
		});
	}, 1000);
}