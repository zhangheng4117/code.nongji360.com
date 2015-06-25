function TouchSlide(container, opt)
{
	var _this = this,touchDOM = document.getElementById(container);
	if(!touchDOM) return;
	var ua = navigator.userAgent+navigator.platform;
	var g=undefined==opt || ""==opt?{}:opt;
	g.isInterval = /iPhone/i.test(ua) && /Safari/i.test(ua);
	g.least = /^[\d]+$/.test(g.least)?g.least:50;
	g.bar = undefined==g.bar || ""==g.bar?null:$("#"+g.bar);
	g.isBar = !!g.bar;
	g.isBarClass = !(undefined==g.barClass || ""==g.barClass);
	g.auto = true===g.auto;
	g.autoTime = g.auto?(/^[\d]+$/.test(g.autoTime)?parseInt(g.autoTime)*1000:4000):0;
	g.elem = $(touchDOM).find("[rel='elem']");
	g.elemCount = g.elem.size();
	//g.elemWidth = $(touchDOM).find("[rel='elemOuter']:eq(0)").outerWidth();
	g.barWidth = /^[\d]+$/.test(g.barWidth)?parseInt(g.barWidth):null;
	g.isBarWidth = !(g.barWidth===null);
	g.isSpeed = /^[\d]+$/.test(g.speed);
	g.speed = g.isSpeed?parseInt(g.speed):200;
	if(typeof(g.fn)!="function") g.fn=function(){};
	g.isCascade = !!g.cascade;
	if(g.isCascade)
	{
		g.$cascade = $("#"+g.cascade);
		g.cascadeWidth = g.$cascade.outerWidth();
	}
	g.timer = null;
	g.isDefaultChannel = undefined!=g.defaultChannel && ""!=g.defaultChannel;
	touchDOM.curr = !!touchDOM.curr?touchDOM.curr:0;
	g.touchDOM = touchDOM;
	_this.g = g;
	
	_this.initWidth();
	
	if(g.elemCount<2)
	{
		window.addEventListener("orientationchange", function(){
			_this.orientationHandler();
		}, false);
		$(window).resize(function(){
			_this.orientationHandler();
		});
		
		g.fn(touchDOM,g);
		return;
	}
	
	if(g.isBar) this.initBar();
	
	var touchStart=function(e){
		if($(e.target).parents("[rel='prevent']").size()>0) return;
		if(g.isCascade) g.cascadeLeft = parseInt(g.$cascade.css("left")) || 0;
		window.clearInterval(_this.g.timer);
		this.sx = e.targetTouches[0].pageX;
		this.sy = e.targetTouches[0].pageY;
		this.st = $(window).scrollTop();
	};
	touchDOM.addEventListener("touchstart",touchStart,false);
	
	var touchMove=function(e){
		if($(e.target).parents("[rel='prevent']").size()>0) return;
		var ex=e.targetTouches[0].pageX,ey=e.targetTouches[0].pageY,XW=ex-this.sx,absXW=Math.abs(XW);
		if(Math.abs(ey-this.sy)>absXW) return;
		
		e.preventDefault();
		this.ex = ex;
		this.ey = ey;
		
		if(absXW>g.least){
			var ml = parseInt(_this.g.touchDOM.ml||0);
			$(this).css("marginLeft",ml+(ex-this.sx)-g.least+"px");
			
			if(g.isCascade){
				var iCascadeScale = g.cascadeLeft-Math.floor(g.cascadeWidth*XW/g.elemWidth);
				g.$cascade.css("left",iCascadeScale+"px");
			}
		}
	};
	touchDOM.addEventListener("touchmove",touchMove,false);
	
	var touchEnd=function(){
		//var $this = $(_this.g.touchDOM);
		var moveXW = _this.g.touchDOM.ex-_this.g.touchDOM.sx;
		var curr = this.curr?parseInt(this.curr):0;
		
		if(0===parseInt($(this).css("marginLeft"))%g.elemWidth) return;
		if(Math.abs(g.touchDOM.ey-g.touchDOM.sy)+Math.abs($(window).scrollTop()-this.st)>Math.abs(moveXW)){_this.slide(curr);return;}
		
		if(Math.abs(moveXW)>g.least){
			curr += moveXW>0?-1:1;
			curr = curr>=g.elemCount?curr-1:curr<0?0:curr;
		}
		_this.slide(curr);
		
		if(g.auto) g.timer=window.setInterval(function(){_this.auto();},g.autoTime);
	};
	touchDOM.addEventListener("touchend",touchEnd,false);
	
	if(g.auto) g.timer=window.setInterval(function(){_this.auto();},g.autoTime);
	
	window.addEventListener("orientationchange", function(){
		_this.orientationHandler();
	});
	$(window).resize(function(){
		_this.orientationHandler();
	});
	
	if ( g.isDefaultChannel )
	{
		_this.slide($("[channel='"+g.defaultChannel+"']").index());
	}
}

TouchSlide.prototype.initWidth=function(){
	var _this = this;
	_this.g.deviceWidth = $(window).width();
	_this.g.elemWidth = _this.g.deviceWidth;
	_this.g.elem.css("width", _this.g.elemWidth+"px");
};

TouchSlide.prototype.initBar=function(){
	if(!this.g.isBarWidth) this.g.barWidth = Math.ceil(this.g.elemWidth/this.g.elemCount);
	var sBar = "<div"+(this.g.isBarClass?" class=\""+this.g.barClass+"\"":"")+" style=\"width:"+this.g.barWidth+"px;\">&nbsp;</div>";
	this.g.bar.html(sBar);
};

TouchSlide.prototype.slide=function(index){
	var _this = this;
	_this.g.touchDOM.ml = -index*_this.g.elemWidth;
	
	if ( "function"===typeof(_this.g.before) ) _this.g.before(_this.g);
	
	if(_this.g.isInterval){
		_this.g.everyWidth = Math.ceil(_this.g.elemWidth/_this.g.speed)*3;
		_this.interval();return;
	}
	
	if(_this.g.isCascade) _this.g.$cascade.animate({"left":index*_this.g.cascadeWidth+"px"},_this.g.speed);
	
	if(index===_this.g.touchDOM.curr)
	{
		$(_this.g.touchDOM).animate({"marginLeft":_this.g.touchDOM.ml+"px"},200);
	}
	else{
		if(this.g.isBar) this.g.bar.animate({"paddingLeft":index*this.g.barWidth+"px"},_this.g.speed);
		$(_this.g.touchDOM).animate({"marginLeft":_this.g.touchDOM.ml+"px"},{duration:_this.g.speed,complete:function(){_this.g.fn(this,_this.g);}});
		_this.g.touchDOM.curr = index;
	}
};

TouchSlide.prototype.auto=function(){
	var curr = /^[\d]+$/.test(this.g.touchDOM.curr)?parseInt(this.g.touchDOM.curr):0;
	if(++curr>=this.g.elemCount){curr = 0;}
	this.slide(curr);
};

TouchSlide.prototype.interval=function(){
	var _this = this;
	var thisml = parseInt($(_this.g.touchDOM).css("marginLeft"))||0;
	if(_this.g.touchDOM.ml==thisml){_this.g.fn(_this.g.touchDOM,_this.g);return;}
	
	thisml += _this.g.touchDOM.ml>thisml?_this.g.everyWidth:-_this.g.everyWidth;
	thisml = Math.abs(Math.abs(_this.g.touchDOM.ml)-Math.abs(thisml))<=_this.g.everyWidth?_this.g.touchDOM.ml:thisml;
	$(_this.g.touchDOM).css("marginLeft",thisml+"px");
	window.setTimeout(function(){_this.interval();},1);
	_this.g.touchDOM.curr = Math.abs(_this.g.touchDOM.ml/_this.g.elemWidth);
};

TouchSlide.prototype.orientationHandler=function(){
	var _this = this;
	_this.initWidth();
	_this.slide(_this.g.touchDOM.curr);
};