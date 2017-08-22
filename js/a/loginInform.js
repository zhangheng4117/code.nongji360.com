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
		$authid=$form.find('#authid'), $password=$form.find('#password'),
		authid=$authid.val(), password=$password.val(),
		flag=true, tip;

	if ( ''==authid )
	{
		$authid.focus();
		tip = '请输入您的登录名';
        inform(tip);
		flag = false;
	}
	else if ( !/^[a-zA-Z0-9]{4,16}$/.test(authid) )
	{
		$authid.focus();
		tip = '用户名由4~16位字母和数字混合组成';
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
                    fn();
                }
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
				inform(data.message, fn);
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback() {}