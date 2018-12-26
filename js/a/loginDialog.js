var currentServer, fnLoginDialog;

/**
 * @purpose 设置登录按钮是否显示
 * @author zhangheng
 * @created 2014-12-23 17:20
 */
if ( 'function'!=typeof(innerLoginView) )
{
	var innerLoginView = function()
	{
		var newWebsiteUser = getCookie('newWebsiteUser'), xtype = getCookie('xtype'),
			$loginSuccess = $('#loginSuccess'), $loginBar = $('#loginBar');
		if ( ''==newWebsiteUser )
		{
			$loginBar.show();
			$loginSuccess.hide();
		}
		else
		{
			var expire = 20*60,
				domain = RegEx.ip(currentServer) ? null : currentServer.substr(currentServer.indexOf('.')+1);
			setCookie('newWebsiteUser', newWebsiteUser, expire, '/', domain);
			setCookie('xtype', xtype, expire, '/', domain);
			$loginBar.hide();
			var $children = $loginSuccess.show().children('b'),
				userUrl = !!$children.data('url') ? $children.data('url') : HTTP_USER;
			$children.html('<a href="'+userUrl+'" style="margin:0 3px;">'+newWebsiteUser+'</a>');
		}
	}
}


(function(){
	var $loginFormDialog = $('#loginFormDialog');
	if ( $loginFormDialog.size()>0 ) return false;

	var backUrl = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=").replace(/\?/g, ';;').replace(/\&/g, '.,').replace(/\#/g, '@*');
	$('#registerBar').attr('href', HTTP_WWW+'/user/reg.asp?backURL='+backUrl);
	$("#logoutBar").attr('href', (window.BASEURI || '/')+'cross/signout?backURL='+backUrl);
	currentServer = document.getElementsByTagName('script');
	currentServer = currentServer[currentServer.length-1].src;
	currentServer = currentServer.substr(0, currentServer.indexOf('/', 'http://'==currentServer.substr(0, 7) ? 7 : 0));
	
	
	var cssStr = '<style type="text/css">'+
		'.login-box{width:620px;height:280px;border:1px solid #ff8500;padding:35px 0;position:absolute;background-color:#fff;display:none;}\
		.login-box .login_l{float:left;width:236px; margin:20px 0px 0px 20px;text-align:center;overflow:hidden;}\
		.login-box .close_icon{position:absolute;right:0;top:0;}\
		.login-box .login_r{text-align:center;float:right;width:348px;margin-top:20px;border-left:1px solid #eaeaea;}\
		.login-box .login_form{width:260px;margin:0 auto;}\
		.login-box .account{margin-top:15px;}\
		.login-box .account input#authid,.login-box .account input#password{width:255px;height:40px;line-height:40px;padding:0;border:1px solid #d0d0d0;border-radius:5px;font-size:16px;text-indent:5px;outline:none;}\
		.login-box .account div{margin:2px 0 0 5px;text-align:left;color:#f00;font-size:12px;}\
		.login-box .find_pw{width:265px;text-align:right;margin:0 auto;line-height:30px;}\
		.login-box .login_button{font-size:18px;text-align:left;width:265px;margin:0 auto;}\
		.login-box .login_button input{background-color:#ec600b;width:80px;height:40px;line-height:40px;border:0;font-size:18px;color:#FFF;margin-right:10px;}\
		.login-box #authid.placeholder{background:url('+currentServer+'/images/text_bg.gif) no-repeat 0 0;}\
		.login-box #password.placeholder{background:url('+currentServer+'/images/text_pwd.gif) no-repeat 0 0;}\
		</style>';

	var htmlStr = '<div class="login-box" id="loginFormDialog">\
			<div class="close_icon"><a href="javascript:" target="_self" rel="close"><img src="'+HTTP_CODE+'/images/close_icon.gif"/></a></div>\
			<div class="login_l">\
				<img src="'+HTTP_CODE+'/images/dt_service.gif" title="大田农社农事服务中心-一站式服务，让农事无忧" alt="大田农社农事服务中心-一站式服务，让农事无忧"/>\
			</div>\
			<div class="login_r">\
				<img src="'+HTTP_CODE+'/images/dt_slogan.gif" title="大田农社农事服务中心-一站式服务，让农事无忧" alt="大田农社农事服务中心-一站式服务，让农事无忧"/>\
				<div class="login_form">\
					<form id="loginForm">\
						<div class="account"><input type="text" id="authid" name="authid" class="placeholder" /><div></div></div>\
						<div class="account"><input type="password" id="password" name="password" class="placeholder" /><div></div></div>\
						<div class="find_pw"><a href="'+HTTP_USER+'/reg/find?c=N&amp;uri='+backUrl+'">忘记密码？</a></div>\
						<div class="login_button">\
							<input type="submit" value="登录" />\
							<a href="'+HTTP_WWW+'/user/reg.asp?backURL='+backUrl+'" target="_self">会员注册</a>\
						</div>\
					</form>\
				</div>\
			</div>\
		</div>';
	
	document.writeln(cssStr + htmlStr);
	
	currentServer = currentServer.replace('http://', '').replace(/:[\d]+$/, '');
	innerLoginView();
	
	/**
	 * @purpose 设置文本框的占位符
	 * @author zhangheng
	 * @created 2014-12-24 10:45
	 */
	function placeholder()
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
	}

	var $dialog=$('#loginFormDialog'), $form=$dialog.find('#loginForm');
	$form.find('.account input').bind('keyup', placeholder).bind('keypress', placeholder)
		.bind('mouseover', placeholder);

	fnLoginDialog = function(OAuthOnSuccess)
	{
		$dialog.dialog({'fn':function(){
			$form.find('#authid').focus();
			if ( 'function'==typeof(OAuthOnSuccess) )
			{
				$form.data('OAuthOnSuccess', OAuthOnSuccess);
			}
		}});
	};

	var $loginBar = $('#loginBar');
	if ( $loginBar.find('a').size()>0 )
	{
		$loginBar = $loginBar.find('a:eq(0)');
	}
	$loginBar.bind('click', fnLoginDialog);
	
	$form.bind('submit', function(){
		ajaxLoginDialog(innerLoginView);
		
		return false;
	});
})();


/**
 * @purpose 登录验证执行函数
 * @param fn function 登录成功后回调函数
 * @author zhangheng
 * @created 2014-12-23 10:05
 */
function ajaxLoginDialog(fn)
{
	var $form=$('#loginFormDialog').find('#loginForm'),
		$authid=$form.find('#authid'), $password=$form.find('#password'),
		authid=$authid.val(), password=$password.val(),
		flag=true;
	
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
		'url':HTTP_WWW+'/user/ajax_cross_my_logok.asp',
		'dataType':'jsonp',
		'crossDomain':true,
		'jsonpCallback':'jsonpCallback',
		'data':{'authid':authid,'password':password,'NJSESSID':getCookie('NJSESSID')},
		'processData':true,
		'type':'get',
		'success':function(data){
			if ( undefined==data.status )
			{
				alert("系统异常");
				return false;
			}
			if ( 100000==data.status )
			{
				alert(undefined!=data.message && ""!=data.message ? data.message : "登录失败");
				if ( undefined!=data.field && ""!=data.field )
				{
					$form.find("#"+data.field).focus();
				}
				return false;
			}
			else
			{
				var expire = 20*60,
					domain = RegEx.ip(currentServer) ? null : currentServer.substr(currentServer.indexOf('.')+1);
				setCookie('newWebsiteUser', authid, expire, '/', domain);
				setCookie('xtype', data.xtype, expire, '/', domain);

				var $backURL = $form.find('#backURL'), jumpUrl = $backURL.size()>0 ? $backURL.val() : null;
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
								if ( undefined!=$.jqDialog ) $.jqDialog.hide();
								if ( 'function'==typeof(fn) )
								{
									fn(data);
								}
								if ( 'function'==typeof($form.data('OAuthOnSuccess')) )
								{
									$form.data('OAuthOnSuccess')(data);
									$form.removeData('OAuthOnSuccess');
								}

								if ( null!=jumpUrl )
								{
									window.location.href = ""==jumpUrl ? "/user/" : jumpUrl;
								}
							}
						});
					}
				}
				else
				{
					if ( undefined!=$.jqDialog ) $.jqDialog.hide();
					if ( 'function'==typeof(fn) )
					{
						fn(data);
					}
					if ( 'function'==typeof($form.data('OAuthOnSuccess')) )
					{
						$form.data('OAuthOnSuccess')(data);
						$form.removeData('OAuthOnSuccess');
					}

					if ( null!=jumpUrl )
					{
						window.location.href = ""==jumpUrl ? "/user/" : jumpUrl;
					}
				}
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback(data) {}