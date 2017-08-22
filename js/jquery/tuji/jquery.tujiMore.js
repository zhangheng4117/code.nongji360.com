/*
**	Tuji(图集播放效果)
**	Author: zhangxp
**	Copyright (c) 2014 www.nongji360.com,All Rights Reserved
**	Created: 2014-08-19
**	Modified: 2014-08-19
**	Version: 2014.0819.1
*/

(function($){
$.fn.TujiMore = function(options) {  
//设置默认的参数s      
  var defaults = {              
  	jsonurl:"json.js",
	pic_w:1000,
	pic_h:562,
	spic_w:100,
	showspic:1,//1 是显示缩略图 0是不显示缩略图
	showmsg:1,//1 是显示简介 0是不显示简介
	spic_count:8//默认的缩略图一行显示几个	
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
		"<div class='tj_lbtn' style='position:absolute; z-index:1000; left:0; top:0; width:49%; height:"+opts.pic_h+"px; cursor:url(http://code.nongji360.com/js/jquery/tuji/CurL.cur), auto;filter:alpha(opacity=0); -moz-opacity:0;-khtml-opacity: 0;opacity: 0; background:#fff'></div>"+
		"<div class='tj_rbtn' style='position:absolute; z-index:1000; right:0; top:0; width:49%; height:"+opts.pic_h+"px;cursor:url(http://code.nongji360.com/js/jquery/tuji/CurR.cur), auto;filter:alpha(opacity=0); -moz-opacity:0;-khtml-opacity: 0;opacity: 0; background:#fff'></div>"+
		"<img class='tj_big' style='display:none' src='' width='"+opts.pic_w+"' height='"+opts.pic_h+"' />"+
		"</div>";
	  //图片数量以及标题简介布局	
	  $text+="<div class='tj_text_line'><span id='tj_nums'></span>";
	  if(opts.showmsg==1){
		$text+="<span class='tj_text'></span>"
	  }
	  else{
		$text+="<span class='tj_text'  style='display:none'></span>"  
		  }
	  $text+="</div><div style='clear:both'></div>";
	  //缩略图布局
	  if(opts.showspic==1){
		  $text+="<div  class='tj_list'><ul>";        
		  }
	  else{
		  $text+="<div  class='tj_list' style='display:none'><ul>";        	  
		  }	  
	  $.each(data,function(index,val){  
			  $text+="<li><img src='"+val.spic+"' rel='"+val.pic+"' width='"+opts.spic_w+"' title='"+val.title+"' /></li>";			  
            })
	 $text+="</ul></div>";
     $text+="<div style='clear:both'></div>";		
	 $this.append($text);
	 //开始运行代码
	 scollF(opts,$this);	
	  
}); 
      
			 
//执行的代码e
return this;
}; 
//将标题的div加入到列表的标签中
var scollF=function(opts,$this){
	if ($this.find(".tj_list").length>0){
	var t=0;
	var ms=$this.find(".tj_list li").length-1;
	function tj_now_css(ss){
		//修改当前焦点图的样式
			$this.find(".tj_list img").removeClass("tj_now");
			$this.find(".tj_list img:eq("+ss+")").addClass("tj_now");
		//列表滚动
			var listw=$this.find(".tj_list").width();
			var mar_l=(opts.pic_w/opts.spic_count)*(ss+1);
			var ts=-(mar_l-listw);
			$this.find(".tj_nums").html("<span class='tj_nums_l'>"+(ss+1)+"</span>/<span class='tj_nums_r'>"+(ms+1)+"</span>");
			$this.find(".tj_text").html($this.find(".tj_list img:eq("+ss+")").attr("title"));
			if (ss>=opts.spic_count){
				$this.find(".tj_list ul:first").stop().animate({marginLeft:ts})
			}
			else{
				$this.find(".tj_list ul:first").stop().animate({marginLeft:0})
				}
		}
	//左按钮
   $this.find(".tj_lbtn").click(function(){
	   
	   if(t>0){
		    t--;
			$this.find(".tj_big").hide();
			$this.find(".tj_big").attr("src",$this.find(".tj_list img:eq("+t+")").attr("rel"));
			$this.find(".tj_big").fadeIn();
			tj_now_css(t);
	 		}else
	   {
		   t=ms
			$this.find(".tj_big").hide();
			$this.find(".tj_big").attr("src",$this.find(".tj_list img:eq("+t+")").attr("rel"));
			$this.find(".tj_big").fadeIn();
		    tj_now_css(t);
		   }
	   })
	 //右按钮
	$this.find(".tj_rbtn").click(function(){
	   if(t<ms){
		    t++;
			$this.find(".tj_big").hide();
			$this.find(".tj_big").attr("src",$this.find(".tj_list img:eq("+t+")").attr("rel"));
			$this.find(".tj_big").fadeIn();
	   		tj_now_css(t);	
	 		}else
	   {
		   t=0;
		   $this.find(".tj_big").hide();
		   $this.find(".tj_big").attr("src",$this.find(".tj_list img:eq("+t+")").attr("rel"));
		   $this.find(".tj_big").fadeIn();
		   tj_now_css(t);
		   }
	   })
	  $this.find(".tj_list ul li").each(function(index, element) {
        $(this).click(function(){
			t=index;
			$this.find(".tj_big").attr("src",$this.find(".tj_list img:eq("+t+")").attr("rel"));
			$this.find(".tj_big").fadeIn();
			tj_now_css(t);	
			})
   		 });
	 $this.find(".tj_big").attr("src",$this.find(".tj_list img:eq(0)").attr("rel")); 
	 $this.find(".tj_big").fadeIn();  
	 $this.find(".tj_list ul:first").width((opts.pic_w/opts.spic_count)*(ms+1));
	 tj_now_css(t);	
  }	  
	}
})(jQuery); 

