/**
 * @Purpose: 点击搜索按钮(header部分)
 * @Author: zhangheng
 */
$("#topSearch [rel='search']").bind("click", function(){
	/**
	 * @Purpose: form表单jQuery对象
	 * @Type: object
	 */
	var _form = $("#soForm");
	
	/**
	 * @Purpose: 关键词文本框jQuery对象
	 * @Type: object
	 */
	var _key = _form.find("[name='key']");
	
	if ( ""==_key.val() )
	{
		_key.focus();
		return false;
	}
	
	_form.submit();
});

/**
 * @Purpose: 点击搜索类别把对应的类别标识赋值给相应form表单的隐藏域
 * @Author: zhangheng
 */
$("#topSearch [soMark]").bind("click", function(){
	/**
	 * @Purpose: this jQuery对象
	 * @Type: object
	 */
	var _this = $(this);
	
	/**
	 * @Purpose: form表单jQuery对象
	 * @Type: object
	 */
	var _form = $("#soForm");
	
	/**
	 * @Purpose: 搜索类别标识隐藏域jQuery对象
	 * @Type: object
	 */
	var _jMark = _form.find("[name='soMark']");
	_jMark.val(_this.attr('soMark'));
	
	$("a[soMark]").removeClass("hover");
	_this.addClass("hover");
});


/**
 * @Purpose: 头部(header部分)搜索类别标识，明显标记当前类别
 * @Author: zhangheng
 */
(function(){
	/**
	 * @Purpose: 标识隐藏域jQuery对象
	 * @Type: object
	 */
	var _jIsoMark = $("#soForm [name='soMark']");
	
	/**
	 * @Purpose: 标识隐藏域value值
	 * @Type: string
	 */
	var _soMark = _jIsoMark.val();
	
	/**
	 * @Purpose: 标识值对应的类别标签jQuery对象，若标识为空则为第一个对象
	 * @Type: object
	 */
	var _jMark = null;
	if ( !!_soMark )
	{
		_jMark = $("#topSearch [soMark='"+_soMark+"']");
	}
	else
	{
		_jMark = $("#topSearch [soMark]:eq(0)");
		_jIsoMark.val(_jMark.attr("soMark"));
	}
	
	_jMark.addClass("hover");
})();



/**
 * @purpose 新版网站各子站的头部搜索框功能，根据不同的搜索类别跳转不同的搜索页面
 * @author zhangheng
 * @created 2014-12-24 21:40
 */
var $topSearchForm=$('#searchForm');
$topSearchForm.bind('submit', function(){
	var $k = $topSearchForm.find('#k');
	if ( ''==$k.val() )
	{
		/*
		 * @purpose 搜索关键词为空，不执行搜索操作
		 */
		$k.focus();
		return false;
	}

	var $select = $topSearchForm.find('select').removeAttr('name');
	switch ( $select.val() )
	{
		case 'news' :
			$topSearchForm.attr('action', HTTP_NEWS+'/list');
			break;
		case 'video' :
			$topSearchForm.attr('action', HTTP_VIDEO+'/list');
			break;
		case 'image' :
			$topSearchForm.attr('action', HTTP_IMAGE+'/list/s');
			break;
		default :
			$topSearchForm.attr('action', HTTP_NEWS+'/list/redirect');
			$select.attr('name', 'mark');
	}
});