/*
**	Fn(工具类)
**	Author: zhangheng
**	Copyright (c) 2013 www.nongji360.com,All Rights Reserved
**	Created: 2013-10-13
**	Modified: 2013-10-13
**	Version: 2013.1013.1
*/


function Fn(){
	this.dataType = {},
	this.coreToString = this.dataType.toString;
	for(var types="Boolean Number String Array Date RegExp Object Error".split(" "),i=0;i<types.length;i++){
		this.dataType[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
	}
}

/*
** 返回对象数据类型
** obj(变量或常量)
*/
Fn.prototype.type=function(obj){
	if(null===obj) return "null";
	var typeName = typeof obj;
	return "object"===typeName ?
		this.dataType[ this.coreToString.call(obj) ] || "object" :
		typeName;
}

/**
* @Purpose: 随机取出min到max之间的整数
* @Param: integer min 最小数
* @Param: integer max 最大数
* @Return: integer 随机整数
* @Author: zhangheng
*/
Fn.prototype.random=function(min, max){
	return Math.round(min+Math.random()*(max-min));
}


var fn = new Fn();