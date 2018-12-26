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
Http.prototype.href = function()
{
	this.url = location.href.replace(/\%25/gi,"%").replace(/\%3d/gi,"=");
	return this.url;
};


/**
 * @purpose 获取参数值
 * @param param string(参数名)
 */
Http.prototype.get = function(param)
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
Http.prototype.addParam = function(param, value)
{
	this.url += (/[\#|\?]/.test(this.url) ? "&" : "?") + (param+"="+value);
	return this.url;
};


/**
 * @purpose 移除参数
 * @param param string 参数名
 */
Http.prototype.removeParam = function(param)
{
	var reg = new RegExp("(^|&)"+param+"=([^&]*)(&|$)","gi");
	this.url = reg.test(this.url) ?
		this.url.replace(reg,"$3") :
		this.url.replace(new RegExp("(^|\\?|#)"+param+"=([^&]*)(&|$)","gi"),"$1").replace(/([^\?]*)(\?)$/,"$1");
	
	return this.url;
};


/**
 * @purpose 解析URL
 * @return object
 * @author zhangheng
 * @created 2018-05-31 09:55
 */
Http.prototype.parseUrl = function(){
	var parser = {
		"schema":"", "host":"", "port":80, "path":"/", "query":"", "anchor":""
	}, schema, slashIndex, colonIndex, qmIndex, anchorIndex;

	schema = this.url.split('://');
	if ( schema[0].length<=5 ) parser.schema = schema[0];
	if ( !!schema[1] )
	{
		slashIndex = schema[1].indexOf('/');
		qmIndex = schema[1].indexOf('?');

		if ( slashIndex>0 )
		{
			parser.host = schema[1].substr(0, slashIndex);
			parser.path = schema[1].substr(slashIndex,
					qmIndex>0 ? qmIndex-parser.host.length : schema[1].length);
		}
		else
		{
			parser.host = schema[1];
		}

		colonIndex = parser.host.indexOf(':');
		if ( colonIndex>-1 ) parser.port = parser.host.substr(colonIndex+1);
		if ( !isNaN(parseInt(parser.port)) ) parser.port = 80;

		if ( qmIndex>-1 )
		{
			parser.query = schema[1].substr(qmIndex+1);
			anchorIndex = parser.query.indexOf('#');
			if ( anchorIndex>-1 )
			{
				parser.anchor = parser.query.substr(anchorIndex+1);
				parser.query = parser.query.substr(0, anchorIndex);
			}
		}
	}

	return parser;
};


/**
 * @purpose 解析字符串参数
 * @param params string 字符串参数
 * @return object
 * @author zhangheng
 * @created 2018-05-31 09:55
 */
Http.prototype.parseQuery = function(params){
	var queries = {}, param;
	if ( ''==params ) return queries;
	params = params.split('&');
	for ( var i=0; i<params.length; i++ )
	{
		param = params[i].split('=');
		queries[param[0]] = param[1];
	}
	return queries;
};

var http = new Http();