/*
**	TujiScoll(图集播放效果)
**	Author: zhangxp
**	Copyright (c) 2014 www.nongji360.com,All Rights Reserved
**	Created: 2014-08-19
**	Modified: 2014-12-09
**	Version: 2014.1209.1
*/

(function($){
$.fn.TujiScoll = function(options) {  
//设置默认的参数s      
  var defaults = {              
  	jsonurl:"json.js",
	pic_w:1000,
	pic_h:562,
	spic_w:100,
	showspic:1,//1 是显示缩略图 0是不显示缩略图
	showmsg:1,//1 是显示简介 0是不显示简介
	spic_count:8,//默认的缩略图一行显示几个
	autoscoll:0, //1是自动滚动 0是不自动滚动 默认不自动滚动
	scolltime:5000 //默认是5秒  5000
  };     
//设置默认的参数e
var opts = $.extend(defaults, options);  
//执行的代码s
  var $this=$(this);
  var $text="";
 
  //获取图集的json数据格式为[{title:'图片一',pic:'123.jpg',spic:'123_s.jpg'}]
  var $jsondata;  
  $.getJSON(opts.jsonurl,function(data){
	   //大图以及左右控制按钮的布局
	  $text+="<div  style='position:relative; text-align:center; height:"+opts.pic_h+"px'>"+
		"<div id='tj_lbtn' style='position:absolute; z-index:1000; left:0; top:0; width:49%; height:"+opts.pic_h+"px; cursor:url(http://code.nongji360.com/js/jquery/tuji/CurL.cur), auto;filter:alpha(opacity=0); -moz-opacity:0;-khtml-opacity: 0;opacity: 0; background:#fff'></div>"+
		"<div id='tj_rbtn' style='position:absolute; z-index:1000; right:0; top:0; width:49%; height:"+opts.pic_h+"px;cursor:url(http://code.nongji360.com/js/jquery/tuji/CurR.cur), auto;filter:alpha(opacity=0); -moz-opacity:0;-khtml-opacity: 0;opacity: 0; background:#fff'></div>"+
		"<img id='tj_big' style='display:none' src='' width='"+opts.pic_w+"' height='"+opts.pic_h+"' />"+
		"</div>";
	  //图片数量以及标题简介布局	
	  $text+="<div id='tj_text_line'><span id='tj_nums'></span>";
	  if(opts.showmsg==1){
		$text+="<span id='tj_text'></span>"
	  }
	  else{
		$text+="<span id='tj_text'  style='display:none'></span>"  
		  }
	  $text+="</div><div style='clear:both'></div>";
	  //缩略图布局
	  if(opts.showspic==1){
		  $text+="<div  id='tj_list'><ul>";        
		  }
	  else{
		  $text+="<div  id='tj_list' style='display:none'><ul>";        	  
		  }	  
	  $.each(data,function(index,val){  
			  $text+="<li><img src='"+val.spic+"' rel='"+val.pic+"' width='"+opts.spic_w+"' title='"+val.title+"' /></li>";			  
            })
	 $text+="</ul></div>";
     $text+="<div style='clear:both'></div>";		
	 $this.append($text);
	 //开始运行代码
	 scollF(opts);	
	  
}); 
      
			 
//执行的代码e
return this;
}; 
//将标题的div加入到列表的标签中
var scollF=function(opts){
	if ($("#tj_list").length>0){
	var t=0;
	var ms=$("#tj_list li").length-1;
	function tj_now_css(ss){
		//修改当前焦点图的样式
			$("#tj_list img").removeClass("tj_now");
	   		$("#tj_list img:eq("+ss+")").addClass("tj_now");
		//列表滚动
			var listw=$("#tj_list").width();
			var mar_l=(opts.pic_w/opts.spic_count)*(ss+1);
			var ts=-(mar_l-listw);
			$("#tj_nums").html("<span id='tj_nums_l'>"+(ss+1)+"</span>/<span id='tj_nums_r'>"+(ms+1)+"</span>");
			$("#tj_text").html($("#tj_list img:eq("+ss+")").attr("title"));
			if (ss>=opts.spic_count){
				$("#tj_list ul:first").stop().animate({marginLeft:ts})
			}
			else{
				$("#tj_list ul:first").stop().animate({marginLeft:0})
				}
		}
	//左按钮
   $("#tj_lbtn").click(function(){
	   clearInterval(timer);
	   if(t>0){
		    t--;
			$("#tj_big").hide();
	   		$("#tj_big").attr("src",$("#tj_list img:eq("+t+")").attr("rel")).fadeIn();
			tj_now_css(t);
	 		}else
	   {
		   t=ms
		   $("#tj_big").hide();
		   $("#tj_big").attr("src",$("#tj_list img:eq("+t+")").attr("rel")).fadeIn()
		   tj_now_css(t);
		   }
	   timer=setInterval(function(){
			$("#tj_rbtn").click();
		 	},opts.scolltime) 
	   })
	 //右按钮
	$("#tj_rbtn").click(function(){
	   clearInterval(timer);
	   if(t<ms){
		    t++;
			$("#tj_big").hide();
	   		$("#tj_big").attr("src",$("#tj_list img:eq("+t+")").attr("rel")).fadeIn();
	   		tj_now_css(t);	
	 		}else
	   {
		   t=0;
		   $("#tj_big").hide();
		   $("#tj_big").attr("src",$("#tj_list img:eq("+t+")").attr("rel")).fadeIn();
		   tj_now_css(t);
		   }
	  timer=setInterval(function(){
			$("#tj_rbtn").click();
		 	},opts.scolltime)    
	   })
	  $("#tj_list ul li").each(function(index, element) {
        $(this).click(function(){
			t=index;
			$("#tj_big").attr("src",$("#tj_list img:eq("+t+")").attr("rel")).fadeIn();
			tj_now_css(t);	
			})
   		 });
	 $("#tj_big").attr("src",$("#tj_list img:eq(0)").attr("rel")).fadeIn();   
	 $("#tj_list ul:first").width((opts.pic_w/opts.spic_count)*(ms+1));
	 tj_now_css(t);	
	 //自动滚动
	 if(opts.autoscoll==1){
	 	var timer=setInterval(function(){
			$("#tj_rbtn").click();
		 	},opts.scolltime)
	 }	 
	 
  }	  
	}
})(jQuery); 

