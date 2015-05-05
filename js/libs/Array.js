/**
 * @Purpose: Array(数组类)
 * @Author: zhangheng
 * Copyright (c) 2013 www.nongji360.com,All Rights Reserved
 * @Created: 2013-07-23
 * @Modified: 2013-10-13
 * @Version: 2013.1013.2
 */


/*
** 返回数组中最大的元素
*/
Array.prototype.max=function(){
	return this.length>0 ? Math.max.apply(null,this) : -Infinity;
};

/*
** 返回数组中最小的元素
*/
Array.prototype.min=function(){
	return this.length>0 ? Math.min.apply(null,this) : Infinity;
};

/*
** 判断数组中是否存在相同元素
** 如果存在则返回索引，若不存在则返回false
** 支持数据类型(Boolean|Number|String|Object)
*/
Array.prototype.inArray=function(elem){
	var elemType = fn.type(elem);
	var i=0,flag;
	switch(elemType)
	{
		case "boolean":
		case "number":
		case "string":
			/* 基本数据类型，判断值相等 */
			for(;i<this.length;i++){
				if(this[i]==elem) return i;
			}
			break;
		case "object":
			/* 对象,只要数组中存在elem所有元素就返回索引,即使数组元素多于elem也返回索引 */
			for(;i<this.length;i++){
				flag = true;
				for(var j in elem){
					if(undefined==this[i][j]) break;
					if(elem[j]!=this[i][j]){
						flag = false;
						break;
					}
				}
				if(flag) return i;
			}
			break;
	}
	return false;
};

/*
** 删除数组指定索引的元素，支持一次删除多个索引
** 索引支持负数(-1代表倒数第一个元素,-2代表倒数第二个元素,以此类推)
*/
Array.prototype.remove=function(){
	var args=Array.prototype.slice.call(arguments,0),argLen=args.length,
	objLen=this.length;
	
	switch(argLen)
    {
		case 0:
			return this;
			break;
		case 1:
			if(args[0]<0) args[0] += objLen;
			return args[0]>=objLen
				? this : this.slice(0,args[0]).concat(this.slice(args[0]+1,objLen));
			break;
		default:
			var tmpArr=[],i=0;
			/* 负数转换为正数索引 */
			for(;i<argLen;i++){
				if(args[i]<0) args[i] += objLen;
				if(args[i]>=objLen){
					args = args.remove(i);
					argLen--;i--;
				}
			}
			//对要删除的索引进行升序排序
			args.sort();
			//如果参数数组第一个元素大于0，则在参数数组首位添加-1
			if(args[0]>0) args = [-1].concat(args);
			//如果参数数组最后一个元素小于数组长度，则在参数数组末尾追加数组长度
			if(args[argLen-1]<objLen) args.push(objLen);
			//重新计算参数数组长度
			argLen = args.length;

			/* 拼接无需删除的数组元素 */
			for(i=1;i<argLen;i++){
				tmpArr = tmpArr.concat(this.slice(args[i-1]+1,args[i]));
			}
			return tmpArr;
	}
};


/*
** 声明多维数组
** 例：var arr2 = fArray(3,5);	//表示三行五列
*/
function fArray(){
	var argLen = arguments.length;
	if(0===argLen) return [];
	
	//将数据类型[object Arguments]转为[object Array]
	var args = Array.prototype.slice.call(arguments,0);
	var arr = new Array(args[0]);
	
	if(argLen>1){
		for(var i=0,j=args[0];i<j;i++){
			arr[i] = fArray.apply(null,args.slice(1));
		}
	}
	return arr;
}