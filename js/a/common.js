/**
 * @purpose AJAX执行成功回调函数
 * @param data json 页面返回信息
 * @param formId string form表单ID
 * @author zhangheng
 * @created 2014-06-16 16:40
 */
function ajaxCallback(data, formId)
{
	if ( undefined!=data.redirect )
	{
		window.location.href = data.redirect;
		return false;
	}

	var message = '';
	var $field = null;
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
		if ( NO_LOGIN==data.code && 'function'==typeof(ajaxLoginDialog) )
		{
			fnLoginDialog();
			return false;
		}
		message = '错误代码：'+data.code;
		if ( IDENTIFY==data.code )
		{
			if ( null!=$field )
			{
				$field.val('');
			}
		}
	}
	else if ( undefined!=data.message )
	{
		message = data.message;
	}
	else
	{
		message = '未知错误！';
	}

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
	if ( 'function'==typeof(jAlert) )
	{
		jAlert(message, function(){
			if ( data.redirect )
			{
				window.location.href = data.redirect;
			}
			else
			{
				setFocus();
			}
		});
	}
	else
	{
		alert(message);
		if ( data.redirect )
		{
			window.location.href = data.redirect;
		}
		setFocus();
	}
}


/**
 * @Purpose: 删除确认提示，点击取消则不执行删除操作
 * @param message string 提示消息
 * @author zhangheng
 * @created 2014-07-23 17:47
 */
function confirmDelete(message)
{
	if ( undefined==message )
	{
		message = '您确认要删除此信息？';
	}
	
	$('a[rel="del"]').bind('click', function(){
		var $this = $(this);
		jConfirm(message, function(ret){
			if ( ret )
			{
				window.location.href = $this.attr('href');
			}
		});
		return false;
	});
}


/**
 * @purpose jQuery兼容版本1.9前live方法和之后的on方法
 * @param selector string 选择器
 * @param type string 附加到元素的事件类型
 * @param fn function 事件函数名
 */
function live(selector, type, fn)
{
	if ( 'function'==typeof($.fn.live) )
	{
		return $(selector).live(type, fn);
	}
	else
	{
		$.extend($(document), $('html')).on(type, selector, fn);
		return $(selector);
	}
}


/**
 * @purpose 时间选择函数
 * @param selector string 时间控件选择器
 * @param callback function 回调函数
 */
function datePicker(selector, callback)
{
	if ( 'string'==typeof(selector) ) selector = $(selector);
	selector.DatePicker({
		'date':selector.val(),
		'current':selector.val(),
		'onBeforeShow':function(){
			selector.DatePickerSetDate(selector.val());
		},
		'onChange':function(formated){
			selector.val(formated);
			selector.DatePickerHide();

			if ( 'function'==typeof(callback) )
			{
				callback(selector, formated);
			}
		}
	});
	return selector;
}


/**
 * @purpose 字数统计，并显示在后面
 * @param selector string | object jq对象或选择器
 * @param count int 允许的字数
 * @param double boolean 是否是双字节统计(如果为true则需要引用String.js库文件)
 * @author zhangheng
 * @created 2014-12-24 18:36
 */
function wordCount(selector, count, double)
{
	if ( 'string'==typeof(selector) ) selector = $(selector);
	var numSpan = selector.next('span[rel="wordCount"]');
	if ( 0==numSpan.size() )
	{
		numSpan = $('<span rel="wordCount"></span>').insertAfter(selector);
	}
	
	function stat()
	{
		numSpan.html((true===double ? selector.val().len() : selector.val().length)+'/'+count);
	}
	stat();
	
	selector.bind('keyup', stat).bind('keypress', stat).bind('mouseover', stat).bind('focus', stat);
}


/**
 * @purpose jq滚动页面至指定位置
 * @param selector int | object
 * @param offset int 偏移量
 * @author zhangheng
 * @created 2016-01-15 13:44
 */
function scrollToElement(selector, offset)
{
	var top = ('number'==typeof(selector) ? selector : selector.offset().top);
	if ( undefined!=offset ) top += offset;
	$('html,body').animate({"scrollTop":top+'px'}, 200);
}

/**
 * @purpose 收藏
 * @param parameters object
 * @param fn function 回调函数
 * @author zhangheng
 * @created 2016-04-01 11:17
 */
function favorite(parameters, fn)
{
	if ( 'object'!=typeof(parameters) ) return false;

	$.post((window.BASEURI || '/')+'gajax/favorite', parameters, function(res){
		if ( 'function'==typeof(fn) )
		{
			fn(res);
		}
	}, 'json');
}


/**
 * @purpose 判断是否是农机帮方法
 * @param fn string 方法名
 * @return bool
 * @author zhangheng
 * @created 2016-06-23 17:19
 */
function isBangFunction(fn)
{
	return navigator.userAgent.indexOf('NongJiBang')>-1
		&& (undefined==fn ? true : 'function'==typeof fn);
}