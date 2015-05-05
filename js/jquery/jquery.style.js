/**
 * 获取JQ对象的CSS样式对应的值
 * JQuery的css方法获取的不是默认CSS样式定义的值，而是计算后的值
 * 例如：获取对象的width值，如果CSS未定义该样式，则返回该对象实际所占用的宽度
 * 详细说明：<span>A</span>，字母"A"所占的宽度是8px，则JQuery的css方法返回的是8px，而不是空或auto
 */


(function($){
	$.fn.style=function(name){
		var myObj = this.get(0);
		if(myObj.style[name]){
			return myObj.style[name];
		}else if(myObj.currentStyle){
			return myObj.currentStyle[name];
		}else if(document.defaultView && document.defaultView.getComputedStyle){
			name = name.replace(/([A-Z])/g,"-$1").toLowerCase();
			var s = document.defaultView.getComputedStyle(myObj,"");
			return s&&s.getPropertyValue(name);
		}else{
			return null;
		}
	}
	$.fn.offsetHeight=function(){
		var _h = this.height();
		var _t = parseInt(this.css("marginTop"),10);
		_h += _t?_t:0;
		_t = parseInt(this.css("marginBottom"),10);
		_h += _t?_t:0;
		_t = parseInt(this.css("paddingTop"),10);
		_h += _t?_t:0;
		_t = parseInt(this.css("paddingBottom"),10);
		_h += _t?_t:0;
		_t = parseInt(this.css("borderTopWidth"),10);
		_h += _t?_t:0;
		_t = parseInt(this.css("borderBottomWidth"),10);
		_h += _t?_t:0;
		return _h;
	}
})(jQuery);