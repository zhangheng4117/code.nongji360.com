/**
 * @purpose 跳转到o2o.nongji360.com下的搜索功能
 * @author zhangxp
 * @created 2016-11-16 16:47
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
	var $select = $topSearchForm.find('[name="searchCate"]');
	switch ( $select.val() )
	{
		case 'o2oSearch' :
			$topSearchForm.attr('action', HTTP_O2O+'/search');
			break;
		case 'o2oOffer' :
			$topSearchForm.attr('action', HTTP_O2O+'/offer/search');
			break;
		case 'o2oShop' :
			$topSearchForm.attr('action', HTTP_O2O+'/shop/search');
			break;
		default :
			$topSearchForm.attr('action', HTTP_O2O+'/search');
	}
});