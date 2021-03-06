/**
 * @Purpose: 多选品牌
 			依赖关系:
				1. 1.3.2及以上版本jQuery库文件
				2. /js/libs/Page.js
 * @Author: zhangheng
 * @Created: 2014-08-04 21:12
 */



(function(){
	var BASEURI = window.BASEURI || '/';
	
	
	var $brandMultiContainer, $searchForm, $selectedListBrand, $brandResult;
	
	var productCateHtml = '<style type="text/css">\
		#selectedListBrand{display:none;}\
		#searchResult li{float:left;width:25%;text-align:center;}\
		#searchResult img{max-width:100px;}\
		</style>\
		<div id="brandMultiContainer">\
			<div><form id="searchForm"></form></div>\
			<ul id="selectedListBrand"></ul>\
			<div id="searchResult" class="searchResult" data-initialize="false"></div>\
		</div>';
	document.write(productCateHtml);
	
	$brandMultiContainer = $('#brandMultiContainer');
	$searchForm = $brandMultiContainer.find('#searchForm');
	$selectedListBrand = $brandMultiContainer.find('#selectedListBrand');
	$brandResult = $brandMultiContainer.find('#searchResult');
	
	/**
	 * @Purpose: 26个大写英文字母
	 */
	var formText='<ul>', i=65;
	formText += '<a href="javascript:" target="_self">全部</a>';
	for ( ; i<91; i++ )
	{
		formText += '<a href="javascript:" target="_self">'+String.fromCharCode(i)+'</a>';
	}
	formText += '</ul><input type="text" id="key" name="key" />\
		<input type="hidden" id="pinyin" name="pinyin" value="" />\
		<input type="button" id="btnSearchBrand" value="查 找" />';
	$searchForm.html(formText).find('ul a').bind('click', function(){
		var $this = $(this), pinyin = $this.html();
		$this.addClass('checked').siblings('a').removeClass('checked');
		$searchForm.find('#pinyin').val(/^[A-Z]$/.test(pinyin) ? pinyin : '');
		searchBrand();
	});
	
	/**
	 * @Purpose: 读取推荐品牌并追加到推荐列表
	 */
	var popularBrands = [];
	for ( i=0; i<popularBrand.length; i++ )
	{
		popularBrands.push('<li data-id="'+popularBrand[i].value+'" data-name="'+popularBrand[i].name+'"><img src="'+popularBrand[i].logo+'" /></li>');
	}
	popularBrands.push('<div class="clear"></div>');
	$brandResult.html(popularBrands.join(''));
	
	
	function setPosition()
	{
		if ( 'undefined'!=typeof($.jqDialog) ) $.jqDialog.setPosition();
	}
	
	
	function assignHtml(data)
	{
		var i=0, html='';
		for ( ; i<data.length; i++ )
		{
			html += '<li data-id="'+data[i].id+'">'+data[i].name+'</li>';
		}
		html += '<div class="clear"></div>';
		return html;
	}
	
	/**
	 * @Purpose: 从服务器获取品牌数据
	 */
	var searchBrand = function()
	{
		var page = new Page($brandResult);
		page.url = BASEURI+'gajax/brands';
		page.setData($searchForm.serializeArray());
		page.request(assignHtml, setPosition);
	};
	searchBrand();
	
	/**
	 * @Purpose: 点击查找按钮获取数据
	 */
	$searchForm.find('#btnSearchBrand').bind('click', function(){
		searchBrand();
	});
	
	
	
	/**
	 * @Purpose: 判断选择品牌是否已经在选中列表中
	 */
	function inBrandSelected(value)
	{
		var index = -1;
		$selectedListBrand.find('li').each(function(n){
			if ( index>-1 ) return false;
			if ( $(this).data('id')==value )
			{
				index = n;
				return false;
			}
		});
		return index;
	}
	
	/**
	 * @Purpose: 选择品牌
	 */
	live('#brandMultiContainer #searchResult li[data-id]', 'click', function(){
		var $this=$(this), value=$this.data('id'), text=$this.data('name') || $this.html();
		if ( inBrandSelected(value)<0 )
		{
			$('<li data-id="'+value+'">'+text+'</li>').appendTo($selectedListBrand.show());
			setPosition();
		}
	});
	
	/**
	 * @Purpose: 删除已选择的品牌
	 */
	live('#brandMultiContainer #selectedListBrand li', 'click', function(){
		$(this).remove();
		if ( 0==$selectedListBrand.find('li').size() )
		{
			$selectedListBrand.hide();
		}
		setPosition();
	});
})();


function getSelectedBrand()
{
	var brandNames = [], brandIds = [];
	$('#brandMultiContainer').find('#selectedListBrand li').each(function(){
		var $this = $(this);
		brandNames.push($this.html());
		brandIds.push($this.data('id'));
	});
	return {'brandNames':brandNames, 'brandIds':brandIds};
}