/**
 * @Purpose: 产品询价插件
 * @Author: zhangxp
 * @Created: 2016-03-05 14:53
 * 依赖插件
 *	{{ javascript_include(constant('Conf::HTTP_CODE') ~ '/js/a/common.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/libs/Fn.js') }}
 *	{{ javascript_include(constant('Conf::HTTP_CODE') ~ '/js/libs/RegEx.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/jquery/jquery.select.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/a/linkage.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/a/regionsSeatLibs.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/a/consult.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/libs/Page.js') }}
 *	{{ javascript_include(constant('\Conf::HTTP_CODE') ~ '/js/jquery/jquery.dialog.js') }}
 * 调用
 * html：<div id="box"></div>
 * js：$("#box").consult({'product_id':858,'product_name':'我的拖拉机'});
 */


(function($){
	$.fn.consult = function(options) {
		//设置默认的参数s
		var defaults = {
			product_id: '0',
			user_id: '0',
			terminal: '10',
			product_name : ''
		};
		//设置默认的参数e
		var opts = $.extend(defaults, options);
		/*添加询价模板*/
		getConsultHtml($(this),opts);		
		/*根据产品id添加对应商铺下的所有产品*/
		$.post('/consult_common/getConsultInfo','product_id='+opts.product_id+'&user_id='+opts.user_id,function(data){
			if( STATUS_FAILURE == data.status )
			{
				jAlert(data.message);
			}
			/*产品类别及选择功能实现*/

			//$("body").append('<script type="text/javascript" src='+HTTP_USER+'"/js/cate/cate'+data.info.user_id+'.js"></script>');
			$("body").append('<script type="text/javascript" src="http://192.168.0.112:8051/js/cate/cate'+data.info.user_id+'.js"></script>');
			$("#fullname").val(data.info.fullname);
			$("#mobile").val(data.info.mobile);
			$(".consultRegion").html('		<dl name="r1" data-value="1" style="display:none">'+
					'			<dd value="0" >国家</dd>'+
					'		</dl>'+
					'		<dl name="r2" data-value="'+data.info.r2+'">'+
					'			<dd data-value="0">省份</dd>'+
					'		</dl>'+
					'		<dl name="r3" data-value="'+data.info.r3+'">'+
					'			<dd data-value="0">地级市</dd>'+
					'		</dl>'+
					'		<dl name="r4" data-value="'+data.info.r4+'">'+
					'			<dd data-value="0">县级市</dd>'+
					'		</dl>'+
					'		<dl name="r5" data-value="" style="display:none">'+
					'			<dd data-value="0">乡镇</dd>'+
					'		</dl>'+
					'		<dl name="r6" data-value="" style="display:none">'+
					'			<dd data-value="0">村庄</dd>'+
					'		</dl>'
				);
			$('.consultContent dl[name^="r"]').linkage(regionsSeatLibs);
			$("#product_id").click(function()
				{
					$("#consult_product_form [name=\"user_id\"]").val(data.info.user_id);
					$("#consult_dialog").dialog();
					$("dl[id^='class_id']").linkage(cateLibs , {"height":27});			
				}
			);
			/*接听电话时间*/
			var answerTimeHtml = '';
			$.each(data.answerTime,function(index,item){
				answerTimeHtml += '<dd data-value="'+index+'">'+item+'</dd>';
				});
			$("#answer_time").html(answerTimeHtml);
			$("#answer_time").option({'height':'30'});
		},'json');
		/*选择产品功能*/
		var page = new Page($("#consult_product_box"));
		$('#consult_search').bind('click', function(){
			page.page = 1;
			page.url = '/Gajax/companyProducts';
			page.setData($('#consult_product_form').serializeArray());
			page.request(assignHtml, $.jqDialog.setPosition);
			return false;
		});
		$("html").on('click','.consult_list',function(){
			var $this = $(this);
			$("#consult_product_name").html($this.html());
			$("#consult_product_id").html($this.data('id'));
			$.jqDialog.hide();
		});		
		/*选择计划采购时间*/
		var date = new Date(),planTimeHtml = '';
		var ym = date.getFullYear()+"-"+date.getMonth();
		for(var i=1;i<=12;i++)
		{
			planTimeHtml += addMonth(ym,i);
		}
		$("#plan_time").html(planTimeHtml);
		$("#plan_time").option({'height':'30'});
		$("#prompt").option({'height':'30'},function(val){
			$("#consultContent").text(val);
		});
		$(this).find("#consultSubmit").click(function(){
			$.post('/consult_common/submitConsult',$("#consultForm").serialize(),function(data){
				jAlert(data.message);
			},'json');
		});
	};
	/*内置产品询价模板函数*/
	var getConsultHtml = function($this,proInfo)
	{
		var cssHtml = html = consultHead = consultEnd = consultList = '';
		csshtml ='<style type="text/css">\
	#consult_dialog{background-color:#fff; min-height:180px; padding:8px 15px 15px 15px; border-radius:8px; width:600px;}\
	#consult_dialog h3{height:35px; line-height:35px; border-bottom:2px solid #e5e5e5; font-weight:normal; margin-bottom:15px; cursor:pointer;}\
	#consult_dialog h3 span{float:right; font-size:16px;}\
	#consult_dialog .category dl{margin-right:10px; width:150px; background-position-x:130px; margin-bottom:15px;}\
	#consult_dialog dt{cursor:pointer;}\
	#consult_dialog .key_text{height:28px; border:1px solid #e8e8e8; outline:none; padding-left:5px;}\
	#consult_product_box{margin-top:15px;}\
	#consult_product_box .consult_list{float:left; display:inline-block; margin-right:10px; cursor:pointer; line-height:25px; border:1px solid #e5e5e5; padding:0px 5px; margin-bottom:8px;}\
	#consultTemplate{width:900px; margin:0 auto;}\
	.clear{clear:both;}\
	.consultTitle span{color:#f00; font-weight:bold; margin-right:3px;}\
	.category{margin:0 auto;}\
	#consultTemplate dl{border:1px solid #e6e6e6; float:left; background:url('+HTTP_CODE+'/images/consult/xial_icon.gif) no-repeat;background-position:108px 12px;}\
	#js-page-container a{border:1px solid #efefef; padding:3px 8px; color:#666; text-decoration:none;}\
	#js-page-container b{background-color:#ed0000; color:#fff; padding:3px 8px;}\
	#consult_search{margin-left:5px; height:30px; background-color:#ed0000; border:0px; padding:0px 12px; color:#fff; border-radius:3px; outline:none; cursor:pointer;}\
	#consult_product_name{line-height:30px; height:30px; overflow:hidden; padding:0px 3px; width:360px;}\
	#consultForm{font-size:15px;}\
	#consultTitle span{color:#f00;}\
	#consultTemplate .consultItem{margin:10px 0px; float:left;}\
	#consultTemplate .consultItem1{margin:10px 0px;}\
	#consultTemplate .consultTitle{float:left; width:120px; text-align:right; height:32px; line-height:32px;}\
	#consultTemplate .consultContent{float:left;}\
	#consultTemplate .consultContent em{float:left; font-style:normal; line-height:32px;}\
	#consultTemplate .consultContent input{height:30px; line-height:30px; border:1px solid #e6e6e6; padding:0px 6px 0px 5px; float:left; margin-right:6px; outline:none;}\
	#consultTemplate .consultContent span{float:left; margin-right:15px;line-height:30px;}\
	.consultContent #gender{float:left;}\
	.consultContent #prompt{width:600px; background-position-x:578px;}\
	.consultContent .ts_text{display:block; line-height:32px;}\
	.consultContent #consultContent{border:1px solid #e6e6e6; min-height:120px; padding:8px 5px; outline:none; width:750px;}\
	#consultTemplate .button{text-align:center;}\
	#consultTemplate .button input{padding:8px 15px; background-color:#ed0000; color:#fff; border:0px; border-radius:4px; font-size:16px; cursor:pointer;}\
	#plan_number{width:60px; text-align:center;}\
	#answer_time{width:150px;}\
	#mobile,#plan_time,#fullname{width:120px;}\
	.consultContent #plan_time{background-position-x:100px;}\
	.consultContent #product_id{background-position-x:345px;}\
	.consultContent #answer_time{background-position-x:128px;}\
	.consultItem .MarLeft{margin-left:130px;}\
	.consultItem .MarLeft1{margin-left:84px;}\
	.consultItem1 .consultRegion dl{width:130px; margin-right:10px;}\
	</style>';
		consultHead = '<div id="consultTemplate">'+
				'<form id="consultForm" class="consultForm">';
		/*默认产品*/
		defaultPro = '<dd><div id="consult_product_name" >'+proInfo.product_name+'</div>'+
					 '<input type="hidden" id="consult_product_id" name="product_id" value="'+proInfo.product_id+'">'+
					 '<input type="hidden"  name="user_id" value="'+proInfo.user_id+'">'
					 '</dd>';
		consultList = 	'<div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		<span>*</span>咨询产品：'+
				'	</div>'+
				'	<div class="consultContent">'+		
				'		<dl id="product_id" name="product_id">'+defaultPro+				
				'		</dl>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="consultItem">'+
				'	<div class="consultTitle MarLeft">'+
				'		计划采购时间：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<dl id="plan_time">'+
				'		</dl>'+
				'	</div>'+
				'</div>';
		consultList += 	'<div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		计划采购数量：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<input type="text" id="plan_number" name="plan_number" value="1" /><em>台</em>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="consultItem">'+
				'	<div class="consultTitle MarLeft">'+
				'		<span>*</span>您的姓名：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'	<input type="text" id="fullname" name="fullname" value="" />'+
				'		<div id="gender">'+
				'			<input name="gender" type="radio" value="10" checked /><span>男</span>'+
				'			<input name="gender" type="radio" value="20" /><span>女</span>'+
				'		</div>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		<span>*</span>手机号：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'	<input type="text" id="mobile" name="mobile" maxlength="11" value="" />'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="consultItem">'+
				'	<div class="consultTitle MarLeft1">'+
				'		<span>*</span>接听电话时间：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<dl id="answer_time">'+
				'		</dl>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem1">'+
				'	<div class="consultTitle">'+
				'		咨询内容：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<dl id="prompt">'+
				'			<dd data-value="选择常见问题">选择常见问题</dd>'+
				'			<dd data-value="我对贵公司的产品非常感兴趣，能否发一些详细资料给我参考？">我对贵公司的产品非常感兴趣，能否发一些详细资料给我参考？</dd>'+
				'			<dd data-value="请问贵公司产品是否可以代理？代理条件是什么？可否提供产品报价和详细介绍？">请问贵公司产品是否可以代理？代理条件是什么？可否提供产品报价和详细介绍？</dd>'+
				'			<dd data-value="我有意购买此产品，可否提供此产品的报价单？">我有意购买此产品，可否提供此产品的报价单？</dd>'+
				'			<dd data-value="贵公司在我公司所在地有经销点/代理商吗?我的地址是:">贵公司在我公司所在地有经销点/代理商吗?我的地址是:</dd>'+
				'		</dl>'+
				'		<div class="clear"></div><div class="ts_text">我们已经为您归纳了常见问题，您可以点击上面的内容框，选择常见问题。在此基础上修改您的留言。</div>'+
				'		<textarea id="consultContent" name="content"></textarea>'+
				'		<div class="ts_text">提示：留言内容不要超过300个字，请不要在该留言框内发送无关信息。</div>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem1">'+
				'	<div class="consultTitle">'+
				'		所在地区：'+
				'	</div>'+
				'	<div class="consultContent consultRegion">'+
				'		<dl name="r1" data-value="1" style="display:none">'+
				'			<dd value="0" >国家</dd>'+
				'		</dl>'+
				'		<dl name="r2" data-value="">'+
				'			<dd data-value="0">省份</dd>'+
				'		</dl>'+
				'		<dl name="r3" data-value="">'+
				'			<dd data-value="0">地级市</dd>'+
				'		</dl>'+
				'		<dl name="r4" data-value="">'+
				'			<dd data-value="0">县级市</dd>'+
				'		</dl>'+
				'		<dl name="r5" data-value="" style="display:none">'+
				'			<dd data-value="0">乡镇</dd>'+
				'		</dl>'+
				'		<dl name="r6" data-value="" style="display:none">'+
				'			<dd data-value="0">村庄</dd>'+
				'		</dl>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		其它品牌：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<input name="other_brand" type="radio" value="10" checked/><span>同时咨询其他品牌</span>'+
				'		<input name="other_brand" type="radio" value="20"/><span>只询价此品牌</span>'+
				'	</div>'+
				'</div>';

		consultEnd =	'<div class="clear"></div><div class="button">'+
				'<input type="hidden" name="terminal" value="'+proInfo.terminal+'" />'+
				'<input type="button" id="consultSubmit" value="咨询价格" />'+
				'</div>'+
				'</form>'+
				'<div id="consult_dialog" style="display:none;">'+
				'	<form id="consult_product_form">'+
				'		<h3><span data-rel="close" class="close">关闭</span>选择产品</h3>'+
				'		<div class="category">'+
				'			<dl id="class_id1">'+
				'				<dd data-value="0">一级分类</dd>'+
				'			</dl>'+
				'			<dl id="class_id2">'+
				'				<dd data-value="0">二级分类</dd>'+
				'			</dl>'+
				'			<dl id="class_id3">'+
				'				<dd data-value="0">三级分类</dd>'+
				'			</dl>'+
				'			<div><input type="text" name="k" value="" class="key_text"/><input type="button" id="consult_search" value="搜索"></div>'+
				'			<input type="hidden" name="user_id" value="" />'+
				'			<div id="consult_product_box"></div>'+
				'		</div>'+
				'	</form>'+
				'</div>'+
				'</div>';
		html = csshtml+consultHead+consultList+consultEnd;
		$this.html(html);
	};
	var assignHtml = function(data)
	{
		var i=0, html='';
		for ( ; i<data.length; i++ )
		{
			html += '<div class="consult_list" data-id="'+ data[i].id +'">'+data[i].title+'</div>';
		}
		return html;
	};
	/*内置计划购买时间函数*/
	var addMonth = function(dateStr,n){
		var s=dateStr.split("-");
		var yy=parseInt(s[0]); var mm=parseInt(s[1]-1);
		var dt=new Date(yy,mm);
		dt.setMonth(dt.getMonth()+n);
		if( (dt.getFullYear()*12+dt.getMonth()) > (yy*12+mm + n) )
		{
			dt=new Date(dt.getFullYear(),dt.getMonth(),0);
		}
		var year = dt.getFullYear();
		var month = dt.getMonth()+1;
		if( month<10 )
		{
			month='0'+month;
		}
		var dd = year+"年"+month+"月";
		return "<dd data-value='"+year+"-"+month+"'>"+dd+"</dd>";
	};
})(jQuery);