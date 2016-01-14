/**
 * @purpose associate(联想功能)
 * @author zhangheng
 * @updated 2011-09-26
 * Copyright (c) 2011 www.nongji360.com,All Rights Reserved
 */

(function($){
	var p = {i:-1,r:""};
	$.fn.ass = function(url,fn){return a(this,url,fn);};
	var v = function(o){return o.val();};
	$.jqAss = {
		p:p,
		c:function(o){
			p.o=o;
			p.id="id_"+(p.o.data("rel") || p.o.attr("name"));
			if($("#"+p.id).size()<1)
			{
				p.o.after("<div id=\""+p.id+"\"></div>");
			}
			p.o.c=$("#"+p.id);
			p.p = p.o.offset();
			p.o.c.css({
				"width":p.o.outerWidth()-2+"px",
				"background":"#fff","border":"solid 1px","color":"#000",
				"position":"absolute","left":p.p.left+"px","top":p.p.top+p.o.outerHeight()-1+"px",
				"z-index":"2","display":"none"
			});

			var defaultColor = '#ccc';
			p.o.c.css({
				"borderRightColor":p.o.css("borderRightColor") || defaultColor,
				"borderBottomColor":p.o.css("borderBottomColor") || defaultColor,
				"borderLeftColor":p.o.css("borderLeftColor") || defaultColor,
				"borderTopWidth":"0px"
			});
		},
		open:function(){if(p.o.c.html()!=""){p.o.c.show();}},
		close:function(){if(p.o.c.size()>0){p.o.c.hide();p.o.c.html("");}},
		on:function(f){
			var dl = p.o.c.children("dl");
			dl.css({"height":"24px","line-height":"24px","margin":"0","padding":"0 5px","overflow":"hidden","cursor":"default"}).bind("mouseover",function(){
				$(this).css("background","#e2eaff");
				p.i = dl.index(this);
			}).bind("mouseout",function(){
				$(this).css("background","#fff");
				p.i = -1;
			}).bind("click",function(){
				$.jqAss.ok(f);
			});
		},
		move:function(k){
			var pn;
			switch ( k )
			{
				case 37:
				case 38:
					pn = -1;
					break;
				case 39:
				case 40:
					pn = 1;
					break;
			}
			
			if ( p.o.c.is(":hidden") )
			{
				this.open();
			}
			else
			{
				var dl = p.o.c.children("dl");
				var idl = dl.size();
				p.i += pn;
				p.i = p.i<0?idl-1:p.i>idl-1?0:p.i;
				this.select();
			}
		},
		select:function(){p.o.c.children("dl").css("background","#fff");p.o.c.children("dl:eq("+p.i+")").css("background","#e2eaff");},
		ok:function(f){var $h = p.o.c.children("dl:eq("+p.i+")");if(p.i>-1 && $h.size()>0){p.o.val($h.html());p.o.data("id",$h.data("id"));}this.close();if(typeof(f)=="function"){f(p.o);}return p.o;}
	};
	var a = function(o,u,f){
		o.attr("autocomplete","off");
		o.bind("blur",function(){$.jqAss.ok(f);$.jqAss.close();});
		$.jqAss.c(o);
		
		return o.bind("keyup",function(e){
			if(e.keyCode>36 && e.keyCode<41){if(p.o.c.is(":visible")){return false;}}
			if(e.keyCode==13){return false;}

			p.v = v(o);
			if ( p.v==o.data('value') ){return false;}
			
			p.o = o;
			p.i = -1;
			p.s = "";
			p.o.removeData("id");
			if ( p.v=="" )
			{
				$.jqAss.close();
			}
			else
			{
				$.post(u, "k="+encodeURIComponent(p.v), function(data){
					if ( data.items.length>0 )
					{
						p.r = data.items;
						
						var items = data.items;
						var tmpStr = "";
						for ( var i=0;i<items.length;i++ )
						{
							tmpStr += "<dl data-id=\""+items[i].id+"\">"+items[i].name+"</dl>";
						}
						p.s = tmpStr;
						p.o.c.html(p.s);
						$.jqAss.on(f);
						
						if ( p.s!="" )
						{
							$.jqAss.open();
						}
						else
						{
							$.jqAss.close();
						}
					}
					else
					{
						$.jqAss.close();
					}
				}, 'json');
			}
		}).bind("keydown",function(e){
			p.o.data('value', p.o.val());
			if(e.keyCode>36 && e.keyCode<41)
			{
				$.jqAss.move(e.keyCode);
			}
			else if (e.keyCode==13)
			{
				$.jqAss.ok(f);
				return false;
			}
		});
	}
})(jQuery);