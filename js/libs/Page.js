/**
 * @purpose JS生成页码，AJAX分页获取数据
 			依赖关系:
				1. 1.3.2以上版本jQuery库文件
				2. /js/a/common.js live
 * @param container string | object 容器,选择器或者jq对象
 * @author zhangheng
 * @created 2014-08-05 17:15
 */
function Page(container)
{
	this.object = 'string'==typeof(container) ? $(container) : container;

	/**
	 * @purpose 数据体
	 * @var JSON
	 */
	this.data = {};

	/**
	 * @purpose 请求URL
	 * @var string
	 */
	this.url = '';

	/**
	 * @purpose 数据总条数
	 * @var int
	 */
	this.count = 0;

	/**
	 * @purpose 当前页数
	 * @var int
	 */
	this.page = 1;

	/**
	 * @purpose 总页数
	 * @var int
	 */
	this.pages = 0;

	/**
	 * @purpose 每页显示的数据条数
	 * @var int
	 */
	this.size = 0;

	/**
	 * @purpose 页面是否显示首尾页
	 */
	this.firstLast = true;

	/**
	 * @purpose 显示页码数
	 * @var int
	 */
	this.number = 10;

	/**
	 * @purpose 开始页码
	 * @var int
	 */
	this.startNumber = 1;

	/**
	 * @purpose 截止页码
	 * @var int
	 */
	this.endNumber = 1;

	/**
	 * @purpose 页码CSS样式
	 * @var string
	 */
	this.pageNumberCss = false;

	/**
	 * @purpose 加载更多监听按钮
	 * @var object
	 */
	this.listenButton = null;

	/**
	 * @purpose 滚动到页面底部是否自动加载下一页数据，当且仅当listenButton不等于null时有效
	 * @var boolean
	 */
	this.autoLoad = false;

	/**
	 * @purpose 加载时按钮显示的文字，当且仅当listenButton不等于null时有效
	 * @var string
	 */
	this.loadingWord = '正在加载更多';
}



/**
 * @purpose 设置AJAX发送数据，把数据格式化成JSON格式数据
 * @param data array | string 请求页面发送的数据
 */
Page.prototype.setData = function(data)
{
	this.data = {};
	var i = 0;
	if ( $.isArray(data) )
	{
		/**
		 * @purpose 数据类型为数组格式
		 */
		for ( i=0; i<data.length; i++ )
		{
			this.data[data[i].name] = data[i].value;
		}
	}
	else if ( 'string'==typeof(data) )
	{
		/**
		 * @purpose 数据类型为序列化的字符串格式
		 */
		var oData = data.split('&'), map;
		for ( i=0; i<oData.length; i++ )
		{
			map = oData[i].split('=');
			if ( 2==map.length )
			{
				this.data[map[0]] = map[1];
			}
		}
	}
	else if ( 'object'==typeof(data) )
	{
		this.data = data;
	}
};


/**
 * @purpose 设置加载更多按钮
 * @param listenButton string | object 必须 更多按钮
 * @param assignFn function 必须 数据处理函数,把数据主体返回给回调函数，由回调函数决定如何处理
 * @param callback function 非必须 回调函数,内容填充至容器后的回调函数
 */
Page.prototype.setListenButton = function(listenButton, assignFn, callback)
{
	var _this = this;
	_this.listenButton = 'string'==typeof(listenButton) ? $(listenButton) : listenButton;
	_this.listenButton.data('defaultHtml', ['input', 'textarea'].inArray(_this.listenButton.get(0).tagName.toLocaleLowerCase()) ? _this.listenButton.val() : _this.listenButton.html());
	if ( undefined==_this.listenButton.data('p') )
	{
		_this.listenButton.data('p', 1);
	}
	_this.page = _this.data.p = _this.listenButton.data('p');

	var buildCallback = function(_this)
	{
		if ( _this.page>=_this.pages )
		{
			_this.listenButton.hide();
		}
		else
		{
			_this.listenButton.show();
		}
		if ( 'function'==typeof(callback) )
		{
			callback(_this);
		}
	};

	var request = function()
	{
		_this.listenButton.data('p', _this.page = _this.data.p++);
		_this.loading(assignFn, buildCallback);
	};
	_this.listenButton.unbind('click', request).bind('click', request);


	/**
	 * @purpose 滚动到页面底部自动加载更多数据
	 */
	if ( true===_this.autoLoad )
	{
		var $document = $(document);
		$(window).scroll(function(){
			if ( $(this).height()+$document.scrollTop()>=$document.height() )
			{
				_this.listenButton.click();
			}
		});
	}
	var pages = _this.listenButton.data('pages');
	if ( pages )
	{
		_this.pages = pages;
		if ( pages<=1 )
		{
			_this.listenButton.hide();
		}
	}
};


/**
 * @purpose 计算页码的起止范围
 */
Page.prototype.setPageNumber = function()
{
	var interNumber = Math.ceil(this.number/2), iSp, iEp;
	if ( this.page<=interNumber )
	{
		iSp = 1;
		iEp = this.number;
		if ( iEp>this.pages ) iEp = this.pages;
	}
	else if ( this.page>interNumber && this.page<this.pages )
	{
		iSp = this.page - interNumber;
		iEp = iSp + (this.number-1);
		if ( iEp>this.pages ) iEp = this.pages;
	}
	else if ( this.page>interNumber && this.page==this.pages )
	{
		iSp = this.page-interNumber-1;
		if ( iSp<1 ) iSp = 1;
		iEp = iSp + (this.number-1);
		if ( iEp>this.pages ) iEp = this.pages;
	}
	else
	{
		iSp = this.page-(this.number-1);
		iEp = this.pages;
	}
	this.startNumber = iSp;
	this.endNumber = iEp;
};


/**
 * @purpose 请求数据
 * @param assignFn function 必须 数据处理函数,把数据主体返回给回调函数，由回调函数决定如何处理
 * @param callback function 非必须 回调函数,内容填充至容器后的回调函数
 */
Page.prototype.request = function(assignFn, callback)
{
	var _this = this;
	if ( !_this.data.p )
	{
		_this.data.p = 1;
	}
	if ( _this.pages && _this.pages>0 && _this.data.p>_this.pages )
	{
		return;
	}

	$.post(_this.url, _this.data, function(data, status){
		if ( 'success'!=status )
		{
			return;
		}
		if ( 'undefined'!=typeof(STATUS_FAILURE) && undefined!=data.status && STATUS_FAILURE==data.status )
		{
			if ( undefined!=data.redirect )
			{
				window.location.href = data.redirect;
				return;
			}
			return;
		}

		_this.count = data.count;
		_this.pages = data.pages;
		_this.setPageNumber();

		var html = assignFn(undefined==data.items ? data : data.items, _this);
		if ( ''!=html ) html += _this.def();

		if ( false===_this.object.data('initialize') )
		{
			_this.object.append(html).data('initialize', true);
		}
		else
		{
			_this.object.html(html);
		}

		/**
		 * @purpose 监听页码点击事件
		 */
		_this.object.find('#js-page-container a[rel="page"]').bind('click', function(){
			var $this = $(this);
			_this.data.p = _this.page = $this.data('page');
			_this.request(assignFn, callback);
		});

		/**
		 * @purpose 执行回调函数
		 */
		if ( 'function'==typeof(callback) )
		{
			callback(_this);
		}
	}, 'json');
};


/**
 * @purpose 请求数据
 * @param assignFn function 必须 数据处理函数,把数据主体返回给回调函数，由回调函数决定如何处理
 * @param callback function 非必须 回调函数,内容填充至容器后的回调函数
 */
Page.prototype.loading = function(assignFn, callback)
{
	var _this = this;
	if ( null==_this.listenButton )
	{
		return;
	}
	if ( !_this.data.p )
	{
		_this.data.p = 1;
	}
	if ( _this.pages && _this.pages>0 && _this.data.p>_this.pages )
	{
		_this.data.p = _this.pages;
		_this.listenButton.hide();
		return;
	}

	var tagNameFlag;
	if ( false!==_this.loadingWord )
	{
		tagNameFlag = ['input', 'textarea'].inArray(_this.listenButton.get(0).tagName.toLocaleLowerCase()) ? 'input' : 'html';
		if ( 'input'==tagNameFlag )
		{
			_this.listenButton.val(_this.loadingWord);
		}
		else
		{
			_this.listenButton.html(_this.loadingWord);
		}
	}

	//alert(_this.data.p);
	$.post(_this.url, _this.data, function(data, status){
		if ( 'success'!=status )
		{
			return;
		}
		if ( 'undefined'!=typeof(STATUS_FAILURE) && undefined!=data.status && STATUS_FAILURE==data.status )
		{
			if ( undefined!=data.redirect )
			{
				window.location.href = data.redirect;
				return;
			}
			return;
		}

		_this.count = data.count;
		_this.pages = data.pages;

		var html = assignFn(undefined==data.items ? data : data.items, _this);
		if ( 1===_this.data.p )
		{
			_this.object.html(html);
		}
		else
		{
			_this.object.append(html);
		}
		if ( false!==_this.loadingWord )
		{
			if ( 'input'==tagNameFlag )
			{
				_this.listenButton.val(_this.listenButton.data('defaultHtml'));
			}
			else
			{
				_this.listenButton.html(_this.listenButton.data('defaultHtml'));
			}
		}

		if ( null!=_this.listenButton )
		{
			_this.listenButton.data('p', _this.page=_this.data.p);
		}

		if ( _this.data.p>=_this.pages )
		{
			_this.data.p = _this.pages;
			_this.listenButton.hide();
		}

		/**
		 * @purpose 执行回调函数
		 */
		if ( 'function'==typeof(callback) )
		{
			callback(_this);
		}
	}, 'json');
};


/**
 * @purpose 设置页码CSS样式
 */
Page.prototype.setCSS = function(cssHtml)
{
	this.pageNumberCss = '<style type="text/css">'+cssHtml+'</style>';
};


/**
 * @purpose 返回页码的HTML代码
 */
Page.prototype.def = function()
{
	var pageHtml='';
	if( this.pages>1 )
	{
		if ( false===this.pageNumberCss )
		{
			pageHtml += '<style type="text/css">'+
				'#js-page-container{height:26px;line-height:26px;margin-top:5px;text-align:center;}'+
				'#js-page-container b{margin:0 5px;}'+
				'#js-page-container a:link,#js-page-container a:visited{margin:0 5px;text-decoration:underline;}'+
				'#js-page-container a:hover{text-decoration:none;}'+
				'</style>';
		}
		else if ( 'string'==typeof(this.pageNumberCss) )
		{
			pageHtml += this.pageNumberCss;
		}
		pageHtml += '<div id="js-page-container">';

		if ( this.page>1 )
		{
			pageHtml += (this.firstLast ? '<a href="javascript:" target="_self" rel="page" data-page="1">首页</a>' : '')+
				'<a href="javascript:" target="_self" rel="page" data-page="'+(this.page-1)+'">上一页</a>';
		}
		if ( this.number>0 )
		{
			for ( var i=this.startNumber; i<=this.endNumber; i++ )
			{
				if ( i!=this.page )
				{
					pageHtml += '<a href="javascript:" target="_self" rel="page" data-page="'+i+'">'+i+'</a>';
				}
				else
				{
					pageHtml += '<b>'+i+'</b>';
				}
			}
		}

		if ( this.page<this.pages )
		{
			pageHtml += '<a href="javascript:" target="_self" rel="page" data-page="'+(this.page+1)+'">下一页</a>'+
				(this.firstLast ? '<a href="javascript:" target="_self" rel="page" data-page="'+this.pages+'">尾页</a>' : '');
		}
		pageHtml += '</div>';
	}
	return pageHtml;
};