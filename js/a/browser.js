/**
 * @purpose 判断浏览器以及版本
 * @author zhangheng
 * @created 2014-07-09 14:56
 * @updated 2015-05-05 15:06
 * @usage Browser.browser 浏览器名称
 *			Browser.version 浏览器版本
 *			Browser.msie 是否是IE浏览器
 */



var userAgent = navigator.userAgent.toLowerCase();


function userAgentMatch()
{
	var rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
		rFirefox = /(firefox)\/([\w.]+)/,
		rOpera = /(opera).+version\/([\w.]+)/,
		rChrome = /(chrome)\/([\w.]+)/,
		rSafari = /version\/([\w.]+).*(safari)/,
		rUC = /(ucbrowser)\/([\w.]+)/,
		rMqq = /(qqbrowser)\/([\w.]+)/,
		rQQ = /(qq)\/([\w.]+)/,
		rBaiDu = /(bidubrowser)\/([\w.]+)/,
		rBaiDuBox = /(baidubox)app\/([\w.]+)/;

	var match = rMsie.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':'msie', 'version':parseFloat(match[2]) || ''};
	}

	match = rUC.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	match = rMqq.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	match = rQQ.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	match = rBaiDuBox.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	match = rBaiDu.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':'baidubrowser', 'version':match[2] || ''};
	}

	match = rFirefox.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':parseFloat(match[2]) || ''};
	}

	match = rChrome.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	match = rSafari.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[2] || '', 'version':match[1] || ''};
	}

	match = rOpera.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || ''};
	}

	return {'browser':'', 'version':''};
}

window['Browser'] = {};
(function(){
	if ( Browser.browser ) return;
	window.Browser = userAgentMatch();

	Browser.msie = 'msie'==Browser.browser;
	Browser.chrome = 'chrome'==Browser.browser;
	Browser.safari = 'safari'==Browser.browser;
	Browser.firefox = 'firefox'==Browser.browser;
	Browser.opera = 'opera'==Browser.browser;
	Browser.uc = 'ucbrowser'==Browser.browser;
	Browser.qq = 'qqbrowser'==Browser.browser || 'qq'==Browser.browser;
	Browser.baidu = 'baidubrowser'==Browser.browser;
	Browser.baidu = 'baidubox'==Browser.browser;
	Browser.mozilla = 'Gecko'==window.navigator.product;
	Browser.netscape = 'Netscape'==window.navigator.vendor;
})();