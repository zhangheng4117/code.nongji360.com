/**
 * @purpose budge(上移下移功能)
 				依赖关系:
				1. 1.3.2及以上版本jQuery库文件
				2. /js/ui/alert/jquery.alerts.js
 * @author zhangheng
 * @Copyright (c) 2014 www.nongji360.com,All Rights Reserved
 * @created 2014-10-11
 * @modified 2014-10-11
 * @version 2014.1011.1
 */


(function($){
	$.jqBudge = {
		'move':function($this, option){
			var thisClosest=$this.closest(option.closest), items=thisClosest.parent().children(option.closest),
				dir=$this.data('dir') || $this.data('rel'), thatClosest;
			
			if ( 0==dir || 'up'==dir )
			{
				if ( option.firstIndex==items.index(thisClosest) )
				{
					jAlert('已经到达最顶部');
					return false;
				}
				thatClosest = thisClosest.prev().before(thisClosest);
			}
			else if( 1==dir || 'down'==dir )
			{
				if ( option.lastIndex==items.size()-items.index(thisClosest)-1 )
				{
					jAlert('已经到达最底部');
					return false;
				}
				thatClosest = thisClosest.next().after(thisClosest);
			}
			else
			{
				return false;
			}
			
			if ( 'function'===typeof(option.fn) )
			{
				option.fn(thisClosest, thatClosest);
			}
			
			return true;
		}
	};
	
	$.fn.extend({
		budge:function(option){
			var self = $(this);
			/**
			 * @purpose 需要移动的最近的元素层，默认为[data-id]
			 */
			if ( !option.closest ) option.closest = '[data-id]';
			/**
			 * @purpose 顶部允许移动到的位置，默认为0即第一个元素
			 */
			if ( !option.firstIndex ) option.firstIndex = 0;
			/**
			 * @purpose 底部允许移动到的位置，默认为0即最后一个元素(从零开始)
			 */
			if ( !option.lastIndex ) option.lastIndex = 0;
			
			if ( 'function'==typeof($.fn.live) )
			{
				self.live('click', function(){
					$.jqBudge.move($(this), option);
				});
			}
			else
			{
				self.on('click', function(){
					$.jqBudge.move($(this), option);
				});
			}
			
			return self;
		}
	});
})(jQuery);