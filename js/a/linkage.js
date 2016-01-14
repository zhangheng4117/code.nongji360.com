/**
 * @Purpose: JS生成页码，AJAX分页获取数据
 			依赖关系:
				1. 1.7.2及以上版本jQuery库文件
				2. /js/libs/Fn.js random
				3. /js/jquery/jquery.select.js
 * @Author: zhangheng
 * @Created: 2014-07-18 15:09
 */


(function($){
	$.fn.extend({
		linkage:function(variable, option){
			if ( undefined!=this.attr('linkage-rel') ) return this;
			var selector=$(this), iSize=selector.size(), rel;
			if ( undefined==variable || !$.isArray(variable) ) return selector;
			
			option = option || {};
			option.size = !/^[\d]+$/.test(option.size) ? 1 : option.size;
			option.height = !/^[\d]+$/.test(option.height) ? null : option.height;
			option.firstCallback = false!==option.firstCallback;
			if ( !$.isArray(option.value) )
			{
				option.value = [];
			}
			var appends = option.append ? option.append : [];
			delete option.append;
			
			
			rel = fn.random(10000, 99999);
			while ( $("[linkage-rel='"+rel+"']").size()>0 )
			{
				rel = fn.random(10000, 99999);
			}
			
			selector.each(function(n){
				var $this=$(this), sHtml;
				option.value[n] = undefined==option.value[n] ? (undefined==$this.attr('value') ? $this.data('value') : $this.attr('value')) : '';
				option.value[n] = RegEx.number(option.value[n]) ? parseInt(option.value[n]) : '';
				if ( $.isArray(appends) )
				{
					option.append = appends[n];
				}
				else
				{
					if ( 'object'==typeof(appends) ) option.append = appends;
				}
				
				$this.attr('linkage-dl', n).attr('linkage-rel', rel).data('index', n);
				if ( n<iSize-1 )
				{
					$this.data('next_option', true);
				}
				var i = 0;
				if ( 0==n )
				{
					sHtml = '';
					for ( i=0; i<variable.length; i++ )
					{
						sHtml += '<dd data-value="'+variable[i].i+'"'+(variable[i].i==option.value[n] ? ' selected="selected"' : '')+' var_index="'+i+'">'+variable[i].n+'</dd>';
					}
					$this.append(sHtml);
				}
				else
				{
					if ( undefined!=option.value[n] )
					{
						var children, thisVarIndex, flagChild=true;
						children = variable;
						for ( i=0; i<n; i++ )
						{
							thisVarIndex = parseInt($("[linkage-rel='"+rel+"'][linkage-dl='"+i+"'] [selected]").attr('var_index'));
							if ( !isNaN(thisVarIndex) && thisVarIndex>-1 && children[thisVarIndex] && children[thisVarIndex].c )
							{
								children = children[thisVarIndex].c;
							}
							else
							{
								flagChild = false;
								break;
							}
						}
						if ( true==flagChild )
						{
							sHtml = '';
							for ( i=0; i<children.length; i++ )
							{
								sHtml += '<dd data-value="'+children[i].i+'"'+(children[i].i==option.value[n] ? ' selected="selected"' : '')+' var_index="'+i+'">'+children[i].n+'</dd>';
							}
							$this.append(sHtml);
						}
					}
				}
				
				/**
				 * @Purpose: 以下为选择选项(change)回调方法
				 */
				$this.option(option, function(val){
					if ( true===$this.data('next_option') )
					{
						var varIndex = parseInt($this.find('dd[selected]').attr('var_index')),
							linkageIndex = $this.data("index"), children, thisVarIndex, flagChild=true, execCmd='';
						
						$("dl[linkage-rel='"+rel+"']:gt("+linkageIndex+")").each(function(){
							var $this = $(this);
							$.jqOption.remove(($this.data('name') || $this.attr('name') || $this.attr('id'))+'_'+$this.attr('select-index'), 1, false);
						});
						
						if ( isNaN(varIndex) )
						{}
						else
						{
							$this.data('var_index', varIndex);
							
							children = variable;
							for ( var i=0; i<=linkageIndex; i++ )
							{
								thisVarIndex = $("[linkage-rel='"+rel+"'][linkage-dl='"+i+"']").data('var_index');
								if ( thisVarIndex>-1 && children[thisVarIndex] && children[thisVarIndex].c )
								{
									execCmd += '['+thisVarIndex+'].c';
									children = children[thisVarIndex].c;
								}
								else
								{
									flagChild = false;
									break;
								}
							}
							
							if ( true==flagChild && false!=$this.data('cascadeOne') )
							{
								/**
								 * @Purpose: 该菜单下有子菜单
								 */
								
								if ( 'object'==typeof(children) )
								{
									/**
									 * @Purpose: 子菜单为对象类型，即在变量中直接列出子菜单内容
									 */
									var $nextOption = $("[linkage-rel='"+rel+"'][linkage-dl='"+(linkageIndex+1)+"']");
									if ( $nextOption.size()>0 )
									{
										var _name = ($nextOption.data('name') || $nextOption.attr('name') || $nextOption.attr('id'))+'_'+$nextOption.attr('select-index');
										var _value = undefined==$nextOption.attr('value') ? $nextOption.data('value') : $nextOption.attr('value');
										var ddOptions = [];
										for ( i=0; i<children.length; i++ )
										{
											//ddOptions.push({'value':children[i].i, 'text':children[i].n, 'selected':_value==children[i].i});
											ddOptions.push({'value':children[i].i, 'text':children[i].n});
										}
										
										$nextOption.find('dd').removeAttr('selected');
										$.jqOption.remove(_name, 1, false);
										$.jqOption.append(_name, ddOptions, false);
										//$.jqOption.click($nextOption, $nextOption.find('dd[data-value="'+_value+'"]'));
										$nextOption.find('dd:gt(0)').each(function(n){
											$(this).attr('var_index', n);
										});
										$.jqOption.click($nextOption, $nextOption.find('dd[data-value="'+_value+'"]'));
									}
								}
								else if ( 'number'==typeof(children) && 1==children && option.ajax )
								{
									/**
									 * @Purpose: 子菜单为数值类型且值为1，则ajax获取子菜单
									 */
									
									$.post(option.ajax, {'pid':val}, function(data){
										if ( undefined!=data.redirect )
										{
											window.location.href = data.redirect;
										}

										var $nextOption = $("[linkage-rel='"+rel+"'][linkage-dl='"+(linkageIndex+1)+"']");
										if ( $nextOption.size()>0 )
										{
											children = data;
											var _name = ($nextOption.data('name') || $nextOption.attr('name') || $nextOption.attr('id'))+'_'+$nextOption.attr('select-index');
											var _value = undefined==$nextOption.attr('value') ? $nextOption.data('value') : $nextOption.attr('value');
											var ddOptions = [];
											for ( i=0; i<children.length; i++ )
											{
												ddOptions.push({'value':children[i].i, 'text':children[i].n});
											}
											
											$nextOption.find('dd').removeAttr('selected');
											$.jqOption.remove(_name, 1, false);
											$.jqOption.append(_name, ddOptions, false);
											$nextOption.find('dd:gt(0)').each(function(n){
												$(this).attr('var_index', n);
											});
											$.jqOption.click($nextOption, $nextOption.find('dd[data-value="'+_value+'"]'));
										}
										
										if ( ''!=execCmd )
										{
											eval('variable'+execCmd+'=data;');
										}
									}, 'json');
								}
							}
							$this.removeData('cascadeOne');
						}
					}
					
					/**
					 * @Purpose: 执行自定义回调函数，公用函数
					 */
					if ( 'function'==typeof(option.fn) )
					{
						option.fn(val, $this);
					}
					
					/**
					 * @Purpose: 执行自定义回调函数，当前下拉菜单函数
					 */
					if ( $.isArray(option.funs) && 'function'==typeof(option.funs[n]) )
					{
						option.funs[n](val, $this);
					}
				});
			});
			
			
			return selector;
		}
	});
})(jQuery);