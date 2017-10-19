cordova.define("org.apache.cordova.bang", function(require, exports, module){
	var exec = require('cordova/exec');

	function Bang()
	{
		var _this = this;

		this.version = "1.0";
		this.getVersion(function(version){
			_this.version = version;
		});

		this.parameters = {};
		this.getParameters(function(parameters){
			_this.parameters = parameters;
		});

		this.functions = {
			"1.0":["login", "share", "showToolbar", "hideToolbar", "setToolbarStyle",
				"openNative", "back", "getVersion", "getParameters"]
		};
	}


	/**
	 * @purpose 登录方法
	 */
	Bang.prototype.login = function(params)
	{
		exec(
			function(result)
			{
				if ( 'function'==typeof(params.success) )
				{
					params.success(result);
				}
			},
			function()
			{
				if ( 'function'==typeof(params.cancel) )
				{
					params.cancel();
				}
			},
			'Bang', 'login', []
		);
	};


	/**
	 * @purpose 分享方法
	 */
	Bang.prototype.share = function(params)
	{
		exec(
			function(result)
			{
				if ( 'function'==typeof(params.callback) )
				{
					//失败和成功都调用该方法
					params.callback(result);
				}
			},
			function()
			{
				if ( 'function'==typeof(params.cancel) )
				{
					params.cancel();
				}
			},
			'Bang', 'share', [
				/**
				 * @purpose 分享的元素
				 * url 链接
				 * title 标题
				 * desc 描述
				 * thumb 缩略图
				 */
				params.items || {},
				/**
				 * @purpose 分享到列表
				 * WX_FRIEND 微信好友
				 * WX_FRIENDS 朋友圈
				 * S_WB 新浪微薄
				 * T_WB 腾讯微博
				 * QQ QQ好友
				 * QQ_ZONE QQ空间
				 * FRIENDS 好友圈
				 * BANG 农机帮
				 * 空则为全部
				 */
				params.list || []
			]
		);
	};


	/**
	 * @purpose 显示标题栏
	 * @param callback function
	 */
	Bang.prototype.showToolbar = function(callback)
	{
		exec(
			function()
			{
				if ( 'function'==typeof(callback) )
				{
					callback();
				}
			},
			function(){}, 'Bang', 'showToolbar', []
		);
	};


	/**
	 * @purpose 隐藏标题栏
	 * @param callback function
	 */
	Bang.prototype.hideToolbar = function(callback)
	{
		exec(
			function()
			{
				if ( 'function'==typeof(callback) )
				{
					callback();
				}
			},
			function(){}, 'Bang', 'hideToolbar', []
		);
	};


	/**
	 * @purpose 设置标题栏样式
	 * @param style object 样式
	 *		title:标题文字
	 *		backgroundColor:#00ff00 //背景色
	 *		color:#ff0000 //文字颜色
	 *		opacity:50 //不透明度
	 *		align:left | center //文字对齐方式
	 * @param callback function 回调方法
	 */
	Bang.prototype.setToolbarStyle = function(style, callback)
	{
		exec(
			function()
			{
				if ( 'function'==typeof(callback) )
				{
					callback();
				}
			},
			function(){}, 'Bang', 'setToolbarStyle', [style]
		);
	};


	/**
	 * @purpose 打开原生窗口
	 * @param controller string 界面
	 * @param parameters object 参数
	 * @param callback function 回调方法
	 */
	Bang.prototype.openNative = function(controller, parameters, callback)
	{
		var params = [controller];
		if ( 'undefined'!=typeof(parameters) && 'function'!=typeof(parameters) && null!=parameters )
		{
			params.push(parameters);
		}
		else if ( 'function'==typeof(parameters) && 'undefined'==typeof(callback) )
		{
			callback = parameters;
		}
		exec(
			function()
			{
				if ( 'function'==typeof(callback) )
				{
					callback();
				}
			},
			function(){}, 'Bang', 'openNative', params
		);
	};


	/**
	 * @purpose 调用webView的后退
	 * @param callback function
	 */
	Bang.prototype.back = function(callback)
	{
		exec(
			function()
			{
				if ( 'function'==typeof(callback) )
				{
					callback();
				}
			},
			function(){}, 'Bang', 'back', []
		);
	};


	/**
	 * @purpose 获取cordova插件版本号
	 * @param callback function
	 */
	Bang.prototype.getVersion = function(callback)
	{
		exec(callback, function(){}, 'Bang', 'getVersion', []);
	};


	/**
	 * @purpose 获取页面所有参数
	 * @param callback function
	 */
	Bang.prototype.getParameters = function(callback)
	{
		exec(callback, function(){}, 'Bang', 'getParameters', []);
	};

	module.exports = new Bang();
});