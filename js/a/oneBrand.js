/**
 * @purpose 多选品牌
 			依赖关系:
				1. 1.3.2及以上版本jQuery库文件
				2. /js/libs/Page.js
 * @author zhangheng
 * @created 2014-10-09 21:00
 */



(function(){
	var BASEURI = window.BASEURI || '/';
	
	
	var $brandOneContainer, $searchForm, $brandResult;
	
	var productCateHtml = '<style type="text/css">\
		#selectedListBrand{display:none;}\
		#searchResult li{float:left;width:25%;text-align:center;}\
		#searchResult img{max-width:100px;}\
		</style>\
		<div id="brandOneContainer">\
			<div><form id="searchForm"></form></div>\
			<ul id="selectedListBrand"></ul>\
			<div id="searchResult" class="searchResult" data-initialize="false"></div>\
		</div>';
	document.write(productCateHtml);
	
	$brandOneContainer = $('#brandOneContainer');
	$searchForm = $brandOneContainer.find('#searchForm');
	$brandResult = $brandOneContainer.find('#searchResult');
	
	/**
	 * @Purpose: 26个大写英文字母
	 */
	var formText='<ul>', i=65;
	for ( ; i<91; i++ )
	{
		formText += '<a href="javascript:" target="_self">'+String.fromCharCode(i)+'</a>';
	}
	formText += '</ul><input type="text" id="key" name="key" />\
		<input type="hidden" id="pinyin" name="pinyin" value="" />\
		<input type="button" id="btnSearchBrand" value="查 找" />\
		<a href="javascript:void(0);" target="_self" rel="diy_brand">自定义品牌</a>\
		<input type="text" id="diy_brand" placeholder="请输入品牌名称" class="none" data-rel="diy_brand" />\
		<a id="diy_brand_btn" href="javascript:void(0);" target="_self" class="none" data-rel="diy_brand">确定</a>';
	$searchForm.html(formText).find('ul a').bind('click', function(){
		$searchForm.find('#pinyin').val($(this).html());
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
	 * @purpose 点击品牌选中
	 */
	live('#brandOneContainer li[data-id]', 'click', function(){
		var $this=$(this), value=$this.data('id'), text=$this.data('name') || $this.html();
		var $frontend=$brandOneContainer.data('frontend'), $backend=$brandOneContainer.data('backend');
		if ( 'object'==typeof($frontend) && $frontend.size()>0 )
		{
			$frontend.val(text);
			$backend.val(value);
			$.jqDialog.hide();
		}
	});


	/**
	 * @purpose 添加自定义品牌
	 */
	$searchForm.find('[rel="diy_brand"]').click(function(){
		$(this).hide();
		$searchForm.find('[data-rel="diy_brand"]').show();
	});
	/**
	 * @purpose 确认添加自定义品牌
	 */
	$searchForm.find('#diy_brand_btn').click(function(){
		var $brand = $searchForm.find('#diy_brand'), brand = $brand.val();
		if ( ''==brand )
		{
			$brand.focus();
			return false;
		}
		var $frontend=$brandOneContainer.data('frontend'), $backend=$brandOneContainer.data('backend');
		if ( 'object'==typeof($frontend) && $frontend.size()>0 )
		{
			$frontend.val(brand);
			$backend.val('');
		}
		$searchForm.find('[data-rel="diy_brand"]').hide();
		$searchForm.find('[rel="diy_brand"]').show();
		$.jqDialog.hide();
	});
})();