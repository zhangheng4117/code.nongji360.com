/**
 * @purpose AJAX执行成功回调函数
 * @param data json 页面返回信息
 * @param formId string form表单ID
 * @author zhangheng
 * @created 2014-06-16 16:40
 */
function ajaxCallback(data, formId)
{
	var message = '';
	if ( undefined!=data.code )
	{
		message = '错误代码：'+data.code+'！';
	}
	else if ( undefined!=data.message )
	{
		message = data.message;
	}
	else
	{
		message = '未知错误！';
	}
	jAlert(message, function(){
		if ( undefined!=data.field )
		{
			var $field = null;
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
			if ( 1==$field.size() )
			{
				$field.focus();
			}
			else
			{
				$($field.get(0)).focus();
			}
		}
	});
}


/**
 * @Purpose: 删除确认提示，点击取消则不执行删除操作
 * @param message string 提示消息
 * @Author: zhangheng
 * @Created: 2014-07-23 17:47
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
 * @Purpose: jQuery兼容版本1.9前live方法和之后的on方法
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
		return $('html').on(type, selector, fn);
	}
}


/**
 * @Purpose: 时间选择函数
 * @param selector string 时间控件选择器
 */
function datePicker(selector)
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
		}
	});
	return selector;
}


/**
 * @purpose 字数统计，并显示在后面
 * @param string | object selector jq对象或选择器
 * @param int count 允许的字数
 * @param boolean double 是否是双字节统计(如果为true则需要引用String.js库文件)
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