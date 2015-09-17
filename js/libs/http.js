/**
 * @purpose Http(页面处理类)
 * @author zhangheng
 * @created 2013-09-26
 * @updated 2015-08-25
 * @version 2015.0825.4
 */


function Http()
{
	this.url = this.href();
}


/**
 * @purpose 获取当前页面URL，并替换特殊字符
 */
Http.prototype.href=function()
{
	this.url = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=");
	return this.url;
};


/**
 * @purpose 获取参数值
 * @param param string(参数名)
 */
Http.prototype.get=function(param)
{
	var reg = new RegExp("(^|\\?|#|&)"+ param +"=([^&]*)(\\s|&|$)","i");
	if(reg.test(this.url))
		return RegExp.$2.replace(/\+/g," ");
	return "";
};


/**
 * @purpose 在URL中增加参数
 * @param param string 参数名
 * @param value string 参数值
 */
Http.prototype.addParam=function(param, value)
{
	this.url += (/[\#|\?]/.test(this.url) ? "&" : "?") + (param+"="+value);
	return this.url;
};


/**
 * @purpose 移除参数
 * @param param string 参数名
 */
Http.prototype.removeParam=function(param)
{
	var reg = new RegExp("(^|&)"+param+"=([^&]*)(&|$)","gi");
	this.url = reg.test(this.url) ?
		this.url.replace(reg,"$3") :
		this.url.replace(new RegExp("(^|\\?|#)"+param+"=([^&]*)(&|$)","gi"),"$1").replace(/([^\?]*)(\?)$/,"$1");
	
	return this.url;
};

var http = new Http();