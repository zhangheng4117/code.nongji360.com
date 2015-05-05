/*
**	Http(页面处理类)
**	Author: zhangheng
**	Copyright (c) 2013 www.nongji360.com,All Rights Reserved
**	Created: 2013-09-26
**	Modified: 2013-10-14
**	Version: 2013.1013.3
*/


function Http(){
	this.url = this.href();
}


/* 获取当前页面URL，并替换特殊字符 */
Http.prototype.href=function(){
	this.url = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=");
	return this.url;
}


/*
** 获取参数值
** param(参数名)
*/
Http.prototype.get=function(param){
	var reg = new RegExp("(^|\\?|#|&)"+ param +"=([^&]*)(\\s|&|$)","i");
	if(reg.test(this.url))
		return unescape(RegExp.$2.replace(/\+/g," "));
	return "";
}


/*
** 在URL中增加参数
** param(参数名)
** value(参数值)
*/
Http.prototype.addParam=function(param,value){
	this.url += (/[\#|\?]/.test(this.url) ? "&" : "?") + (param+"="+value);
	return this.url;
}


/*
** 移除参数
** param(参数名)
*/
Http.prototype.removeParam=function(param){
	var reg = new RegExp("(^|&)"+param+"=([^&]*)(&|$)","gi");
	this.url = reg.test(this.url) ?
		this.url.replace(reg,"$3") :
		this.url.replace(new RegExp("(^|\\?|#)"+param+"=([^&]*)(&|$)","gi"),"$1").replace(/([^\?]*)(\?)$/,"$1");
	
	return this.url;
}

var http = new Http();