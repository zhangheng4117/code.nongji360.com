var bFlagCallLogin = false;



/**
 * @purpose 登录验证执行函数
 * @author zhangheng
 * @created 2015-05-25 15:26
 */
function ajaxLogin(formId, fn)
{
	var delayed = function($label, tip)
	{
		$label.val('').attr('placeholder', tip);
	};

	var $form=$('#'+(undefined==formId ? 'loginForm' : formId)),
		$authid=$form.find('#authid'), $password=$form.find('#password'), $uniqueCode=$form.find('#unique_code'),
		authid=$authid.val(), password=$password.val(), uniqueCode=$uniqueCode.val(),
		flag=true, tip;

	if ( ''==uniqueCode )
	{
		if ( ''==authid )
		{
			$authid.focus();
			tip = '请输入您的登录名';
			inform(tip);
			flag = false;
		}
		else if ( !/^[a-zA-Z0-9]{4,16}$/.test(authid) && !RegEx.mobile(authid))
		{
			$authid.focus();
			tip = '用户名格式不正确';
			inform(tip);
			flag = false;
		}
		if ( ''==password )
		{
			tip = '请输入登录密码';
			if ( true===flag )
			{
				inform(tip);
			}
			flag = false;
		}
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
                if('function' == typeof fn )
                {
                    fn(data);
                }
				if ( 'function' == typeof setCookie )
				{
					setCookie('NJSESSID', data.NJSESSID, 0, '/', data.domain);
				}

				var expire = 20*60;
				setCookie('newWebsiteUser', data.loginname, expire, '/', data.domain);
				setCookie('xtype', data.xtype, expire, '/', data.domain);

				if ( SHARE_DOMAIN && SHARE_DOMAIN.length>0 )
				{
					var flagN = 0;
					for ( var i=0; i<SHARE_DOMAIN.length; i++ )
					{
						$.getScript(SHARE_DOMAIN[i] +
							'?NJSESSID='+data.NJSESSID+'&newWebsiteUser='+data.loginname+'&xtype='+data.xtype +
							'&saveAuthid='+getCookie('saveAuthid')+'&autoLoginStatus='+getCookie('autoLoginStatus') +
							'&autoLoginTime='+getCookie('autoLoginTime'), function(){
							if ( ++flagN>=SHARE_DOMAIN.length )
							{
								if ( 'no-jump'!==data.redirect )
								{
									window.location.href = (undefined==data.redirect || '.'==data.redirect) ?
										window.location.href : data.redirect;
								}
							}
						});
					}
				}
				else
				{
					if ( 'no-jump'!==data.redirect )
					{
						window.location.href = (undefined==data.redirect || '.'==data.redirect) ?
							window.location.href : data.redirect;
					}
				}
			}
			else
			{
				inform(data.message, fn);
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback() {}