var M = {
	"mobile":(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)) && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent),
	"bind" : function(selector, handler){
		if ( "function"!==typeof handler ) return false;
		var $selector = "string"===typeof selector ? $(selector) : selector;
		if ( 0==$selector.size() ) return false;
		
		if ( this.mobile )
		{
			$selector.bind("touchmove", function(){
				var $this = $(this);
				$this.attr("zhTouchMoved", "true");
			}).bind("touchend", function(e){
				var $this = $(this);
				$this.attr("zhTouchMoved") ? $this.removeAttr("zhTouchMoved") : handler($this, e);
			});
		}
		else
		{
			$selector.bind("click", function(e){
				var $this = $(this);
				handler($this, e);
			});
		}
		
		return $selector;
	},
	"live" : function(selector, handler){
		if ( "function"!==typeof handler ) return false;
		var $selector = "string"===typeof selector ? $(selector) : selector;
		if ( 0==$selector.size() ) return false;
		
		if ( this.mobile )
		{
			$selector.live("touchmove", function(){
				var $this = $(this);
				$this.attr("zhTouchMoved", "true");
			}).live("touchend", function(e){
				var $this = $(this);
				$this.attr("zhTouchMoved") ? $this.removeAttr("zhTouchMoved") : handler($this, e);
			});
		}
		else
		{
			$selector.live("click", function(e){
				var $this = $(this);
				handler($this, e);
			});
		}
		
		return $selector;
	},
	"hover" : function(selector, handlerStart, handlerEnd){
		if ( "function"!==typeof handlerStart ) return false;
		var $selector = "string"===typeof selector ? $(selector) : selector;
		$selector.live("touchstart", function(e){
			handlerStart($(this), e);
		});
		if ( "function"===typeof handlerEnd )
		{
			$selector.bind("touchend", function(e){
				handlerEnd($(this), e);
			});
		}
		
		return $selector;
	}
};