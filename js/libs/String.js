/**
 * @Purpose: String(字符串类)
 * @Author: zhangheng
 * @Copyright (c) 2008-2013 www.nongji360.com,All Rights Reserved
 * @Created: 2013-07-23
 * @Modified: 2014-06-28
 * @Version: 2014.0628.3
 */


/**
 * @Purpose: 返回字符串长度，一个汉字算两个字符
 * @Return: integer 字符串长度
 */
String.prototype.len = function()
{
	return this.length+this.replace(/[\u0000-\u0127]/g, '').length;
}


/**
 * @Purpose: 剥离HTML标签
 * @Return: string 不包含HTML标签的字符串
 */
String.prototype.stripTags = function()
{
	return this.replace(/(<(.[^>]*)>)|(&([a-zA-Z]{2,6});)/g, '');
}


/**
 * @Purpose: 清空空白字符
 * @Return: string 非空白字符
 */
String.prototype.stripBlank = function()
{
	return this.replace(/[\s]+/g, '');
}


/**
 * @Purpose: 字符串转换数字，如果不是数字则返回0
 * @Return: integer 字符型转数值型
 */
String.prototype.toInt = function()
{
	/**
	 * @Purpose: 格式化当前对象的数值
	 * @Type: integer
	 */
	var _int = parseInt(this);
	
	return isNaN(_int) ? 0 : _int;
}


/**
 * @Purpose: 字符串转换数字(浮点型)，如果不是数字则返回0
 * @Return: float 字符型转浮点型
 */
String.prototype.toFloat = function()
{
	/**
	 * @Purpose: 格式化当前对象的数值
	 * @Type: float
	 */
	var _float = parseFloat(this);
	
	return isNaN(_float) ? 0 : _float;
}


/**
 * @Purpose: 在指定最后一段字符串之前加上指定字符串并返回结果
 * @Param: string string 指定字符
 * @Param: string separate 分隔符，默认为点(.)
 * @Return: string 拼接后的字符串
 * @Author: zhangheng
 * @Created: 2014-06-28 10:32
 */
String.prototype.lastPrepend = function(string, separate)
{
	if ( undefined===separate ) separate = '.';
	var lastIndex = this.lastIndexOf(separate);
	if ( lastIndex<0 ) return this;
	return this.substr(0, lastIndex) + string + this.substr(lastIndex);
}


/**
 * @Purpose: 在指定最后一段字符串之后加上指定字符串并返回结果
 * @Param: string string 指定字符
 * @Param: string separate 分隔符，默认为斜杠(/)
 * @Return: string 拼接后的字符串
 * @Author: zhangheng
 * @Created: 2014-06-28 11:00
 */
String.prototype.lastAppend = function(string, separate)
{
	if ( undefined===separate ) separate = '/';
	var lastIndex = this.lastIndexOf(separate);
	if ( lastIndex<0 ) return this;
	return this.substr(0, lastIndex+separate.length) + string + this.substr(lastIndex+separate.length);
}