var bFlagCallLogin = false;



/**
 * @purpose 登录验证执行函数
 * @author zhangheng
 * @created 2015-05-25 15:26
 */
function ajaxLogin(formId)
{
	var delayed = function($label, tip)
	{
		$label.val('').attr('placeholder', tip);
	};

	var $form=$('#'+(undefined==formId ? 'loginForm' : formId)),
		$authid=$form.find('#authid'), $password=$form.find('#password'),
		authid=$authid.val(), password=$password.val(),
		flag=true, $nextAuthid, $nextPassword, tip;

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

	$nextAuthid = $authid.next('div');
	/*if ( 0==$nextAuthid.size() )
	{
		$nextAuthid = $('<div class="next_tip"></div>').insertAfter($authid);
	}*/
	$nextPassword = $password.next('div');
	/*if ( 0==$nextPassword.size() )
	{
		$nextPassword = $('<div class="next_tip"></div>').insertAfter($password);
	}*/

	if ( ''==authid )
	{
		$authid.focus();
		tip = '请输入您的登录名';
		if ( 0==$nextAuthid.size() )
		{
			delayed($authid, tip);
		}
		else
		{
			$nextAuthid.html(tip);
		}
		flag = false;
	}
	else if ( !/^[a-zA-Z0-9]{4,16}$/.test(authid) )
	{
		$authid.focus();
		tip = '用户名由4~16位字母和数字混合组成';
		if ( 0==$nextAuthid.size() )
		{
			delayed($authid, tip);
		}
		else
		{
			$nextAuthid.html(tip);
		}
		flag = false;
	}
	if ( ''==password )
	{
		tip = '请输入登录密码';
		if ( true===flag )
		{
			$password.focus();
			if ( 0==$nextPassword.size() )
			{
				delayed($password, tip);
			}
		}
		if ( $nextPassword.size()>0 )
		{
			$nextPassword.html(tip);
		}
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
				if ( 'function' == typeof setCookie )
				{
					setCookie('NJSESSID', data.NJSESSID);
				}

				var expire = 20*60;
				setCookie('newWebsiteUser', data.loginname, expire, '/', data.domain);
				setCookie('xtype', data.xtype, expire, '/', data.domain);

				if ( SHARE_DOMAIN && SHARE_DOMAIN.length>0 )
				{
					var flagN = 0;
					for ( var i=0; i<SHARE_DOMAIN.length; i++ )
					{
						$.getScript(SHARE_DOMAIN[i]+'?NJSESSID='+data.NJSESSID+'&newWebsiteUser='+data.loginname+'&xtype='+data.xtype, function(){
							if ( ++flagN>=SHARE_DOMAIN.length )
							{
								window.location.href = (undefined==data.redirect || '.'==data.redirect) ?
									window.location.href : data.redirect;
							}
						});
					}
				}
				else
				{
					window.location.href = (undefined==data.redirect || '.'==data.redirect) ?
						window.location.href : data.redirect;
				}
			}
			else
			{
				ajaxCallback(data, undefined);
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback() {}