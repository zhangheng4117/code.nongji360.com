(function($){
	$.fn.slideSingle=function(option){
		var $this = $(this);
		if ( 0==$this.size() ) return $this;
		
		var opts = option || {};
		var $elems=$this.find("[data-rel='elem']");
		if ( 0==$elems.size() ) return $this;
		
		var $elem=$($elems.get(0));
		//单个元素宽度
		opts.elemWidth = $elem.outerWidth()+parseInt($elem.css("marginLeft"))+parseInt($elem.css("marginRight"));
		opts.main = $this.find("[data-rel='main']");
		opts.parentWidth = opts.main.parent().innerWidth();
		
		opts.main.width(opts.elemWidth*$elems.size());
		
		opts.loop = true===opts.loop;
		$this.data("opts", opts);
		
		/* 向左移动 */
		$this.find("[data-rel='left']").unbind("click", moveHorizontal).bind("click", function(){
			moveHorizontal($this, -opts.elemWidth);
		});
		/* 向右移动 */
		$this.find("[data-rel='right']").unbind("click", moveHorizontal).bind("click", function(){
			moveHorizontal($this, opts.elemWidth);
		});
		return $this;
	};
	
	/* 左右移动 */
	var moveHorizontal=function($this, ml){
		var opts = $this.data("opts");
		if ( opts.main.is(":animated") ) return false;
		opts.marginLeft = opts.marginLeft || parseInt(opts.main.css("marginLeft"));
		
		if ( ml>0 )
		{
			//第一个元素已可见
			if ( opts.marginLeft>=0 )
			{
				if ( opts.loop )
				{
					opts.marginLeft = -(opts.main.width()+opts.elemWidth-ml);	//循环
				}
				else
				{
					return false;	//终止
				}
			}
		}
		else
		{
			//最后一个元素已可见
			if ( opts.parentWidth-opts.marginLeft>=opts.main.width() )
			{
				if ( opts.loop )
				{
					opts.marginLeft = -ml;	//循环
				}
				else
				{
					return false;	//终止
				}
			}
		}
		
		opts.marginLeft += ml;
		opts.main.animate({"marginLeft":opts.marginLeft+"px"}, 500);
		
		$this.data("opts", opts);
	}
})(jQuery);