(function($){
	var g={};
	$.fn.fadeshow = function(opt,fn){
		g.text = opt.text;
		g.isText = g.text!=undefined && g.text!="";
		g.jText = g.isText?$(g.text):null;
		g.isText = g.isText && g.jText!==null && g.jText.size()>0;
		g.dot = opt.dot;
		g.isDot = g.dot!=undefined && g.dot!="";
		g.jDot = g.isDot?$(g.dot):null;
		g.isDot = g.isDot && g.jDot!==null && g.jDot.size()>0;
		g.dotClass  = g.isDot && $.isArray(opt.dotClass)?opt.dotClass:false;
		g.o = $(this);
		g.elem = g.o.find("[rel='elem']");
		g.count = g.elem.size();
		g.curr = opt.curr?opt.curr:1;
		g.preq = g.curr;
		g.auto = opt.auto===false?opt.auto:true;
		g.autotime = isNaN(opt.autotime)?5000:opt.autotime;
		g.timer = null;
		
		g.o.css({"overflow":"hidden"});
		g.elem.hide();
		g.o.find("[rel='elem']:eq("+(g.curr-1)+")").show();
		
		digital();
		
		if(g.auto){
			g.timer = window.setInterval(autoSlide,g.autotime);
			
			g.o.mouseover(function(){window.clearInterval(g.timer);}).mouseout(function(){g.timer = window.setInterval(autoSlide,g.autotime);});
			if(g.isText){
				g.jText.mouseover(function(){window.clearInterval(g.timer);}).mouseout(function(){g.timer = window.setInterval(autoSlide,g.autotime);});
			}
			if(g.isDot){
				g.jDot.mouseover(function(){window.clearInterval(g.timer);}).mouseout(function(){g.timer = window.setInterval(autoSlide,g.autotime);});
			}
		}
		
		return g.o;
	}
	
	function digital(){
		var sText="";
		if ( g.isDot )
		{
			if ( g.dotClass )
			{
				for ( var i=1; i<=g.count; i++ )
				{
					sText += "<a href=\"javascript:\" target=\"_self\" class=\""+(i==g.curr?g.dotClass[1]:g.dotClass[0])+"\" style=\"text-decoration:none;outline:none;hide-focus:expression(this.hideFocus=true);\" index=\""+i+"\">&nbsp;</a> ";
				}
			}
			else
			{
				for ( var i=1; i<=g.count; i++ )
				{
					sText += "<a href=\"javascript:\" target=\"_self\" style=\"padding:0 5px;"+(i==g.curr?"background:#f00;":"background:#ccc;")+"text-decoration:none;outline:none;hide-focus:expression(this.hideFocus=true);\" index=\""+i+"\">&nbsp;</a> ";
				}
			}
			g.jDot.append(sText);
			
			g.jDot.find("a").bind("click",function(){
				var $this = $(this);
				g.preq = g.curr;
				g.curr = parseInt($this.attr("index"));
				if(g.preq===g.curr) return;
				fadeAnimate(changeTextIndex);
			});
		}
	}
	
	function fadeAnimate(fun){
		g.o.find("[rel='elem']:eq("+(g.preq-1)+")").fadeOut("slow",function(){
			fun();
			g.o.find("[rel='elem']:eq("+(g.curr-1)+")").fadeIn("slow");
		});
	}
	
	function autoSlide(){
		g.preq = g.curr;
		g.curr = g.curr>=g.count?1:g.curr+1;
		fadeAnimate(changeTextIndex);
	}
	
	function changeText(){
		if(g.isText){
			var $item = g.o.find("[text]:eq("+(g.curr-1)+")");
			g.jText.html("<a href=\""+$item.attr("href")+"\">"+$item.attr("text")+"</a>");
		}
	}
	
	function changeTextIndex(){
		if(g.isDot){
			if(g.dotClass){
				g.jDot.find("a").removeClass(g.dotClass[1]).addClass(g.dotClass[0]);
				g.jDot.find("a:eq("+(g.curr-1)+")").removeClass(g.dotClass[0]).addClass(g.dotClass[1]);
			}else{
				g.jDot.find("a").css({"background":"#ccc"});
				g.jDot.find("a:eq("+(g.curr-1)+")").css({"background":"#f00"});
			}
		}
		changeText();
	}
})(jQuery);