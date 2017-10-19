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
			product_name : '',
			consult_type : 10 //10是全部 20是经销商产品
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
			$("#fullname").val(data.info.fullname);
			$("#mobile").val(data.info.mobile);
			$(".consultRegion").html('		<dl name="region_id1" data-value="1" style="display:none">'+
					'			<dd value="0" >国家</dd>'+
					'		</dl>'+
					'		<dl name="region_id2" data-value="'+data.info.r2+'">'+
					'			<dd data-value="0">省份</dd>'+
					'		</dl>'+
					'		<dl name="region_id3" data-value="'+data.info.r3+'">'+
					'			<dd data-value="0">地级市</dd>'+
					'		</dl>'+
					'		<dl name="region_id4" data-value="'+data.info.r4+'">'+
					'			<dd data-value="0">县级市</dd>'+
					'		</dl>'					
				);
			$('.consultContent dl[name^="region"]').linkage(regionsSeatLibs);			
			/*接听电话时间*/
			var answerTimeHtml = '';
			$.each(data.answerTime,function(index,item){
				answerTimeHtml += '<dd data-value="'+index+'">'+item+'</dd>';
				});
			$("#answer_time").html(answerTimeHtml);
			$("#answer_time").option({'height':'30'});
		},'json');
		/*选择计划采购时间*/
		var date = new Date(),planTimeHtml = '';
		var ym = date.getFullYear()+"-"+date.getMonth();
		for(var i=1;i<=12;i++)
		{
			planTimeHtml += addMonth(ym,i);
		}
		$("#plan_time").html(planTimeHtml);
		$("#plan_time").option({'height':'30'});		
		
		/*选择经销公司身份的时候转换为代理字段*/
		$(".consultCompany [type='radio']").click(function(){
			if ( 30==$(this).val() )
			{
				$(".consultShow").addClass('none');
				$("[name='cate']").val(20);
				$("#consultContent").text("我想代理贵公司产品，代理条件是什么？");
			}
			else
			{
				$(".consultShow").removeClass('none');
				$("[name='cate']").val(10);
				$("#consultContent").text("我想咨询该产品的价格和介绍。");
			}
			if ( 10==$(this).val() )
			{
				$("[name='company']").hide();
			}
			else
			{
				$("[name='company']").show();
			}
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
				'</div>'+
				'<div class="clear"></div>';
		consultList +=	'<div class="consultItem consultShow">'+
				'	<div class="consultTitle">'+
				'		计划采购时间：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<dl id="plan_time">'+
				'		</dl>'+
				'	</div>'+
				'</div>';
		consultList += 	'<div class="consultItem consultShow">'+
				'	<div class="consultTitle">'+
				'		计划采购数量：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<input type="text" id="plan_number" name="plan_number" value="1" /><em>台</em>'+
				'	</div>'+
				'</div>'+
				'<div class="clear"></div>';
		consultList +=	'<div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		<span>*</span>您的姓名：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'	<input type="text" id="fullname" name="fullname" value="" />'+
				'		<div id="gender">'+
				'			<input name="gender" type="radio" value="10" checked /><span>男</span>'+
				'			<input name="gender" type="radio" value="20" /><span>女</span>'+
				'		</div>'+
				'	</div>'+
				'</div>'+
				'<div class="clear"></div>';
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
				'		<span>*</span>所在地区：'+
				'	</div>'+
				'	<div class="consultContent consultRegion">'+			
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem1">'+
				'	<div class="consultTitle">'+
				'		咨询人单位：'+
				'	</div>'+
				'	<div class="consultContent consultCompany">'+			
				'	<input type="radio" name="type" value="10" checked ><span>个人</span>'+			
				'	<input type="radio" name="type" value="40"><span>合作社</span>'+			
				'	<input type="radio" name="type" value="80"><span>家庭农场</span>'+			
				'	<input type="radio" name="type" value="85"><span>种植大户</span>';
		if( proInfo.consult_type == 10 )
		{
			consultList +='	<input type="radio" name="type" value="30"><span>经销公司</span>';	
		}
		consultList +=	'<input class="none" type="text" name="company" value="">'+			
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem1 consultShow">'+
				'	<div class="consultTitle">'+
				'		贷款购机：'+
				'	</div>'+
				'	<div class="consultContent">'+			
				'	<input type="radio" name="loan" value="10" checked ><span>需要</span>'+			
				'	<input type="radio" name="loan" value="-10"><span>不需要</span>'+
				'	</div>'+
				'</div>';
		consultList +=	'<div class="clear"></div><div class="consultItem1 consultShow">'+
				'	<div class="consultTitle">'+
				'		农机保险：'+
				'	</div>'+
				'	<div class="consultContent">'+			
				'	<input type="radio" name="insurance" value="10" checked ><span>需要</span>'+			
				'	<input type="radio" name="insurance" value="-10"><span>不需要</span>'+
				'	</div>'+
				'</div>';					
		consultList +=	'<div class="clear"></div><div class="consultItem1">'+
				'	<div class="consultTitle">'+
				'		咨询内容：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<input type="hidden" name="cate" value="10">'+			
				'		<textarea id="consultContent" name="content">我想咨询该产品的价格和介绍。</textarea>'+
				'		<div class="ts_text">提示：留言内容不要超过300个字，请不要在该留言框内发送无关信息。</div>'+
				'	</div>'+
				'</div>';
		
		consultList +=	'<div class="clear"></div><div class="consultItem">'+
				'	<div class="consultTitle">'+
				'		其它品牌：'+
				'	</div>'+
				'	<div class="consultContent">'+
				'		<input name="other_brand" type="radio" value="10" checked/><span>同时咨询其他品牌</span>'+
				'		<input name="other_brand" type="radio" value="20"/><span>只咨询此品牌</span>'+
				'	</div>'+
				'</div>';

		consultEnd =	'<div class="clear"></div><div class="button">'+
				'<input type="hidden" name="terminal" value="'+proInfo.terminal+'" />'+
				'<input type="button" id="consultSubmit" value="咨询价格" />'+
				'</div>'+
				'</form>'+
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