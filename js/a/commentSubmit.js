/**
 * Created by programe1 on 11/24/14.
 */
function submitComment(baseuri)
{
	live('#publish', 'click', function(){
		if($("#content").val() == '')
		{
			inform('请输入评论内容',function(){
				$("#content").focus();
			});
			return false;
		}
		$.post(baseuri, $("#comment").serialize(),function(data){
			if(STATUS_SUCCESS == data.status)
			{
				inform('发表成功');
				$('#flag').after(commentSuccess(data));

				$("#totalComment").html($("#totalComment").data('rel')+1);
				$("#content").val('');
				$("#verifyCode").val('');
			}
			else
			{
				ajaxCallback(data);
			}
		}, 'json');
	});
}

/**
 * @purpose: 回复
 */
function replyComment(baseuri)
{
	live('[data-rel="reply_submit"]', 'click', function(){
		var form = $('.reply'+$(this).attr('data-id'));
		if(form.find('[name="content"]').val()=='')
		{
			inform('请输入评论内容',function(){
				form.find('[name="content"]').focus();
			});
			return false;
		}

		$.post(baseuri, form.serialize(), function(data){
			if(STATUS_SUCCESS == data.status)
			{
				inform('发表成功');

				$('.reply'+data.replyId).parent('.reply_box').slideUp();
				$('.reply'+data.replyId).find('[name="content"]').val('');
			}
			else
			{
				ajaxCallback(data);
			}
		}, 'json');
	});
}

function getComment(page)
{
	var BASEURI = window.BASEURI || '/';
	var submitUri = BASEURI+"comment/create"; //提交评论地址

	page.url = BASEURI+"comment/getComment";
	page.setData({"origin":origin, "origin_id":objectId});
	page.request(getCommentHtml);

	commentReply();
	submitComment(submitUri);
	replyComment(submitUri);

}


(function(){
	if ( 'undefined'==typeof(origin) || !/^[\d]+$/.test(origin) ) return false;
	if ( 'undefined'==typeof(objectId) || !/^[\d]+$/.test(objectId) ) return false;

	var page = new Page($(".comment_box"));
	getComment(page);
})();