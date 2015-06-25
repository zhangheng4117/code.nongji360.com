/**
 * @Purpose: 判断浏览器以及版本
 * @Author: zhangheng
 * @Created: 2014-07-09 14:56
 * @Usage: Browser.browser 浏览器名称
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
		rSafari = /version\/([\w.]+).*(safari)/;
	
	var match = rMsie.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':'msie', 'version':parseFloat(match[2]) || 0};
	}
	
	match = rChrome.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || '0'};
	}

	match = rFirefox.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':parseFloat(match[2]) || 0};
	}
	
	match = rSafari.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[2] || '', 'version':match[1] || '0'};
	}

	match = rOpera.exec(userAgent);
	if ( null!=match )
	{
		return {'browser':match[1] || '', 'version':match[2] || '0'};
	}

	return {'browser':'', 'version':'0'};
}

window['Browser']={};
(function(){
	if(Browser.browser) return;
	Browser = userAgentMatch();
	
	Browser.browser = Browser.browser;
	Browser.version = Browser.version;
	Browser.msie = 'msie'==Browser.browser;
	Browser.chrome = 'chrome'==Browser.browser;
	Browser.safari = 'safari'==Browser.browser;
	Browser.firefox = 'firefox'==Browser.browser;
	Browser.opera = 'opera'==Browser.browser;
	Browser.mozilla = 'Gecko'==window.navigator.product;
	Browser.netscape = 'Netscape'==window.navigator.vendor;
})();