/**
 * @Purpose: 多选品牌
 			依赖关系:
				1. 1.7.2及以上版本jQuery库文件
				2. /js/libs/http.js get
				3. /js/a/linkage.js
 * @Author: zhangheng
 * @Created: 2014-08-04 09:10
 */


var $productCategoryMultiForm, $productCategoryTabs, $productCategoryCategoryHot, $selectedListCategory;

/**
 * @Purpose: 允许选择的最终级别，可选值有：2|3|空
 */
var allowLevel;
(function(){
	/**
	 * @Purpose: 页面引用当前js文件script对象
	 * @Type: object
	 */
	var _current = document.getElementsByTagName("script");
	_current = _current[_current.length-1];
	
	http.url = _current.src;
	
	allowLevel = http.get('level');
	if ( '2'!=allowLevel ) allowLevel = '3';
	
	
	var productCateHtml = '<style type="text/css">\
		#selectedListCategory{display:none;}\
		.hot-category{width:400px;border:solid #ccc 1px;}\
		.cascade-category dl{float:left;width:260px;margin:0 10px;border:solid #ccc 1px;}\
		</style>\
		<div id="productCategoryMultiForm">\
			<div id="selectedListCategory"></div>\
			<div id="productCategoryTabs">\
				<ul>\
					<li href="#productCategoryTabs-1">常用分类</li>\
					<li href="#productCategoryTabs-2">全部分类</li>\
				</ul>\
				<div style="clear:both;"></div>\
			</div>\
			<div id="productCategoryTabs-1">\
				<dl name="category_hot" class="hot-category"><dd value="0,0,0">常用分类</dd></dl>\
			</div>\
			<div id="productCategoryTabs-2" class="cascade-category">\
				<dl name="categoryId1"><dd value="0">一级类</dd></dl>\
				<dl name="categoryId2"><dd value="0">二级类</dd></dl>\
				<dl name="categoryId3"><dd value="0">三级类</dd></dl>\
			</div>\
		</div>';
	document.write(productCateHtml);
	
	$productCategoryMultiForm = $('#productCategoryMultiForm');
	$productCategoryTabs = $productCategoryMultiForm.find('#productCategoryTabs');
	$productCategoryCategoryHot = $productCategoryMultiForm.find('dl[name="category_hot"]');
	$productCategoryCategoryCascade = $productCategoryMultiForm.find('dl[name^="categoryId"]');
	$selectedListCategory = $productCategoryMultiForm.find('#selectedListCategory');
	
	
	/**
	 * @Purpose: 读取常用分类并追加到常用分类下拉列表
	 */
	var popularCategorys = [];
	if ( 'undefined'!=typeof popularCategory )
	{
		for ( var i=0; i<popularCategory.length; i++ )
		{
			popularCategorys.push('<dd value="'+popularCategory[i].value+'">'+popularCategory[i].name+'</dd>');
		}
	}
	$productCategoryCategoryHot.append(popularCategorys.join('')).option({
		'height':36,
		'size':10,
		'append':[
			{
				'text':'选择',
				'style':'right:20px;',
				'fn':function(self){
					var $dl=self.parents('dl:eq(0)'), value=$.jqOption.getValue($dl);
					if ( value==self.attr('value') && '0,0,0'!=value && inCategorySelected(value)<0 )
					{
						$('<ul><li>'+$.jqOption.getText($dl)+'</li><li class="remove">删除</li><input type="hidden" name="categories[]" value="'+value+'" /></ul>')
							.appendTo($selectedListCategory.show()).data('value', value);
						setPosition();
					}
				}
			}
		]
	}, function(value){
		if ( '0,0,0'!=value && inCategorySelected(value)<0 )
		{
			$('<ul><li>'+$.jqOption.getText($productCategoryCategoryHot)+'</li><li class="remove">删除</li><input type="hidden" name="categories[]" value="'+value+'" /></ul>')
				.appendTo($selectedListCategory.show()).data('value', value);
			setPosition();
		}
	});
	
	$productCategoryTabs.tabs({'type':'click'});
	
	
	var appends;
	if ( '2'==allowLevel )
	{
		appends = [
			false,
			[
				{
					'text':'下一级',
					'style':'left:160px;',
					'fn':nextLavelProductCategory
				},
				{
					'text':'选择',
					'style':'left:210px;',
					'fn':theBidProductCategory
				}
			],
			[
				{
					'text':'选择',
					'style':'left:210px;',
					'fn':theBidProductCategory
				}
			]
		];
	}
	else
	{
		appends = [
			false,
			[
				{
					'text':'下一级',
					'style':'left:210px;',
					'fn':nextLavelProductCategory
				}
			],
			[
				{
					'text':'选择',
					'style':'left:210px;',
					'fn':theBidProductCategory
				}
			]
		];
	}
	
	
	/**
	 * @Purpose: 全部分类
	 */
	$productCategoryTabs.find('li[href$=2]').one('click', function(){
		$productCategoryCategoryCascade.linkage(productCates, {
			'fn':finalProductCategory,
			'append':appends,
			'height':36,
			'size':10
		});
	});
})();


/**
 * @Purpose: 最终选择分类
 */
function completeProductCategory(value, self)
{
	if ( '0'==value && 2==self.data('index') ) return false;
	
	/**
	 * @Purpose: self.data('index')表示当前选择的是第几级分类
	 */
	var aHtml=[], $dl, $selected, values=[0, 0, 0], i=0;
	for ( ; i<=self.data('index'); i++ )
	{
		$dl = $productCategoryMultiForm.find('dl[name="categoryId'+(i+1)+'"]');
		$selected = $dl.find('[selected]');
		if ( $selected.index()>0 )
		{
			aHtml.push($.jqOption.getText($dl));
			value = $selected.attr('value') || $selected.data('value');
			if ( ''!=value )
			{
				values[i] = value;
			}
		}
	}
	
	value = values.join(',');
	if ( inCategorySelected(value)<0 )
	{
		$('<ul><li>'+aHtml.join(' &gt; ')+'</li><li class="remove">删除</li><input type="hidden" name="categories[]" value="'+value+'" /></ul>')
			.appendTo($selectedListCategory.show())
			.data('value', value);
		setPosition();
	}
}

/**
 * @Purpose: 下一级绑定点击事件
 */
function nextLavelProductCategory(self)
{
	var $dl=self.parents('dl:eq(0)'), $categoryId=$dl.next('input:hidden');
	if ( self.attr('value')==$categoryId.val() && 1==$dl.nextAll('dl').find('dd').size() )
	{
		$categoryId.val(0);
		$.jqOption.setValue($dl, self.attr('value'));
	}
}

/**
 * @Purpose: 点击选项的选择按钮
 */
function theBidProductCategory(self, e)
{
	e.stopPropagation();
	var $dl=self.parents('dl:eq(0)'), $nextOption=$dl.nextAll('dl:eq(0)');
	$.jqOption.click($dl, self, false);
	if ( $nextOption.size()>0 )
	{
		$.jqOption.remove($nextOption.attr('name'), 1, false);
	}
	completeProductCategory(self.attr('value'), $dl);
}

/**
 * @Purpose: 如果当前是最后一级分类，则自动按选择处理
 */
function finalProductCategory(value, self)
{
	if ( 1==$productCategoryCategoryCascade.size()-self.data('index') )
	{
		completeProductCategory(value, self);
	}
}

/**
 * @Purpose: 判断选择分类是否已经在选中列表中
 */
function inCategorySelected(value)
{
	//alert(value);
	var index = -1;
	$selectedListCategory.find('ul').each(function(n){
		if ( index>-1 ) return false;
		if ( $(this).data('value')==value )
		{
			index = n;
			return false;
		}
	});
	return index;
}

/**
 * @Purpose: 删除已选择的分类
 */
live('#productCategoryMultiForm #selectedListCategory li.remove', 'click', function(){
	$(this).parents('ul:eq(0)').remove();
	if ( 0==$selectedListCategory.find('ul').size() )
	{
		$selectedListCategory.hide();
	}
	setPosition();
});


/**
 * @Purpose: 使弹出的对话框在屏幕中间
 */
function setPosition()
{
	if ( 'undefined'!=typeof($.jqDialog) ) $.jqDialog.setPosition();
}