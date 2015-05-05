/**
* @Purpose: 计算图片大小并限制指定尺寸，如果源图片对象超过限制尺寸则让其等于限制尺寸，同比缩小
* @Param: object imgObj 图片对象
* @Param: object sourceObj 源图片对象
* @Param: integer width 限制图片宽度
* @Param: integer height 限制图片高度
* @Author: zhangheng
*/
function calculate(imgObj, sourceObj, width, height){
	if ( imgObj.width>width )
	{
		/**
		* @Purpose: 如果源图片对象宽度超过限制宽度则等比缩小源图像尺寸
		*/
		imgObj.height = imgObj.height*(width/imgObj.width);
		imgObj.width = width;
		
		sourceObj.height(imgObj.height);
		sourceObj.width(imgObj.width);
	}
	if ( imgObj.height>height )
	{
		/**
		* @Purpose: 如果源图片对象高度超过限制高度则等比缩小源图像尺寸
		*/
		imgObj.width = imgObj.width*(height/imgObj.height);
		imgObj.height = height;
		
		sourceObj.width(imgObj.width);
		sourceObj.height(imgObj.height);
	}
}


/**
* @Purpose: 限制图片对象尺寸，若浏览器版本高于ie6或非ie浏览器则设置CSS样式(max-width和max-height)，否则计算图片大小
* @Param: string selector 图片对象jQuery选择器
* @Param: integer width 限制图片宽度
* @Param: integer height 限制图片高度
* @Author: zhangheng
*/
function imageLimit(selector, width, height){
	/**
	* @Purpose: 图片jQuery对象
	* @Type: object
	*/
	var _selector = "string"==typeof(selector) ? $(selector) : selector;
	
	if ( ( $.browser && $.browser.msie && $.browser.version<7 ) || ( window['Browser'] && Browser.msie && Browser.version<7 ) )
	{
		/**
		* @Purpose: 当前浏览器版本低于ie7
		*/
		
		/**
		* @Purpose: 创建图片对象，使图片对象地址等于源图片对象地址，用于计算（源图片对象不参与计算）
		*/
		var image = new Image();
		_selector.each(function(){
			/**
			* @Purpose: this对象jQuery对象
			* @Type: object
			*/
			var _this = $(this);
			
			image.src = _this.attr("src");
			
			if ( image.complete )
			{
				/**
				* @Purpose: 如果图片已经在缓存中则直接计算图片尺寸，不必重新加载图片
				*/
				calculate(image, _this, width, height);
				return false;
			}
			image.onload = function(){
				/**
				* @Purpose: 图片加载完毕后执行尺寸计算
				*/
				calculate(image, _this, width, height);
			}
		});
	}
	else
	{
		_selector.css({"max-width":width+"px", "max-height":height+"px"});
	}
}


/**
* @Purpose: 图片加载错误则显示默认图片
* @Param: string selector jQuery选择器
* @Param: string imgSrc 默认图片
* @Author: zhangheng
*/
function imageError(selector, imgSrc){
	("string"==typeof(selector) ? $(selector) : selector).unbind("error").bind("error", function(){
		$(this).attr("src", imgSrc);
	});
}