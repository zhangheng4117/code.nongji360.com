/**
 * @Purpose: select(自定义下拉菜单功能)
 			依赖关系:
				1. 1.7.2以上1.9.1以下版本jQuery库文件
 * @Author: zhangheng
 * @Copyright (c) 2012 www.nongji360.com,All Rights Reserved
 * @Created: 2012-08-01
 * @Modified: 2014-09-27
 * @Version: 2014.0927.12
 */


(function($){
	var g={},config={
		'size':new Array(1),
		'multiple':new Array(false),
		'o':[],
		'height':null,
		'maxHeight':300,
		'borderCSS':[],
		'zIndex':[],
		'fn':[],
		'wrap':[],
		'append':[],
		'onTriggerChange':[]
	};
	var index = -1;
	$.fn.option = function(opt,fn){
		if ( $(this).size()<1 ) return this;
		if ( undefined!=this.attr('select-index') ) return this;
		
		index++;
		opt = opt || {};
		g = typeof(opt)=="object" && !$.isArray(opt)?opt:{};
		g.first = true;
		g.css = {};
		if(typeof(opt)=="function"){
			config.fn[index] = opt;
			config.onTriggerChange[index] = function(){};
		}else{
			config.fn[index] = typeof fn=="function"?fn:function(){};
			config.onTriggerChange[index] = typeof opt.onTriggerChange=="function"?opt.onTriggerChange:function(){};
		}
		g.dd = $(this).find("dd");
		config.borderCSS[index] = g.borderCSS || null;
		config.zIndex[index] = g.zIndex || 1000;
		setConfig(this);
		return init(this);
	};
	
	/*功能函数*/
	$.jqOption = {
		getValue:function(o){
			var _values = [];
			o.find("dd[selected]").each(function(){
				var $this = $(this);
				_values.push(undefined==$this.attr('value') ? $this.data('value').toString() : $this.attr('value'));
			});
			return _values.join(',');
		},
		getText:function(o){
			var texts = [];
			o.find("dd[selected]").each(function(){
				texts.push($(this).html());
			});
			return texts.join(',').replace(/<span([^>]+)>([^>]+)<\/span>/ig, '');
		},
		setValue:function(o, value, callback){
			var _name = o.data('name') || o.attr("name") || o.attr("id");
			if(_name==undefined || _name==""){return;}
			var oSelect = o.next("input:hidden[name='"+_name+"']");
			var isFlag = !(false===callback) && !(oSelect.val()==value);
			oSelect.val(undefined==value?"":value);

			var _select_index = o.children("div[id^='select-options-']:first").attr("id").replace("select-options-","");
			if ( isFlag )
			{
				if(true!==g.first || g.firstCallback)
				{
					if(typeof config.fn[_select_index]=="function"){config.fn[_select_index](value);}
				}
			}
			if ( true===o.data('humanTrigger') )
			{
				/**
				 * @purpose 在人为触发的时候的回调函数
				 */
				if ( 'function'==typeof(config.onTriggerChange[_select_index]) )
				{
					config.onTriggerChange[_select_index](value);
				}
			}
			o.data('humanTrigger', false);
			return o;
		},
		val:function(o,value){
			return value==undefined?this.getValue(o):this.setValue(o,value);
		},
		pushValue:function(o,value){
			var _this = this;
			var oVal = value.toString().split(",");
			var _select_index = o.children("div[id^='select-options-']:first").attr("id").replace("select-options-","");
			var $selected;
			if(config.size[_select_index]==1){
				_this.setValue(o,oVal[0]);
				$selected = o.find("[value='"+oVal[0]+"']").css("backgroundColor","#e5e5e5").attr("selected","selected");
				o.find("[id^='select-selected']").html($selected.html());
			}else{
				_this.setValue(o,value);
				for(var i=0; i<oVal.length; i++){
					o.find("[value='"+oVal[i]+"'],[data-value='"+oVal[i]+"']").css("backgroundColor","#e5e5e5").attr("selected","selected");
				}
			}
		},
		setDefault:function(o){
			var _this = this;
			o.attr("select-index",index);
			g.dd.attr("id","select-option-"+index);
			var $wrap = o.wrapInner("<div id=\"select-options-"+index+"\">");
			config.wrap[($wrap.data('name') || $wrap.attr("name") || $wrap.attr("id"))+'_'+index] = $wrap;
			
			if(config.size[index]==1){
				var $dt = o.find("dd[selected]:eq(0)");
				if($dt.size()==0){$dt = o.find("dd:eq(0)");}
				_this.slide(o, $dt=$("<dt id=\"select-selected-"+index+"\" style=\"height:"+config.height+"px;line-height:"+config.height+"px;\">"+$dt.html()+"</dt>").prependTo(o));
				var paddingRight=parseInt($dt.css('paddingRight'))||3, paddingLeft=parseInt($dt.css('paddingLeft'))||3;
				$dt.css({'padding-right':paddingRight+'px', 'padding-left':paddingLeft+'px'});
			}
			g.dd.attr("backgroundColor",g.dd.css("backgroundColor"));
			var $first = o.find("dd:first");
			o.after("<input type=\"hidden\" name=\""+(o.data('name') || o.attr("name") || o.attr("id"))+"\" value=\""+(undefined==$first.attr('value') ? $first.data("value") : $first.attr('value'))+"\" />");
			if(o.find("dd[selected]").css("backgroundColor","#e5e5e5").size()>0)
			{
				_this.setValue(o, _this.getValue(o));
			}
			else
			{
				$first = o.find("dd:first");
				if ( $first.size()>0 )
				{
					$first.attr('selected', 'selected');
					_this.setValue(o, _this.getValue(o));
				}
			}
		},
		slide:function(o,jObj){
			if(!o || !jObj || true===o.data('disabled')){return;}
			var _this = this;
			jObj.bind("click",function(){
				menuPosition(o);
				o.children("div[id^='select-options-']:hidden").size()>0?_this.down(o):_this.up(o);
			});
		},
		down:function(o){
			var _height = o.find("dd").size()*(o.data("height") || config.height),
				oWrap = o.children("div[id^='select-options-']");
			_height = _height>config.maxHeight?config.maxHeight:_height;
			oWrap.css({"display":"block","overflow-y":"hidden","overflow-x":"hidden"}).animate({"height":_height+"px"},300,function(){
				$(this).css("overflow-y","auto");
			});
		},
		up:function(o){
			var $opts = o.children("div[id^='select-options-']");
			if ( $opts.is(":visible") )
			{
				$opts.css("overflow-y","hidden").animate({"height":"0px"},300,function(){
					$(this).hide();
				});
			}
		},
		click:function(o, $this, callback){
			g.first = false;
			/*下拉菜单点击选择*/
			if ( $this.size()>0 )
			{
				var _select_index = $this.attr("id").substr($this.attr("id").lastIndexOf("-")+1);
				if(config.multiple[_select_index]){
					if(g.ctrlKey){
						this.multi(o, $this);
					}else{
						this.one(o, $this);
					}
				}else{
					this.one(o, $this);
				}
				this.setValue(o, this.getValue(o), callback);
			}
		},
		one:function(o,jObj){
			o.find("[selected]").removeAttr("selected");

			if ( 'object'!=typeof(jObj) )
			{
				jObj = $(o.find('[data-value="'+jObj+'"],[value="'+jObj+'"]').get(0));
			}

			jObj.attr("selected","selected");
			var _select_index = jObj.attr("id").substr(jObj.attr("id").lastIndexOf("-")+1);
			if(config.size[_select_index]==1){
				var $selected = o.children("#select-selected-"+_select_index);
				$selected.html(this.getText(o)).data("value",jObj.data("value"));
				this.up(o);
			}
			var $dd = $("[select-index='"+_select_index+"'] dd");
			$dd.css("backgroundColor",$dd.attr("backgroundColor"));
			g.css.backgroundColor =	"#e5e5e5";
			jObj.css("backgroundColor",g.css.backgroundColor);
		},
		multi:function(o,jObj){
			if ( 'object'!=typeof(jObj) )
			{
				jObj = o.find('[data-value="'+jObj+'"],[value="'+jObj+'"]');
			}

			var _attr = jObj.get(0).getAttribute("selected");
			if(_attr=="true" || _attr=="selected"){
				jObj.removeAttr("selected");
				g.css.backgroundColor = jObj.attr("backgroundColor");
				jObj.css("backgroundColor",g.css.backgroundColor);
			}else{
				jObj.attr("selected","selected");
				g.css.backgroundColor =	"#e5e5e5";
				jObj.css("backgroundColor",g.css.backgroundColor);
			}
		},
		append:function(name,json, callback){
			if(!$.isArray(json) || 0===json.length){return;}
			var o = config.wrap[name].children("div[id^='select-options-']");
			if(0==o.size()){return;}
			var $noSelect = o.children("dd:not([selected])");
			var attr = {};
			if(0==$noSelect.size()){$noSelect = o.children("dd:first");}
			if(0==$noSelect.size()){
				attr.id = o.attr("id").replace("options","option");
				attr.style = "padding:"+config.padding;
			}else{
				attr.id = $noSelect.attr("id");
				attr.style = $noSelect.attr("style");
			}
			var backgroundColor = config.wrap[name].attr("backgroundColor");
			if(undefined==backgroundColor || ""==backgroundColor){backgroundColor = "transparent";}
			for(var i=0; i<json.length; i++){
				$("<dd id=\""+attr.id+"\" style=\""+attr.style+"\" data-value=\""+json[i].value+"\""+(json[i].selected?" selected=\"selected\"":"")+" backgroundColor=\"transparent\">"+json[i].text+"</dd>").appendTo(o).css("backgroundColor",backgroundColor);
			}
			var $selected = config.wrap[name].find('dd[selected]:first');
			if ( 0==$selected.size() )
			{
				$selected = config.wrap[name].find('dd:first');
				this.setValue(config.wrap[name], $selected.attr('value') || $selected.data('value'), callback);
			}
			else
			{
				this.click(config.wrap[name], $selected, callback);
			}
			ddAppend(o);
		},
		remove:function(name, gte, callback){
			if(isNaN(parseInt(gte))){gte = 0;}
			var _this = this;
			var o = config.wrap[name].children("div[id^='select-options-']");
			o.find("dd:gt("+gte+")").remove();
			o.find("dd:eq("+gte+")").remove();
			var $first = o.find("dd:first");
			
			if(0==$first.size()){
				config.wrap[name].children("dt:first").html("");
				_this.setValue(config.wrap[name], "", callback);
			}else{
				config.wrap[name].children("dt:first").html($first.html());
				_this.setValue(config.wrap[name], $first.attr("value") || $first.data("value"), callback);
			}
		}
	};
	
	/*设定下拉菜单的绝对位置*/
	menuPosition = function(o){
		var $menu = o.children("div[id^='select-options-']");
		var _oOff = o.offset();
		var outerWidth=o.outerWidth();
		if(config.size[index]==1){
			/*下拉菜单*/
			if ( 'content-box'==o.css('boxSizing') )
			{
				outerWidth -= (parseInt(config.borderWidth) || 0)*2;
			}
			$menu.css({"width":outerWidth+"px"});
		}else{
			if(config.size[index]<g.dd.size()){
				if ( 'border-box'==o.css('boxSizing') )
				{
					var borderLeftWidth=parseInt(o.css('borderLeftWidth') || 0),
						borderRightWidth=parseInt(o.css('borderRightWidth') || 0);
					if ( o.outerWidth()>0 )
					{
						o.width(o.outerWidth()+borderLeftWidth+borderRightWidth);
					}
				}
			}
		}
		if ( 'border-box'==o.css('boxSizing') )
		{
			_oOff.top -= parseInt(o.css("borderBottomWidth")) || 0;//底部边框宽度
		}
		else
		{
			_oOff.top += parseInt(o.css("borderBottomWidth")) || 0;
		}
		var position, minus=['fixed', 'absolute'], inheritPosition=false;
		while ( o && o.size()>0 && undefined!=o.prop('tagName') )
		{
			position = o.css('position');
			if ( undefined!=position && ''!=position && null!=position )
			{
				position = position.toLowerCase();
				if ( $.inArray(position, minus)>-1 )
				{
					_oOff.top -= (parseInt(o.css('top')) || 0) + (parseInt(o.css('borderTopWidth')) || 0);
					_oOff.left -= (parseInt(o.css('left')) || 0) + (parseInt(o.css('borderLeftWidth')) || 0);
					inheritPosition = true;
				}
				else if ( 'relative'==position )
				{
					//_oOff.top -= (parseInt(o.css('top')) || (o.offset().top-$(window).scrollTop)) + (parseInt(o.css('borderTopWidth')) || 0);
					//_oOff.left -= (parseInt(o.css('left')) || (o.offset().left-$(window).scrollLeft)) + (parseInt(o.css('borderLeftWidth')) || 0);
					//inheritPosition = true;
				}
			}
			o = o.parent();
		}
		if ( inheritPosition )
		{
			var $window = $(window);
			_oOff.top -= $window.scrollTop();
			_oOff.left -= $window.scrollLeft();
		}
		$menu.css({"top":(_oOff.top+config.height)+"px","left":_oOff.left+"px"});
	};
	
	/*设置配置值*/
	setConfig = function(o){
		if(g.size){config.size[index]=parseInt(g.size,10);}
		if(!config.size[index]){config.size[index]=1;}
		if(g.multiple){config.multiple[index]=g.multiple;}else{
			config.multiple[index] = o.get(0).getAttribute("multiple");
		}
		config.multiple[index] = (config.multiple[index]===true || config.multiple[index]==="true" || config.multiple[index]==="multiple" || config.multiple[index]==="") && config.size[index]>1;
		config.append[index] = g.append ? g.append : false;
		if(g.height){config.height=parseInt(g.height);}
		if(!config.height)
		{
			config.height = parseInt(o.css('height')) || 22;
		}
		o.data('height', config.height);
		if(g.maxHeight){config.maxHeight=g.maxHeight;}
		if(!config.maxHeight){config.maxHeight=300;}
		if(g.margin)
		{
			config.margin=g.margin;
		}
		else
		{
			config.margin = o.css("marginTop")=="12px"?"0px":o.css("marginTop")+" "+o.css("marginRight")+" "+o.css("marginBottom")+" "+o.css("marginLeft");
			if(config.margin==""){config.margin = "0px";}
		}
		o.attr("backgroundColor",o.css("backgroundColor"));
		config.margin = config.margin.replace(/auto/g,"0px");
		if(g.padding){config.padding=g.padding;}else{
			switch(o.css("padding")){
				case "0px":
				case "":
					config.padding = "0 3px";
					break;
				default:
					config.padding = o.css("padding");
			}
		}
		if(g.borderStyle){config.borderStyle=g.borderStyle;}else{
			switch(o.css("borderStyle")){
				case "none":
				case "":
					config.borderStyle = "solid";
					break;
				default:
					config.borderStyle = o.css("borderStyle");
			}
		}
		if(g.borderWidth){config.borderWidth=g.borderWidth;}else{
			switch(o.css("borderWidth")){
				case "medium":
				case "0px":
				case "":
					config.borderWidth = "1px";
					break;
				default:
					config.borderWidth = o.css("borderWidth");
			}
		}
	};
	
	
	/**
	 * @Purpose: 向下拉菜单中追加自定义文本标签
	 */
	var ddAppend = function(o)
	{
		var _select_index = o.attr('select-index') || o.attr("id").substr(o.attr("id").lastIndexOf("-")+1),
			labels = config.append[_select_index];
		if ( false!=labels )
		{
			for ( var i=0; i<labels.length; i++ )
			{
				var label = '<span style="position:absolute;top:0;'+(labels[i].style ? labels[i].style : '')+'">'+labels[i].text+'</span>';
				var $dd = o.find('dd:gt(0)').css('position', 'relative');
				var $label = $(label).appendTo($dd);
				if ( 'function'===typeof(labels[i].fn) )
				{
					$label.bind('click', function(e){
						$(this).data('fn')($(this).parent(), e);
					}).data('fn', labels[i].fn);
				}
			}
		}
	};
	
	
	/*初始化SELECT表单*/
	init = function(o){
		g.ctrlKey = false;
		config.o[index] = o;
		$.jqOption.setDefault(o);
		
		var outerHeight = config.size[index]*config.height;
		if ( 'border-box'==o.css('boxSizing') )
		{
			var borderTopWidth=parseInt(o.css('borderTopWidth') || 0),
				borderBottomWidth=parseInt(o.css('borderBottomWidth') || 0);
			outerHeight += borderTopWidth+borderBottomWidth;
		}
		o.css({"height":outerHeight+"px","margin":config.margin,"borderStyle":config.borderStyle,"borderWidth":config.borderWidth,"overflow":"hidden","cursor":"default","list-style-type":"none"});
		g.dd.css({"height":config.height+"px","lineHeight":config.height+"px","margin":"0px","padding":config.padding,"overflow":"hidden"});

		var outerWidth=o.outerWidth();
		if(config.size[index]==1){
			/*下拉菜单*/
			var $menu = o.children("div[id^='select-options-']");
			$menu.css({
				"height":"0px",
				"backgroundColor":("transparent"==o.css("backgroundColor") || "rgba(0,0,0,0)"==o.css("backgroundColor").replace(/ /g, '')?"#fff":o.css("backgroundColor")),
				"display":"none","position":"absolute","zIndex":config.zIndex[index]
			});
			if ( null==config.borderCSS[index] )
			{
				$menu.css({
					"borderStyle":config.borderStyle,"borderWidth":config.borderWidth,
					"borderColor":o.css("borderBottomColor")
				});
			}
			else
			{
				$menu.css('border', config.borderCSS[index]);
			}
			menuPosition(o);
			/*改变窗口大小调正下拉箭头和下拉菜单的位置*/
			$(window).resize(function(){
				menuPosition(o);
			});
		}else{
			o.css({"overflow-y":"auto"});
			if(config.size[index]<g.dd.size()){
				if ( 'border-box'==o.css('boxSizing') )
				{
					var borderLeftWidth=parseInt(o.css('borderLeftWidth') || 0),
						borderRightWidth=parseInt(o.css('borderRightWidth') || 0);
					if ( o.outerWidth()>0 )
					{
						o.width(o.outerWidth()+borderLeftWidth+borderRightWidth);
					}
				}
			}
		}
		
		if ( 'function'==typeof($.fn.live) )
		{
			g.dd.live('mouseover', ddMouseOver).live('mouseout', ddMouseOut).live('click', ddClick);
		}
		else
		{
			o.on('mouseover', 'dd', ddMouseOver).on('mouseout', 'dd', ddMouseOut).on('click', 'dd', ddClick);
		}
		
		o.get(0).onselectstart=function(){return false;};
		
		function ddMouseOver()
		{
			/*鼠标划过下拉菜单样式*/
			var $this = $(this);
			g.css.backgroundColor = $this.css("backgroundColor");
			$this.css({"backgroundColor":"#e5e5e5"});
		}
		function ddMouseOut()
		{
			$(this).css({"backgroundColor":g.css.backgroundColor});
		}
		function ddClick()
		{
			o.data('humanTrigger', true);
			$.jqOption.click(o, $(this));
		}
		
		ddAppend(o);
		
		return o;
	};


	function documentClick(event)
	{
		/*点击其它区域闭合所有下拉选项*/
		var _tagName = event.target.tagName,
			_tagId = 'form'==_tagName.toLocaleLowerCase() ? '' : event.target.id,
			_select_index = _tagId.substr(_tagId.lastIndexOf("-")+1),
			i;
		switch ( _tagId )
		{
			case "select-options-"+_select_index :
			case "select-option-"+_select_index :
			case "select-selected-"+_select_index :
				for(i=0;i<config.o.length;i++){
					if(_select_index!=i && config.size[i]==1)$.jqOption.up(config.o[i]);
				}
				break;
			default:
				for(i=0;i<config.o.length;i++){
					if(config.size[i]==1) $.jqOption.up(config.o[i]);
				}
		}
	}
	
	$(document).unbind("click").bind("click", documentClick).bind("keydown",function(event){
		/*判断是否按下了<Ctrl>键*/
		g.ctrlKey = event.which===17;
	}).bind("keyup",function(){
		g.ctrlKey = false;
	});
})(jQuery);