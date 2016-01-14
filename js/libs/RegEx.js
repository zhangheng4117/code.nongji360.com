/**
 * @purpose RegEx(正则表达式类)
 * @author zhangheng
 * @Copyright (c) 2013 www.nongji360.com,All Rights Reserved
 * @created 2013-07-23
 * @Modified: 2014-06-16
 * @Version: 2014.0616.2
 */


var RegEx = {
	/**
	 * @purpose 匹配是否为身份证号
	 * @param string string 要匹配的字符串
	 * @return boolean
	 * @author zhangheng
	 * @created 2015-06-19 15:36
	 */
	card:function(string)
	{
		return /^[1-9][0-9]{5}((19)|(20))[0-9]{2}((0[1-9])|(1[0-2]))((0[1-9])|([1,2][0-9])|(3[0-1]))[0-9]{3}[0-9xX]$/.test(string);
	},

	/**
	 * @purpose 匹配是否为日期格式
	 * @param string string 要匹配的字符串
	 * @return boolean
	 * @author zhangheng
	 * @created 2014-06-28 16:30
	 */
	date:function(string)
	{
		return /^((19)|(20))[0-9]{2}-(([1-9])|(0[1-9])|(1[0-2]))-(([1-9])|(0[1-9])|([1,2][0-9])|(3[0-1]))$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为日期加时间格式
	 * @param string string 要匹配的字符串
	 * @return boolean
	 * @author zhangheng
	 * @created 2014-06-28 16:34
	 */
	datetime:function(string)
	{
		return /^((19)|(20))[0-9]{2}-(([1-9])|(0[1-9])|(1[0-2]))-(([1-9])|(0[1-9])|([1,2][0-9])|(3[0-1])) (([0-9])|([0-1][0-9])|(2[0-3])):(([0-9])|([0-5][0-9])):(([0-9])|([0-5][0-9]))$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为Email格式，无长度限制
	 */
	email:function(string)
	{
		return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为整数（有符号）
	 */
	integer:function(string)
	{
		return /^[-]?[\d]+$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为IPv4地址
	 */
	ip:function(string)
	{
		return /^[1-9][\d]{0,2}(.((0)|([1-9][\d]{0,2}))){3}$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为中国手机号码
	 */
	mobile:function(string)
	{
		//return /^1[3,4,5,8][0-9]{9}$/.test(string);
		return /^1(([3,8][0-9]{9})|(4[5,7][0-9]{8})|(5[0,1,2,3,5,6,7,8,9][0-9]{8})|(7((0[0,5,9][0-9]{7})|([6-8][0-9]{8}))))$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为整数（无符号即大于等于0的整数）
	 */
	number:function(string)
	{
		return /^[\d]+$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为数字（有符号），整数或两位小数
	 */
	numeric:function(string)
	{
		return /^[-]?[\d]+(\.[\d]{1,12})?$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为邮政编码
	 * @param string string 要匹配的字符串
	 * @return boolean
	 * @author zhangheng
	 * @created 2014-06-28 16:36
	 */
	postcode:function(string)
	{
		return /^[\d]{6}$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为QQ号码
	 */
	qq:function(string)
	{
		return /^[1-9][\d]{4,9}$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为电话号码，无国家或地区码，且可以有分机号
	 * 例：010-62278600 或 010-62278600-8008
	 */
	tel:function(string)
	{
		return /^0[1-9][0-9]{1,2}-[1-9][0-9]{6,7}(-[0-9]{1,4})?$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为免费电话（400或800电话）
	 */
	telFree:function(string){
		return /^(400)|(800)[\d]{7}$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否为时间格式
	 * @param string string 要匹配的字符串
	 * @return boolean
	 * @author zhangheng
	 * @created 2014-06-28 16:37
	 */
	time:function(string)
	{
		return /^(([0-9])|([0-1][0-9])|(2[0-3])):(([0-9])|([0-5][0-9])):(([0-9])|([0-5][0-9]))$/.test(string);
	},
	
	/**
	 * @purpose 匹配是否符合用户名规则
	 * @author zhangheng
	 * @created 2014-06-16 17:25
	 */
	username:function(string)
	{
		return /^[a-zA-Z0-9]{4,16}$/.test(string) && !this.number(string);
	}
};