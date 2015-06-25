/**
 * @Purpose: 百度地图
 * @Param: string 容器ID
 * @Author: zhangheng
 * @Created: 2014-07-02 09-16
 */


function NMap(Container)
{
	$('#'+Container).show();
	
	this.map = new BMap.Map(Container);
	var point = new BMap.Point(116.404, 39.915);
	this.map.centerAndZoom(point, 10);
	//this.map.enableScrollWheelZoom();
	
	/**
	 * 标注及索引
	 */
	this.dragMarkerIndex = -1;	//可拖动标注
	this.dragMarker = [];
	this.staticMarkerIndex = -1;		//不可拖动标注
	this.staticMarker = [];
	
	/**
	 * @Purpose: 创建控件
	 */
	var navigation = new BMap.NavigationControl();
	this.map.addControl(navigation);
	var scale = new BMap.ScaleControl({"anchor":BMAP_ANCHOR_TOP_RIGHT, "offset":new BMap.Size(5, 5)});
	this.map.addControl(scale);
	
	/**
	 * @Purpose: 事件监听
	 */
	this.map.addEventListener("dragend", function(e){
		var bounds = this.getBounds();
		var sw=bounds.getSouthWest(), ne=bounds.getNorthEast();
		//alert(sw.lng+","+sw.lat+","+ne.lng+","+ne.lat);
	});
	
	/**
	 * @Purpose: 服务
	 */
	var localSearch = new BMap.LocalSearch(this.map, {
		"renderOptions":{
			"map":this.map,
			"autoViewport":true
		},
		"onSearchComplete":function(results){
			
		},
		"onInfoHtmlSet":function(localResult){
			
		}
	});
}


NMap.prototype.marker = function(opts)
{
	var _this = this;
	
	var point = null;
	if ( !opts.lng || !opts.lat )
	{
		point = _this.map.getCenter();
	}
	else
	{
		point = new BMap.Point(opts.lng, opts.lat);
	}
	
	/**
	 * @Purpose: 创建标注
	 */
	_this.staticMarker[++_this.staticMarkerIndex] = new BMap.Marker(point);
	_this.map.addOverlay(_this.staticMarker[_this.staticMarkerIndex]);
	
	var label = new BMap.Label(String.fromCharCode(65+_this.staticMarkerIndex));
	label.setStyle({
		'border':'none',
		'backgroundColor':'none',
		'color':'#ffffff',
		'fontWeight':'bold',
		'width':'19px',
		'lineHeight':'20px',
		'textAlign':'center'
	});
	_this.staticMarker[_this.staticMarkerIndex].setLabel(label);
	
	/**
	 * @Purpose: 事件
	 */
	if ( 'function'==typeof opts.click )
	{
		_this.staticMarker[_this.staticMarkerIndex].addEventListener('click', opts.click);
	}
	
	return _this.staticMarker[_this.staticMarkerIndex];
}


NMap.prototype.callout = function()
{
	var _this = this;
	
	/**
	 * @Purpose: 创建标注
	 */
	_this.dragMarker = new BMap.Marker(_this.map.getCenter(), {
		'icon':new BMap.Icon('http://code.nongji360.com/images/logo_marker.png', new BMap.Size(26, 43))
	});
	
	_this.map.addOverlay(_this.dragMarker);
	_this.dragMarker.enableDragging();
	_this.dragMarker.setTitle('拖动我到您所在的地方');
}