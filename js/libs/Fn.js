/**
 * @purpose Fn(工具类)
 * @author zhangheng
 * @created 2013-10-13
 * @updated 2013-10-13
 * @version 2013.1013.1
 * Copyright (c) 2013 ~ 2015 www.nongji360.com,All Rights Reserved
 */


function Fn(){
	this.dataType = {};
	this.coreToString = this.dataType.toString;
	for ( var types="Boolean Number String Array Date RegExp Object Error".split(" "),i=0;i<types.length;i++ )
	{
		this.dataType[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
	}
}

/**
 * @purpose 返回对象数据类型
 * @param obj object (变量或常量)
 * @return string
 */
Fn.prototype.type=function(obj)
{
	if(null===obj) return "null";
	var typeName = typeof obj;
	return "object"===typeName ?
		this.dataType[ this.coreToString.call(obj) ] || "object" :
		typeName;
};

/**
 * @purpose 随机取出min到max之间的整数
 * @param min int 最小数
 * @param max int 最大数
 * @return int 随机整数
 * @author zhangheng
 */
Fn.prototype.random=function(min, max)
{
	return Math.round(min+Math.random()*(max-min));
};


/**
 * @purpose 格式化时间
 * @param format string
 * @param time int | string
 * @return string
 * @author zhangheng
 * @created 2017-11-20 15:41
 */
Fn.prototype.date = function(format, time)
{
	var date;
	if ( RegEx.number(time) )
	{
		date = new Date(time*1000);
	}
	else if ( RegEx.datetime(time) )
	{
		date = new Date(time.replace(/-/g, "/"));
	}
	else if ( RegEx.date(time) )
	{
		date = new Date(time.replace(/-/g, "/") + " 00:00:00");
	}
	else
	{
		date = new Date();
	}
	var tmpStr, datetime;

	datetime	= format.replace("Y", date.getFullYear());
	datetime	= datetime.replace("y", (""+date.getFullYear()).substr(2,2));
	tmpStr		= "0"+(date.getMonth()+1);
	datetime	= datetime.replace("m", tmpStr.substr(tmpStr.length-2,2));
	datetime	= datetime.replace("n", "" + (date.getMonth()+1));
	tmpStr		= "0"+date.getDate();
	datetime	= datetime.replace("d", tmpStr.substr(tmpStr.length-2,2));
	tmpStr		= "0"+date.getHours();
	datetime	= datetime.replace("H", tmpStr.substr(tmpStr.length-2,2));
	tmpStr		= "0"+(date.getHours()%12);
	datetime	= datetime.replace("h", tmpStr.substr(tmpStr.length-2,2));
	tmpStr		= "0"+date.getMinutes();
	datetime	= datetime.replace("i", tmpStr.substr(tmpStr.length-2,2));
	tmpStr		= "0"+date.getSeconds();
	datetime	= datetime.replace("s", tmpStr.substr(tmpStr.length-2,2));
	if ( date.getHours()<12 )
	{
		datetime= datetime.replace("a", "am").replace("A", "AM");
	}
	else
	{
		datetime= datetime.replace("a", "pm").replace("A", "PM");
	}

	return datetime;
};


/**
 * @purpose 计算时长（多久以前）
 * @param time string | int
 * @return string
 * @author zhangheng
 * @created 2017-09-20 19:04
 */
Fn.prototype.timeLong = function(time)
{
	var now = Math.floor(new Date().getTime()/1000), long, date;
	if ( RegEx.date(time) || RegEx.datetime(time) )
	{
		date = new Date(time.replace(/-/g, "/"));
		time = Math.floor(date.getTime()/1000);
	}
	else if ( RegEx.number(time) )
	{
		date = new Date(time*1000);
	}
	else
	{
		return '';
	}
	if ( time>now )
	{
		return '';
	}

	var differ = now - time;
	if ( differ<60 )
	{
		long = differ + '秒前';
	}
	else if ( differ<60*60 )
	{
		long = Math.floor(differ/60) + '分钟前';
	}
	else if ( differ<60*60*24 )
	{
		long = Math.floor(differ/60/60) + '小时前';
	}
	else if ( differ<60*60*24*30 )
	{
		long = Math.floor(differ/60/60/24) + '天前';
	}
	else if ( differ<60*60*24*365 )
	{
		long = Math.floor(differ/60/60/24/30) + '月前';
	}
	else
	{
		long = Math.floor(differ/60/60/24/365) + '年前';
	}
	return long;
};


var fn = new Fn();