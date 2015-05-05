/**
 * @Purpose: 设置Cookie
 * @Param: string name Cookie名
 * @Param: string value Cookie值
 * @Param: integer expire Cookie有效期，单位：秒，默认为0(即浏览器关闭消失)，多少秒以后过期
 * @Param: string path Cookie的服务器路径，默认为根(/)
 * @Param: string domain Cookie的域名，默认为当前域名
 * @Author: zhangheng
 */
function setCookie(name, value, expire, path, domain){
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
	 * @Purpose: 域名字符串
	 * @Type: string
	 */
	var _domainString = "";
	if ( undefined!=domain && null!=domain )
	{
		_domainString = ";domain="+domain;
	}
	
	/**
	 * @Purpose: 有效期字符串
	 * @Type: string
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
 * @Purpose: 根据Cookie名获取Cookie值
 * @Param: string name(Cookie名)
 * @Return: string Cookie值
 * @Author: zhangheng
 */
function getCookie(name){
	/**
	 * @Purpose: 所有cookie集合
	 * @Type: string
	 */
	var _cookies = document.cookie;
	var reg = new RegExp('(^|; )'+ name +'=([^;]*)(;|$)', 'i');
	if( reg.test(_cookies) )
		return unescape(RegExp.$2);
	return '';
}