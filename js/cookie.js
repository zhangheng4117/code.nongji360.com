/**
 * @purpose 设置Cookie
 * @param name string Cookie名
 * @param value string Cookie值
 * @param expire integer Cookie有效期，单位：秒，默认为0(即浏览器关闭消失)，多少秒以后过期
 * @param path string Cookie的服务器路径，默认为根(/)
 * @param domain string Cookie的域名，默认为当前域名
 * @author zhangheng
 */
function setCookie(name, value, expire, path, domain)
{
	if ( undefined==expire || isNaN(parseFloat(expire)) )
	{
		expire = 0;
	}
	expire = parseFloat(expire);
	
	if ( undefined==path )
	{
		path = "/";
	}
	
	/**
	 * @purpose 域名字符串
	 * @var string
	 */
	var _domainString = "";
	if ( undefined!=domain && null!=domain )
	{
		_domainString = ";domain="+domain;
	}
	
	/**
	 * @purpose 有效期字符串
	 * @var string
	 */
	var _expString = "";
	if ( 0!=expire )
	{
		var _expDate = new Date();
		_expDate.setTime(_expDate.getTime()+expire*1000);
		_expString = ";expires="+_expDate.toGMTString();
	}
	
	document.cookie = name+"="+escape(value)+_expString+";path="+path+_domainString;
}


/**
 * @purpose 根据Cookie名获取Cookie值
 * @param name string Cookie名
 * @return string Cookie值
 * @author zhangheng
 */
function getCookie(name)
{
	/**
	 * @purpose 所有cookie集合
	 * @var string
	 */
	var _cookies = document.cookie;
	var reg = new RegExp('(^|; )'+ name +'=([^;]*)(;|$)', 'i');
	if( reg.test(_cookies) )
		return unescape(RegExp.$2);
	return '';
}