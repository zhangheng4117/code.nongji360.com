/**
 * @Purpose: select(自定义快捷菜单功能)
 * @Author: zhangheng
 * @Copyright (c) 2014 www.nongji360.com,All Rights Reserved
 * @Created: 2014-05-26
 * @Modified: 2014-07-05
 * @Version: 2014.0705.2
 */


(function($){
	$.jqPosition = {
		TOP:1,
		RIGHT:2,
		BOTTOM:3,
		LEFT:4
	};
	
	$.jqShortcut = {
		configure : function(self, option){
			self.data("position", option.position ? option.position : $.jqPosition.TOP);
			self.data("bgColor", option.bgColor ? option.bgColor : "#000000");
			self.data("fontColor", option.fontColor ? option.fontColor : "#ffffff");
			self.data("width", option.width ? option.width : "auto");
			self.data("height", option.height ? option.height : "30");
			self.data("lineHeight", option.lineHeight ? option.lineHeight : self.data("height"));
			self.data("opacity", option.opacity ? option.opacity : "0.9");
			
			var rect = {"width":self.outerWidth(), "height":self.outerHeight()};
			if ( "auto"==self.data("width") || self.data("width")>rect.width ) self.data("width", rect.width);
			if ( self.data("height")>rect.height ) self.data("height", rect.height);
		},
		html : function(self, n){
			return '<div style="width:'+self.data("width")+'px;height:'+self.data("height")+'px;line-height:'+self.data("lineHeight")+'px;position:absolute;z-index:99998;display:none;" rel="nj_shortcut_html" nj_shortcut_index="'+n+'"></div>';
		},
		setOffset:function(self, object){
			var offset = self.offset();
			object.css({"top":offset.top+"px", "left":offset.left+"px"});
		},
		initialize : function(self, btns, n){
			if ( !$.isArray(btns) ) btns = [];
			var _this=this, $body=$("body"), speed=300;
			self.attr("rel", "nj_shortcut_html").attr("me", "true").attr("nj_shortcut_index", n);
			
			var $bgColor = $(_this.html(self, n)).appendTo($body),
				$container = $(_this.html(self, n)).appendTo($body);
			$bgColor.css({"background-color":self.data("bgColor"), "opacity":self.data("opacity")});
			$container.css({"color":self.data("fontColor")});
			
			var shortcutOver = function(){
				_this.setOffset(self, $bgColor);
				_this.setOffset(self, $container);
				
				if ( $bgColor.is(":hidden") )
				{
					$bgColor.slideDown(speed);
					$container.slideDown(speed);
				}
			}
			
			var sBtn, $btn;
			for ( var i=0; i<btns.length; i++ )
			{
				sBtn = '<a href="javascript:" target="_self" rel="nj_shortcut_html" btn="true" nj_shortcut_index="'+n+'"';
				if ( btns[i].className )
				{
					sBtn += ' class="'+btns[i].className+'"';
				}
				if ( btns[i].style )
				{
					sBtn += ' style="'+btns[i].style+'"';
				}
				
				if ( btns[i].img )
				{
					sBtn += '><img src="'+btns[i].img+'" />';
				}
				else
				{
					sBtn += '>'+btns[i].text;
				}
				sBtn += '</a>';
				
				$btn = $(sBtn).appendTo($container);
				if ( "function"===typeof btns[i].fn )
				{
					$btn.data("fn", btns[i].fn);
					$btn.bind("click", function(){
						$(this).data("fn")(self);
					});
				}
			}
			$container.append('<div style="clear:both;"></div>').find("a").css("color", self.data("fontColor"));self.bind("mouseover", shortcutOver);
			
			self.bind("mouseover" ,shortcutOver);
			
			$(window).scroll(function(){
				_this.setOffset(self, $bgColor);
				_this.setOffset(self, $container);
			});
		}
	};
	
	var shortcutIndex = 0;
	$.fn.extend({
		shortcut:function(option, btns){
			var self=$(this);
			if ( undefined==self.attr('shortcut-rel') )
			{
				self.attr('shortcut-rel', new Date().getTime()*Math.random());
			}
			else
			{
				$("[rel='nj_shortcut_html'][shortcut-rel='"+self.attr('shortcut-rel')+"']:not([me='true'])").remove();
				self.attr('shortcut-rel', self.attr('shortcut-rel'));
			}
			
			option = option || {};
			
			self.each(function(){
				$.jqShortcut.configure($(this), option);
				$.jqShortcut.initialize($(this), btns, shortcutIndex++);
			});
			
			return self;
		}
	});
	
	
	$(document).ready(function(){
		$(document).mousemove(function(e){
			var $target = $(e.target);
			if ( "OBJECT"==e.target.tagName )
			{
				$("[rel='nj_shortcut_html']:not([me='true']):not([btn='true'])").slideUp(300);
			}
			else
			{
				if ( "nj_shortcut_html"!=$target.attr("rel") )
				{
					if ( 0==$target.closest('[rel="nj_shortcut_html"]').size() )
					{
						var $shortcut = $("[rel='nj_shortcut_html']:not([me='true']):not([btn='true'])");
						if ( $shortcut.is(":visible") )
						{
							$shortcut.slideUp(300);
						}
					}
				}
				else
				{
					var $shortcut = $("[rel='nj_shortcut_html']:not([me='true']):not([btn='true']):not([nj_shortcut_index='"+$target.attr("nj_shortcut_index")+"'])");
					if ( $shortcut.is(":visible") )
					{
						$shortcut.slideUp(300);
					}
				}
			}
		});
	});
})(jQuery);