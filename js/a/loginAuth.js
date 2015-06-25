var bFlagCallLogin = false;



/**
 * @purpose 登录验证执行函数
 * @author zhangheng
 * @created 2015-05-25 15:26
 */
function ajaxLogin(formId)
{
	var $form=$('#'+(undefined==formId ? 'loginForm' : formId)),
		$authid=$form.find('#authid'), $password=$form.find('#password'),
		authid=$authid.val(), password=$password.val(),
		flag=true;

	/**
	 * @purpose 如果是第一次调用登录方法则添加输入框事件
	 */
	if ( false===bFlagCallLogin )
	{
		var placeholder = function()
		{
			var $this = $(this);
			if ( ''==$this.val() )
			{
				$this.addClass('placeholder');
			}
			else
			{
				$this.removeClass('placeholder');
				$this.next('div').html('');
			}
		};

		$form.find('#authid,#password').bind('keyup', placeholder).bind('keypress', placeholder).bind('mouseover', placeholder);
		bFlagCallLogin = true;
	}

	if ( ''==authid )
	{
		$authid.focus();
		$authid.next('div').html('请输入您的用户名');
		flag = false;
	}
	else if ( !/^[a-zA-Z0-9]{4,16}$/.test(authid) )
	{
		$authid.focus();
		$authid.next('div').html('用户名由4~16位字母和数字混合组成');
		flag = false;
	}
	if ( ''==password )
	{
		if ( true===flag )
		{
			$password.focus();
		}
		$password.next('div').html('请输入您的登录密码');
		flag = false;
	}

	if ( false===flag )
	{
		return false;
	}

	$.ajax({
		'url':HTTP_AUTH+'/signin/login',
		'dataType':'jsonp',
		'crossDomain':true,
		'jsonpCallback':'jsonpCallback',
		'data':$form.serialize(),
		'processData':true,
		'type':'get',
		'success':function(data){
			if ( STATUS_SUCCESS==data.status )
			{
				window.location.href = (undefined==data.redirect || '.'==data.redirect) ? location.href : data.redirect;
			}
			else
			{
				ajaxCallback(data);
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback()
{

}