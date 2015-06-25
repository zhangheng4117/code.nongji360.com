// ****************创建插件开始******************
//
// +------------------------------------------------------------------------------------------------+
// | jQuery 1.6.2																					|
// +------------------------------------------------------------------------------------------------+
// | Copyright (c) 2008-2014 www.nongji360.com														|
// +------------------------------------------------------------------------------------------------+
// | 一个接一个的滚动 带按钮 也可自动滚动															|
// | Author: zhangxp 719655765@QQ.com														|
// +------------------------------------------------------------------------------------------------+
//
// jquery.Scroll_onebyone.js, V 2014.0320.1, 2010-03-20 15:50
(function($){
$.fn.Scroll_onebyone = function(options) {  
//设置默认的参数s      
  var defaults = {              
   // scroll_Container: 'S_container', //滚动容器超出隐藏
	scroll_Box:'.S_box',		//滚动盒子 长度要根据滚动元素定制的
	scroll_List:'.S_list',   //滚动元素  样式要紧挨在一起margin=0		
	scroll_Lbtn:'.S_lbutton',//左滚按钮
	scroll_Rbtn:'.S_rbutton',//右滚按钮 
	scroll_Dqclass:'S_dqclass',//焦点样式
	scroll_T:3500//多长时间滚动一次
  };     
//设置默认的参数e
var opts = $.extend(defaults, options);  
//执行的代码s
var scroll_Timer=opts.scroll_T;
var lh_timer=null;
//滚动容器
var $this=$(this);
//滚动盒子的宽度
var box_w= (parseInt($(opts.scroll_List).length))*(parseInt($(opts.scroll_List+":first").width()));
$this.find(opts.scroll_Box).css({
	'width':box_w+'px',
	'margin-left':'0px'
	});

lh_timer = setInterval(function(){
		AutoScroll($this,opts.scroll_Box,opts.scroll_List,opts.scroll_Dqclass);
	}, scroll_Timer);


//alert($(opts.scroll_Box).width())
$(opts.scroll_Lbtn).click(function(){
	if($this.find(opts.scroll_Box).is(":animated")){
		}
	else{	
		clearInterval(lh_timer);
		AutoScroll($this,opts.scroll_Box,opts.scroll_List,opts.scroll_Dqclass);			
		lh_timer = setInterval(function(){
			 AutoScroll($this,opts.scroll_Box,opts.scroll_List,opts.scroll_Dqclass);	
		   }, scroll_Timer);
		}
	
	})
$(opts.scroll_Rbtn).click(function(){
	if($this.find(opts.scroll_Box).is(":animated")){
		}
	else{	
		clearInterval(lh_timer);
		AutoScroll_l($this,opts.scroll_Box,opts.scroll_List,opts.scroll_Dqclass);
		lh_timer = setInterval(function(){
			 AutoScroll($this,opts.scroll_Box,opts.scroll_List,opts.scroll_Dqclass);	
		   }, scroll_Timer);
		}
	})	


//执行的代码e
return this;
};
//函数部分
//做滚动函数
var AutoScroll=function(s_container,s_box,s_list,s_dqclass){
		var $Obj=$(s_container).find(s_box);
		//去掉当前焦点的样式
		$Obj.find(s_list).removeClass(s_dqclass);
		//计算出滚动元素的宽度
		var $l=$Obj.find(s_list+":first").width();
		//alert($Obj.css("margin-left"))	
		if($Obj.css("margin-left")=="0px"){			
			$Obj.animate({			
			marginLeft:"-"+$l+"px"
			},800,function(){});	
			$Obj.find(s_list+":eq(1)").addClass(s_dqclass);
		}
		else{	
			$Obj.animate({
			marginLeft:"-"+($l*2)+"px"
			},800,function(){
			$(this).css({marginLeft:"-"+$l+"px"}).find(s_list+":first").appendTo(this);
			});
			$Obj.find(s_list+":eq(2)").addClass(s_dqclass);				
		}
		
	}
//右滚动函数	
var AutoScroll_l=function(s_container,s_box,s_list,s_dqclass){
		var $Obj=$(s_container).find(s_box);
		//去掉当前焦点的样式
		$Obj.find(s_list).removeClass(s_dqclass);
		//计算出滚动元素的宽度
		var $l=$Obj.find(s_list+":first").width();
		$Obj.animate({
			marginLeft:"0px"
			},800,function(){
			$Obj.find(s_list+":first").before($Obj.find(s_list+":last"));
			$(this).css({marginLeft:"-"+$l+"px"});
			});	
			$Obj.find(s_list+":first").addClass(s_dqclass);			
			}	
})(jQuery); 