/**
 * @Purpose: 
 * 省份 <input class="regionChk region1" name="regionChk1" type="checkbox" value="2" var_index="0">
 * 市   <input class="regionChk region2" name="regionChk1" type="checkbox" value="3" var_index="0"> 其中class=region2  2是上一级的id
 * 县   <input class="regionChk region3" name="regionChk2" type="checkbox" value="4" var_index="0"> 其中class=region3  3是上一级的id
 * =======等等类似
 * 数据依赖 regionLibs.js
 * @Author: zhangxp
 * @Created: 2015-02-26 14:33
 */

(function($){
		$.fn.extend({
			regionCheck:function(variable, option){
				$this=this;
				$this.find('dt').each(function(e){
					$(this).html('');
				})
				$this.each(function(n){
					//已经选中的地区id 用于默认勾选已经选择的多选框
					var $isChkList=$(this).attr("value").split(',');
					var children, thisVarIndex, flagChild=true,$t=$(this),$contain=$t.find('dt');
					children = variable;
					if ( 0==n )
					{
						sHtml = '<div class="childList" data-parent_indexs="">';
						for ( var i=0; i<variable.length; i++ )
						{
							sHtml += '<dd><input class="regionChk" name="regionChk'+n+'" type="checkbox" checked="checked" value="'+variable[i].i+'" var_index="'+i+'" var_title="'+variable[i].n+'">'+variable[i].n+'</dd>';
						}
						sHtml +='</div>';
						$contain.append(sHtml);
					}
					//省份
					if(1==n){
						children=children[0].c
						sHtml = '<div style="color: #ff0000; font-weight: bold"><input type="checkbox" id="regionNational" value="0"> 全国</div><div class="childList" data-parent_indexs="0">';
						for ( var i=0; i<children.length; i++ )
						{
							sHtml += '<dd><input class="regionChk region1" name="regionChk'+n+'" type="checkbox" value="'+children[i].i+'" var_index="'+i+'" var_title="'+children[i].n+'">'+children[i].n+'</dd>';							
						}
						sHtml +='</div>';
						$contain.append(sHtml);	
						//省份勾选功能
						if(""==$isChkList){
							return false;
						}
						if(0==$isChkList){
							$t.find("input[value=0]").attr("checked","checked");
							return false;
						}
						for(var m=0;m<$isChkList.length;m++){
							$t.find("input[value="+$isChkList[m]+"]").attr("checked","checked");
							
							//地级市的包含标签 
							var $tCity=$t.next();
							var $tindex=$t.find("input[value="+$isChkList[m]+"]").attr('var_index');
							//有省份勾选的话就推送数据到 地级市
							var $childrenCity=children[$tindex].c
							var $sHtmlCity = '<div class="childList" data-parent_indexs="0,'+$tindex+'" data-sort='+children[$tindex].i+' style="clear:both">';
							$sHtmlCity += '<h3>'+children[$tindex].n+'</h3>';
							for ( var i=0; i<$childrenCity.length; i++ )
							{
								$sHtmlCity += '<dd><input class="regionChk region'+children[$tindex].i+'" name="regionChk2" type="checkbox" value="'+$childrenCity[i].i+'" var_index="'+i+'" var_title="'+$childrenCity[i].n+'">'+$childrenCity[i].n+'</dd>';							
							}
							$sHtmlCity +='</div>';
							$tCity.find('dt').append($sHtmlCity);
							  //地级市默认选中的地区
							  var $isChkListCity=$tCity.attr("value").split(',');
							  //地级市勾选
							  for(var k=0;k<$isChkListCity.length;k++){
								  $tCity.find("input[value="+$isChkListCity[k]+"]").attr("checked","checked");
								  //alert($tCity.find("input[value="+$isChkListCity[k]+"]").length);
								  //县级市的包含标签
								  var $tSeat=$tCity.next();
								  var $tindexSeat=$tCity.find("input[value="+$isChkListCity[k]+"]").attr('var_index');
								  var $provinceId=$tCity.find("input[value="+$isChkListCity[k]+"]").parents("div").data("sort");
								  //判断是否是该省份下的地级市 如果是的话才推送数据
								   if($provinceId==children[$tindex].i){
									  //有地级市勾选的话就推送数据到 县级市
									  if(undefined!=$childrenCity[$tindexSeat].c){
										  var $childrenSeat=$childrenCity[$tindexSeat].c;
										  var $sHtmlSeat = '<div class="childList" data-parent_indexs="0,'+$tindex+','+$tindexSeat+'" data-sort='+$childrenCity[$tindexSeat].i+' style="clear:both">';
										  $sHtmlSeat += '<h3>'+children[$tindex].n+'-'+$childrenCity[$tindexSeat].n+'</h3>';
										  for ( var i=0; i<$childrenSeat.length; i++ )
										  {
											  $sHtmlSeat += '<dd><input class="regionChk region'+$childrenCity[$tindexSeat].i+'" name="regionChk3" type="checkbox" value="'+$childrenSeat[i].i+'" var_index="'+i+'" var_title="'+$childrenSeat[i].n+'">'+$childrenSeat[i].n+'</dd>';
										  }
										  $sHtmlSeat +='</div>';
										  $tSeat.find('dt').append($sHtmlSeat);
									  }
								  }
							  }
						}											
					}
					if(3==n){
						//勾选默认的县级市的数据
						 //县级市勾选
						 for(var k=0;k<$isChkList.length;k++){
						 $t.find("input[value="+$isChkList[k]+"]").attr("checked","checked");
						 }
					}
				})
			//	alert(variable[0].c[1].c[0].n);
				//如果勾选全国 则将已经勾选的左右的省市县取消选择
				$("html").on("click","#regionNational",function(e){
					var $r=$(this)
					if($r.is(":checked")){
						$(".regionChk").removeAttr("checked");
						//将省份一下的地区数据清空
						$this.each(function(e){
							if(e>1){
								$(this).find("dt").html('');
							}
						})
					}
				})
				//多选选择处理
				$("html").off('click','.regionChk');
				$("html").on("click",".regionChk",function(e){
					//判断是否选择了全国了 如果选择了 就不能选中
					if($("#regionNational").is(":checked")){
						alert("您已经勾选了全国了");
						return false;
					}
					//判断是否被选中
					var $t=$(this),children;
					
					//获取当前选中的值和索引号 以及数据层次
					var $nowValue=$t.val();
					var $nowIndex=$t.attr('var_index');
					var $nowParentIndex=$t.parents("div").data("parent_indexs");
					var $ParentIndex=$nowParentIndex.toString().split(',');
				
					if($t.is(":checked")){
					//选中后为子菜单加入数据						
						//该地区下级内容添加到的地方
						var $part=$t.parents("dl").next().find("dt");
						//第几层数据
						var $layer=$t.parents("dl").next().index();
						children=variable;
						var $title='';
						//获取父级的  index 并且 查询当前子级的数据
						for(var i=0 ;i<$ParentIndex.length;i++){
							$title=$title+children[$ParentIndex[i]].n+'-';
							children=children[$ParentIndex[i]].c;							
						}
						if(undefined==children[$nowIndex].c){
							//没有下级栏目就不处理了
							}						
						else{
							sHtml = '<div class="childList" data-parent_indexs="'+$nowParentIndex+','+$nowIndex+'" data-sort='+children[$nowIndex].i+' style="clear:both">';
							sHtml += '<h3>'+$title.replace('中国-','')+children[$nowIndex].n+'</h3>';
							for ( i=0; i<children[$nowIndex].c.length; i++ )
							{
								sHtml += '<dd><input class="regionChk region'+children[$nowIndex].i+'" name="regionChk'+$layer+'" type="checkbox" value="'+children[$nowIndex].c[i].i+'" var_index="'+i+'" var_title="'+children[$nowIndex].c[i].n+'">'+children[$nowIndex].c[i].n+'</dd>';
							}
							sHtml +="</div>";
							//将得到的数据插入到栏目的那个位置  排序
							var $childlength=$part.find('.childList').length;
							if($childlength>0){
								$part.find('.childList').each(function(index, element) {
									var $sort=$(this).data("sort");//即为改地区唯一的id号码
									
									if($sort>children[$nowIndex].i){
										$(this).before(sHtml);
										return false ;
									}
									else{
										//如果没有且循环到最后了 就将该数据放到末尾的位置
										//alert($childlength-1)
										/*if($sort==children[$nowIndex].i){
											//已经添加过了
											alert('已经添加过了')
											return false ;
											}*/

											if(index==($childlength-1)){
												$(this).after(sHtml);
												return false;
											}

									}	
								});
							}
							else{
								$part.append(sHtml);
								}
						}
					}
					else{
						//删除子菜单中加入过的数据
						$this.find('div[data-parent_indexs^="'+$nowParentIndex+','+$nowIndex+'"]').remove();
					}
				})				
				return self;
			}
		});
	})(jQuery);