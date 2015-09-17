/**
 * @purpose String(字符串类)
 * @author zhangheng
 * @Copyright (c) 2008-2013 www.nongji360.com,All Rights Reserved
 * @created 2013-07-23
 * @modified 2014-06-28
 * @version 2014.0628.3
 */


/**
 * @purpose 返回字符串长度，一个汉字算两个字符
 * @return int 字符串长度
 */
String.prototype.len = function()
{
	return this.length+this.replace(/[\u0000-\u0127]/g, '').length;
};


/**
 * @purpose 剥离HTML标签
 * @return string 不包含HTML标签的字符串
 */
String.prototype.stripTags = function()
{
	return this.replace(/(<(.[^>]*)>)|(&([a-zA-Z]{2,6});)/g, '');
};


/**
 * @purpose 清空空白字符
 * @return string 非空白字符
 */
String.prototype.stripBlank = function()
{
	return this.replace(/[\s]+/g, '');
};


/**
 * @purpose 字符串转换数字，如果不是数字则返回0
 * @return int 字符型转数值型
 */
String.prototype.toInt = function()
{
	/**
	 * @purpose 格式化当前对象的数值
	 * @var int
	 */
	var _int = parseInt(this);
	
	return isNaN(_int) ? 0 : _int;
};


/**
 * @purpose 字符串转换数字(浮点型)，如果不是数字则返回0
 * @return number 字符型转浮点型
 */
String.prototype.toFloat = function()
{
	/**
	 * @purpose 格式化当前对象的数值
	 * @var float
	 */
	var _float = parseFloat(this);
	
	return isNaN(_float) ? 0 : _float;
};


/**
 * @purpose 替空字符串两边的空白字符
 * @return string
 * @author zhangheng
 * @created 2015-07-31 11:21
 */
String.prototype.trim = String.prototype.trim || function()
{
	return this.toString().replace(/^(\s|\u3000)*|(\s|\u3000)*$/g, '');
};


/**
 * @purpose 在指定最后一段字符串之前加上指定字符串并返回结果
 * @param string string 指定字符
 * @param separate string 分隔符，默认为点(.)
 * @return string 拼接后的字符串
 * @author zhangheng
 * @created 2014-06-28 10:32
 */
String.prototype.lastPrepend = function(string, separate)
{
	if ( undefined===separate ) separate = '.';
	var lastIndex = this.lastIndexOf(separate);
	if ( lastIndex<0 ) return this;
	return this.substr(0, lastIndex) + string + this.substr(lastIndex);
};


/**
 * @purpose 在指定最后一段字符串之后加上指定字符串并返回结果
 * @param string string 指定字符
 * @param separate string 分隔符，默认为斜杠(/)
 * @return string 拼接后的字符串
 * @author zhangheng
 * @created 2014-06-28 11:00
 */
String.prototype.lastAppend = function(string, separate)
{
	if ( undefined===separate ) separate = '/';
	var lastIndex = this.lastIndexOf(separate);
	if ( lastIndex<0 ) return this;
	return this.substr(0, lastIndex+separate.length) + string + this.substr(lastIndex+separate.length);
};