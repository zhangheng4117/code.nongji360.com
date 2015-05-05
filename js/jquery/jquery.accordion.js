/**
 * @Purpose: accordion(手风琴菜单效果)
 * Author: zhangheng
 * Copyright (c) 2008-2014 www.nongji360.com,All Rights Reserved
 * Created: 2012-03-03
 * Modified: 2014-08-15
 * Version: 2014.0815.2
 */

(function($){
	var opt = {};
	$.fn.accordion=function(option){
		opt.o = this;
		/*所有标签的JQ对象集合*/
		opt.label = opt.o.find('[data-href]'+(undefined==option.group ? '' : '[data-group="'+option.group+'"]'));
		opt.o.data('label', opt.label);
		/*第一个标签的JQ对象*/
		opt.label.first = $(opt.label.get(0));
		/*传递的参数*/
		opt.option = option;
		/*默认显示的标签的href属性值*/
		if ( null!==opt.option.href )
		{
			opt.option.href = opt.option.href ? (opt.label.size()==0 ? opt.label.first.data('href') : opt.option.href) : opt.label.first.data('href');
		}
		/*默认选中的标签的CSS样式名称*/
		opt.option.style = opt.option.style ? opt.option.style : '';
		/*默认切换标签的方式*/
		opt.option.type = opt.option.type ? opt.option.type : 'click';
		
		return a();
	}
	
	$.jqAccordion = {
		each:function(jObject){
			/*初始化遍历标签并根据条件判断是显示或隐藏*/
			
			jObject = null===jObject ? opt.label : jObject.parent().find('[data-href]'+(undefined!=jObject.data('group') ? '[data-group="'+jObject.data('group')+'"]' : ''));
			return jObject.each(function(n){
				var _this = $(this);
				var href = _this.data('href');
				var $href = $(href);
				if(href!=opt.option.href || null==opt.option.href){
					_this.removeClass(opt.option.style);
					$href.animate({'height':'0px', 'opacity':'0'}, 300, function(){
						$href.hide();
					});
					//$href.slideUp(300, function(){$href.hide();});
				}else{
					_this.addClass(opt.option.style);
					$href.css('height', 'auto');
					var _height = $href.height();
					$href.css('height', '0px').show();
					$href.animate({'height':_height+'px', 'opacity':'1'}, 300, function(){
						$href.css('height', "auto");
					});
					//$href.slideDown(300);
				}
			});
		}
	};
	
	function a(){
		$.jqAccordion.each(null).bind(opt.option.type, function(){
			var $this=$(this), _href = $this.data('href');
			if($(_href).is(':visible')){return;}
			opt.option.href = _href;
			$.jqAccordion.each($this);
		});
		return opt.o;
	}
})(jQuery);