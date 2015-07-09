/**
 * Created by programe1 on 11/24/14.
 */
function submitComment(baseuri)
{
    live('#publish', 'click', function(){
        if($("#content").val() == '')
        {
            jAlert('请输入评论内容',function(){
                $("#content").focus();
            });
        }
        else if($(this).siblings().find('input[name="nickname"]').val() == '')
        {
            jAlert("请输入用户名",function(){
                $("#nickname").focus();
            });
        }
        else if($("[data-id='verifyCode']").val() == '')
        {
            jAlert("请输入验证码",function(){
                $("#verifyCode").focus();
            });
        }
        else
        {
            $.post(baseuri, $("#comment").serialize(),function(data){
                if(STATUS_SUCCESS == data.status)
                {
                    inform('发表成功');
                    $("#totalComment").html($("#totalComment").data('rel')+1);

                    $("#content").val('');
                    $("#verifyCode").val('');

                    $('#flag').after(commentSuccess(data,objectId));
                }
                else
                {
                    ajaxCallback(data);
                }
            }, 'json');
        }
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
            jAlert('请输入评论内容',function(){
                form.find('[name="content"]').focus();
            });
        }
        else if(form.find('[name="nickname"]').val()=='')
        {
            jAlert('请输入用户名', function(){
                form.find('[name="nickname"]').focus();
            });
        }
        else if(form.find('[name="verify"]').val()=='')
        {
            jAlert('请输入验证码', function(){
                form.find('[name="verify"]').focus();
            });
        }
        else
        {
            $.post(baseuri, form.serialize(), function(data){
                if(STATUS_SUCCESS == data.status)
                {
                    inform('发表成功');

                    $('.reply'+data.replyId).parent('.reply_box').slideUp();
                    $('.reply'+data.replyId).parent('.reply_box').before(comentReplySuccess(data));
                    $('.reply'+data.replyId).find('[name="content"]').val('');
                    $('.reply'+data.replyId).find('[name="verify"]').val('');
                }
                else
                {
                    ajaxCallback(data);
                }

            }, 'json');
        }
    });
}

/**
 * @purpose: 支持/不支持
 */
function goodAndBad(baseuri)
{
    live('[data-support]', 'click', function(){

        var type = '', id =  $(this).parents('.comment_list').attr('data-id');
        if($(this).data('support') == 1)
        {
            type = 'bad';
        }
        else if($(this).data('support') == 2)
        {
            type = 'good';
        }

        var cookieStr = getCookie('goodAndBad');
        strId = cookieStr.substring(1);
        if(cookieStr.indexOf('|'+id+'|') >= 0)
        {
            inform('您已经操作过了');
        }
        else
        {
            $.post(baseuri+'/'+type+'/'+id, function(data){
                if(STATUS_SUCCESS == data.status)
                {
                    inform('成功');
                    if(type == 'bad')
                    {
                        $('.list'+id).find('[data-support="1"]').html("不支持("+data.bad+")");
                    }
                    else if(type == 'good')
                    {
                        $('.list'+id).find('[data-support="2"]').html("支持("+data.good+")");
                    }
                    strId += id+'|';
                    setCookie("goodAndBad",'|'+strId,86400);
                }
                else
                {
                    ajaxCallback(data);
                }
            },'json');
        }
    });
}

function getComment(page)
{
    var BASEURI = window.BASEURI || '/';
    var submitUri = BASEURI+"comment/submitComment/"+origin+"/"+getCookie('NJSESSID'), //提交评论地址
        replyuri = BASEURI+"comment/reply/"+origin+"/"+getCookie('NJSESSID'),        //回复评论地址
        supporturi = BASEURI+"comment/goodAndBad"; //支持地址;
	var callback = 'function'==typeof getCommentCallback ? getCommentCallback : function(){};

    page.url = BASEURI+"comment/getComment/"+objectId+'/'+origin;
    page.request(getCommentHtml, callback);

    commentReply();
    submitComment(submitUri);
    replyComment(replyuri);
    goodAndBad(supporturi);

    live('#refresh', 'click', function(){
        page.request(getCommentHtml, callback);
    });

}


(function(){
	if ( 'undefined'==typeof(origin) || !/^[\d]+$/.test(origin) ) return false;
	if ( 'undefined'==typeof(objectId) || !/^[\d]+$/.test(objectId) ) return false;
	
	var page = new Page($(".comment_box"));
	getComment(page);
})();