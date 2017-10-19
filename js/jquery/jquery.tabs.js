/*
**	tabs(选项卡功能)
**	Author: zhangheng
**	Copyright (c) 2012 www.nongji360.com,All Rights Reserved
**	Created: 2012-02-13
**	Modified: 2013-05-30
**	Version: 2014.0926.6
*/

(function($){
	var opt = {};
	$.fn.tabs=function(option,fn){
		opt.fn = fn;
		opt.o = this;
		this.data('fn', fn);
		/*传递的参数*/
		opt.option=option || {};
		/*是否允许扩展选项卡*/
		opt.option.scalable = true===opt.option.scalable?opt.option.scalable:false;
		/*当前对象的CSS样式(必须项)*/
		if(opt.option.scalable){opt.o.css({position:"relative",overflow:"hidden"})}
		/*选项卡所在容器的JQ对象*/
		opt.tabs = opt.o.find("ul:eq(0)");
		/*选项卡所在容器的CSS样式(必须项)，若允许扩展选项卡则在一排显示*/
		if(opt.option.scalable){opt.tabs.css({position:"absolute",width:"10000%"});}
		/*选项卡集合JQ对象*/
		opt.tab = opt.tabs.children("li[href]");
		/*第一个选项卡JQ对象*/
		var $tmp = opt.tabs.children("li[href]:eq(0)");
		/*单个选项卡宽度*/
		opt.tabWidth = $tmp.width()+parseInt($tmp.css("marginLeft"))+parseInt($tmp.css("marginRight"))+parseInt($tmp.css("paddingLeft"))+parseInt($tmp.css("paddingRight"));
		/*已经添加过的选项卡数量，默认为选项卡现有个数*/
		opt.o.count = opt.option.count?opt.option.count:opt.tab.size();
		/*默认选中的选项卡的href属性值*/
		opt.option.href = opt.option.href?(opt.tabs.find("[href='"+opt.option.href+"']").size()==0?$tmp.attr("href"):opt.option.href):$tmp.attr("href");
		/*默认选中的选项卡的CSS样式名称*/
		opt.option.style = opt.option.style?opt.option.style:"hover";
		/*默认选项卡的轮换方式*/
		opt.option.type = opt.option.type?opt.option.type:"click";
		/*渐显的速度*/
		opt.option.speed = opt.option.speed?opt.option.speed:"slow";
		/*切换前执行的函数*/
		opt.option.beforeChange = 'undefined'==typeof(opt.option.beforeChange) ? null : opt.option.beforeChange;
		opt.option.beforeOneChange = 'undefined'==typeof(opt.option.beforeOneChange) ? null : opt.option.beforeOneChange;

		/*选项卡左右移动JQ对象集合*/
		if ( opt.option.scalable )
		{
			opt.move = opt.o.find("[data-exec='prev'],[data-exec='next']").css({position:"absolute",zIndex:1,cursor:"pointer"});
			if(opt.tab.size()*opt.tabWidth>opt.o.width()){
				opt.move.show();
			}else{
				opt.move.hide();
			}
			opt.move.unbind();
			opt.move.bind("click",function(){
				if($(this).data("exec")=="prev"){
					/*调用向左移动*/
					$.jqTabs.moveLR(-1);
				}else{
					/*调用向右移动*/
					$.jqTabs.moveLR(1);
				}
			});
		}
		
		opt.o.attr('nj_tabs_html', 'true').data('style', opt.option.style);
		return t(opt.o);
	};
	$.jqTabs = {
		each:function(_, $this){
			/*选项卡轮换*/
			if ( false===opt.animated )
			{
				return _;
			}
			
			var style = $this.closest('[nj_tabs_html]').data('style');
			$this.addClass(style);
			
			opt.animated = false;
			$(opt.option.href).fadeIn(opt.option.speed, function(){
				opt.animated = true;
				var thisFn = $this.closest('[nj_tabs_html]').data('fn');
				if("function"==typeof(thisFn)){thisFn($this);}
			});
			
			_.each(function(){
				var _this = $(this);
				var href = _this.attr("href");
				if(href!=opt.option.href){
					_this.removeClass(style);
					$(href).hide();
				}
			});
			return _;
		},
		getHref:function(_,_$){
			opt.option.href = _$.attr("href");
		},
		add:function(_,_json){
			/*添加新选项卡*/
			
			var _this = this;
			_this.unbind();
			
			var _itemattr = _.attr("href");
			/*
			** 判断该选项卡是否已经添加
			** 如果没有添加则添加该选项卡
			** 如果已添加则使其至于显示状态
			*/
			if(undefined==_itemattr || ''==_itemattr || 'javascript'==_itemattr.substr(0, 10) || 0==$(_itemattr).size())
			{
				/*关闭按钮*/
				var btcls = "<div"+(_json.closeClass?" class=\""+_json.closeClass+"\"":"")+" style=\"line-height:normal;position:absolute;overflow:hidden;\" data-exec=\"close\">"+(_json.closeHtml!=undefined?_json.closeHtml:"x")+"</div>";
				
				var _href = "#tabs-"+(++opt.o.count);
				
				/*添加标签对应的内容*/
				$(opt.o.find("ul li:last").attr("href")).after("<div id=\"tabs-"+opt.o.count+"\""+(_json.attr?" "+_json.attr:"")+"></div>");
				
				/*添加标签*/
				var $label = $("<li href=\""+_href+"\"style=\"position:relative;\">"+(_json.close?btcls:"")+_json.label+"</li>").appendTo(opt.o.find("ul"));
				$label.attr('referer', _.parents('html').parent().get(0).location.href);
				
				/*设置选中选项卡的href属性值*/
				_.attr("href",_href);
				opt.option.href = _href;
				
				/*调用关闭按钮样式*/
				if(_json.close){
					this.closeCss($label.children("[data-exec='close']"));
				}
				
				/*调用移动选项卡至可见区域方法*/
				_this.move(opt.tab.size()+1);
				
				/*
				** 根据内容调用类别显示相应内容
				** 调用内容方式有一下几种：
				** (1) text：直接显示传递内容
				** (2) ajax：AJAX调用（_json.text即为调用URL地址）
				** (3) iframe：添加iframe框架（_json.text即为引用URL地址）
				*/
				switch(_json.type){
					case "text":
						$(_href).html(_json.text);
						break;
					case "ajax":
						if(_json.text!="" && _json.text!=undefined){
							$(_href).load(_json.text,{r:new Date().getTime()},function(){
								if(typeof(_json.call)){_json.call();}
							});
						}
						break;
					case "iframe":
						var _iframe = $("<iframe src=\""+_json.text+"\" frameborder=\"0\" width=\"100%\" scrolling=\"auto\"></iframe>").appendTo(_href);
						var height = parseInt($(opt.option.href).style("height"));
						if(!height){
							_iframe.one("load",function(){
								_iframe = _iframe.get(0);
								var _ifm = _iframe.contentWindow.document;
								_iframe.height = Math.min(_ifm.body.scrollHeight, _ifm.documentElement.scrollHeight);
							});
						}else{
							_iframe.height(height);
						}
						break;
				}
			}else{
				/*设置默认显示选项卡为当前已添加的选项卡*/
				opt.option.href = _itemattr;

				switch(_json.type)
				{
					case "text":
						$(_href).html(_json.text);
						break;
					case "ajax":
						if(_json.text!="" && _json.text!=undefined){
							$(_href).load(_json.text,{r:new Date().getTime()},function(){
								if(typeof(_json.call)){_json.call();}
							});
						}
						break;
					case "iframe":
						//$(opt.option.href).find('iframe').get(0).contentWindow.location.reload();
						$(opt.option.href).find('iframe').attr('src', _json.text);
						break;
				}
				
				/*调用移动方法使当前选项卡移至可见区域*/
				_this.move(_this.getTabIndex(_itemattr)+1);
			}
			
			/*设置已经添加过的选项卡数量*/
			opt.option.count = opt.o.count;
			/*重新调用选项卡轮换功能*/
			opt.o.tabs(opt.option,opt.fn);
			/*调用关闭按钮监听事件方法*/
			_this.close();
		},
		text:function(_href,_text){
			/*内容赋值*/
			
			$(_href).html(_text);
		},
		unbind:function(){
			/*卸载选项卡监听事件*/
			
			opt.tab.each(function(){
				$(this).unbind();
			});
		},
		close:function(){
			/*关闭选项卡及对应的内容*/
			
			var _this = this;
			
			/*卸载关闭选项卡监听事件*/
			var $close = opt.tabs.find("li [data-exec='close']");
			$close.each(function(){
				$(this).unbind();
			});
			
			/*添加关闭选项卡监听事件*/
			$close.each(function(){
				var self = $(this);
				self.one("click",function(){
					_this.unbind();
					var $parent = self.parent("li");
					$parent.animate({width:"0px",opacity:"0"},300,function(){
						/*等待选项卡最小化过程执行结束后回调函数*/
						
						/*当前选项卡对应的href属性值*/
						var _href = $parent.attr("href");
						/*当前选项卡的下一个选项卡的JQ对象*/
						var $next = $parent.next("li");
						/*当前选项卡的上一个选项卡的JQ对象*/
						var $prev = $parent.prev("li");
						
						/*移除当前选项卡*/
						$parent.remove();
						/*移除当前对应的内容对象*/
						$(_href).remove();
						
						/*
						** 如果关闭的选项卡是当前显示的选项卡则执行执行相应功能
						** 如果当前选项卡的下一个选项卡存在则使下一个选项卡至于显示状态
						** 如果当前选项卡的下一个选项卡不存在则使上一个选项卡至于显示状态
						*/
						if(opt.option.href==_href){
							if($next.size()>0){
								opt.option.href = $next.attr("href");
								opt.o.tabs(opt.option,opt.fn);
								/*使下一个选项卡至于可见区域*/
								_this.move(_this.getTabIndex($next.attr("href"))+1);
							}else if($prev.size()>0){
								opt.option.href = $prev.attr("href");
								opt.o.tabs(opt.option,opt.fn);
								/*使上一个选项卡至于可见区域*/
								_this.move(_this.getTabIndex($prev.attr("href"))+1);
							}
						}else{
							opt.o.tabs(opt.option,opt.fn);
							_this.move(_this.getTabIndex(opt.option.href)+1);
						}
					});
				});
			});
		},
		closeCss:function($close){
			/*设置关闭按钮默认样式*/
			
			/*默认CSS样式集合JSON*/
			var _css = {};
			var _width = $close.style("width");
			var _height = $close.style("height");
			var _top = $close.css("top");
			var _right = $close.css("right");
			var _bottom = $close.css("bottom");
			var _left = $close.css("left");
			
			if(this.defaultCss(_width)){
				_css.width = "12px";
			}
			if(this.defaultCss(_height)){
				_css.height = "12px";
				_css.lineHeight = "12px";
			}
			if(this.defaultCss(_top) && this.defaultCss(_bottom)){
				_css.top = "0px";
			}
			if(this.defaultCss(_right) && this.defaultCss(_left)){
				_css.right = "0px";
			}
			$close.css(_css);
		},
		defaultCss:function(val){
			return (val==undefined || val=="" || val=="auto");
		},
		move:function(n){
			/*移动选项卡至可见区域*/
			
			/*根据选项卡索引及宽度计算选项卡所在容器对象的margin-left样式值*/
			var marl = (n-Math.floor(opt.o.width()/opt.tabWidth))*opt.tabWidth;
			/*如果计算的结果小于0则使其等于0*/
			marl = marl>0?-marl:0;
			
			opt.tabs.animate({marginLeft:marl+"px"},400);
		},
		moveLR:function(_dir){
			/*
			** 左右移动选项卡
			** _dir=-1 向左移动选项卡
			** _dir=1 向右移动选项卡
			*/
			
			/*计算移动的宽度，即设定选项卡所在容器对象的margin-left样式的值*/
			var marl = Math.abs(parseInt(opt.tabs.css("marginLeft")))+_dir*opt.tabWidth;
			var _marl = marl-opt.tabWidth;
			marl = marl>0?-marl:0;
			
			if(_dir==1){
				/*如果最后一个选项卡已可见，则不再移动*/
				if(_marl+opt.o.width()<opt.tab.size()*opt.tabWidth){
					opt.tabs.animate({marginLeft:marl+"px"},400);
				}
			}else{
				opt.tabs.animate({marginLeft:marl+"px"},400);
			}
		},
		getTabIndex:function(_href){
			/*
			** 读取选项卡的索引，即在选项卡集合中的第几个选项卡，从0开始计算
			** _itemattr：选中的选项卡的href属性值
			*/
			
			var _n = -1;
			opt.tab.each(function(n){
				if($(this).attr("href")==_href){
					_n = n;return false;
				}
			});
			return _n;
		}
	};
	function t(){
		var $tabl = opt.o.find("li[href]").css({'float':'left','cursor':'pointer'});
		$.jqTabs.each($tabl, opt.o.find("li[href='"+opt.option.href+"']")).bind(opt.option.type, function(){
			var $this = $(this), ret;
			if ( 'function'==typeof(opt.option.beforeChange) )
			{
				ret = opt.option.beforeChange(this);
				if ( false===ret )
				{
					return false;
				}
			}
			if ( 'function'==typeof(opt.option.beforeOneChange) )
			{
				if ( true!==$this.data('beforeOneChangeFlag') )
				{
					$this.data('beforeOneChangeFlag', true);
					ret = opt.option.beforeOneChange(this);
					if ( false===ret )
					{
						return false;
					}
				}
			}

			$.jqTabs.getHref($tabl, $this);
			$.jqTabs.each($tabl, $this);
		});
		return opt.o;
	}
})(jQuery);