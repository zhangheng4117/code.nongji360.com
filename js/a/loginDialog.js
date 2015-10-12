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
		var newWebsiteUser = getCookie('newWebsiteUser'),
			xtype = getCookie('xtype');
		if ( ''==newWebsiteUser )
		{
			$('#loginBar').show();
			$('#loginSuccess').hide();
		}
		else
		{
			var expire = 20*60,
				domain = RegEx.ip(currentServer) ? null : currentServer.substr(currentServer.indexOf('.')+1);
			setCookie('newWebsiteUser', newWebsiteUser, expire, '/', domain);
			setCookie('xtype', xtype, expire, '/', domain);
			$('#loginBar').hide();
			$('#loginSuccess').show().children('b').html('<a href="'+HTTP_WWW+'/user/" style="margin:0 3px;">'+newWebsiteUser+'</a>');
		}
	}
}


(function(){
	var backUrl = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=").replace(/\?/g, ';;').replace(/\&/g, '.,').replace(/\#/g, '@*');
	$("#logoutBar").attr('href', (window.BASEURI || '/')+'cross/signout?backURL='+backUrl);
	currentServer = document.getElementsByTagName('script');
	currentServer = currentServer[currentServer.length-1].src;
	currentServer = currentServer.substr(0, currentServer.indexOf('/', 'http://'==currentServer.substr(0, 7) ? 7 : 0));
	
	
	var cssStr = '<style type="text/css">'+
		'.login-box{width:620px;height:315px;border:1px solid #ff8500;padding:20px 0;position:absolute;background-color:#fff;display:none;}\
		.login-box .login_l{float:left;width:180px; margin-left:50px;text-align:center;overflow:hidden;}\
		.login-box .login_l img:hover{margin-left:-186px;}\
		.login-box .close_icon{position:absolute;right:0;top:0;}\
		.login-box .login_r{text-align:center;float:right;width:348px;margin-top:20px;border-left:1px solid #eaeaea;}\
		.login-box .login_form{width:260px;margin:0 auto;}\
		.login-box .account{margin-top:15px;}\
		.login-box .account input#authid,.login-box .account input#password{width:255px;height:40px;line-height:40px;padding:0;border:1px solid #d0d0d0;border-radius:5px;font-size:16px;text-indent:5px;}\
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
				<img src="'+HTTP_CODE+'/images/ad_njb.gif" title="农机帮-用科技服务农业现代化" alt="农机帮-用科技服务农业现代化"/>\
			</div>\
			<div class="login_r">\
				<img src="'+HTTP_CODE+'/images/ad_njb_1.jpg" title="农机帮-找作业、找维修、找机手、找加油站、看天气、查补贴、看新闻、聊农机" alt="农机帮-找作业、找维修、找机手、找加油站、看天气、查补贴、看新闻、聊农机"/>\
				<div class="login_form">\
					<form id="loginForm">\
						<div class="account"><input type="text" id="authid" name="authid" class="placeholder" /><div></div></div>\
						<div class="account"><input type="password" id="password" name="password" class="placeholder" /><div></div></div>\
						<div class="find_pw"><a href="'+HTTP_WWW+'/user/find/find_pwd.asp?backURL='+backUrl+'">忘记密码？</a></div>\
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
	$form.find('.account input').bind('keyup', placeholder).bind('keypress', placeholder).bind('mouseover', placeholder);

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
	
	$('#loginBar').bind('click', fnLoginDialog);
	
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
		'url':HTTP_WWW+'/user/ajax_cross_logok.asp',
		'dataType':'jsonp',
		'crossDomain':true,
		'jsonpCallback':'jsonpCallback',
		'data':{'username':authid,'password':password,'NJSESSID':getCookie('NJSESSID')},
		'processData':true,
		'type':'get',
		'success':function(data){
			if ( "third"==data.referer )
			{
				alert("非法操作：不允许从本站以外的任何地方登录");
				return false;
			}
			if ( "http"==data.referer )
			{
				alert("非法操作：不允许不正常方式登录");
				return false;
			}
			if ( "regexp"==data.username )
			{
				alert("请输入正确用户名");
				$authid.focus();
				return false;
			}
			if ( "regexp"==data.password )
			{
				alert("请输入正确密码");
				$password.focus();
				return false;
			}
			if ( "no"==data.table )
			{
				alert("该用户名不存在，请检查用户名输入是否正确");
				$authid.focus();
				return false;
			}
			if ( "password"==data.table )
			{
				alert("密码输入错误，请重新输入密码");
				$password.val("").focus();
				return false;
			}
			if ( "3sec"==data.table )
			{
				alert("根据我们的综合判断，您属于非法登录，故我们已将您的用户信息删除\n如有疑问请联系我们客服");
				return false;
			}
			if ( "disable"==data.table )
			{
				alert("您的用户名已被禁止登录\n如有疑问请联系我们客服");
				return false;
			}

			$.jqDialog.hide();
			if ( ''!=data.username )
			{
				var expire = 20*60,
					domain = RegEx.ip(currentServer) ? null : currentServer.substr(currentServer.indexOf('.')+1);
				setCookie('newWebsiteUser', data.username, expire, '/', domain);
				setCookie('xtype', data.xtype, expire, '/', domain);

				if ( 'function'==typeof(fn) )
				{
					fn(data);
				}
				if ( 'function'==typeof($form.data('OAuthOnSuccess')) )
				{
					$form.data('OAuthOnSuccess')(data);
					$form.removeData('OAuthOnSuccess');
				}
			}
		},
		'error':function(XMLHttpRequest, textStatus, errorThrown){}
	});
}


function jsonpCallback(data) {}