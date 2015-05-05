//设为首页
function homePage(obj, startPage){
	if ( !startPage )
	{
		startPage = "http://"+document.domain;
		var sPort = location.port;
		if ( sPort!="" )
		{
			startPage = startPage+":"+sPort
		}
	}
	
	try
	{
		obj.style.behavior="url(#default#homepage)";
		obj.setHomePage(startPage);
	}
	catch ( e )
	{
		if ( window.sidebar )
		{
			if ( window.netscape )
			{
				try
				{
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref("browser.startup.homepage", startPage);
				}
				catch ( e )
				{
					alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config,然后将项 signed.applets.codebase_principal_support 值改为true" );
				}
			}
		}
	}
}


//加入收藏夹
function favorite(_title, _page){
	if( !_page )
	{
		_page = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=");
	}
	if ( !_title )
	{
		_title = document.title;
	}
	
	try
	{
		window.external.AddFavorite(_page, _title);
	}
	catch ( e )
	{
		try
		{
			window.sidebar.addPanel(_title, _page, "");
		}
		catch ( e )
		{
			alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
	}
}


//复制文本
function copy(txt){
	if ( window.clipboardData )
	{
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	}
	else if ( navigator.userAgent.indexOf("Opera")!=-1 )
	{
		window.location = txt;
	}
	else if ( window.netscape )
	{
		try
		{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
		catch ( e )
		{
			alert("被浏览器拒绝！\n请在浏览器地址栏输入 about:config并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
		}
		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
		if ( !clip ) return;
		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		if( !trans ) return;
		trans.addDataFlavor("text/unicode");
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length*2);
		var clipid = Components.interfaces.nsIClipboard;
		if ( !clip ) return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
	}
}