var verifyURI = window.BASEURI || '/';
function getCommentHtml(data, page)
{
	var cssHtml = '#js-page-container{text-align:center;border:1px #dedede solid; border-top:0;border-right:0;padding: 10px 0 10px 0;}\
		#js-page-container a:link,#js-page-container a:visited,#js-page-container b{margin:5px 2px 0 2px;padding:5px 10px;border:1px solid #d7d7d7;color:#333333;background-color:#f5f5f5;border-radius:2px;display:inline-block;}\
		#js-page-container a:hover{border:1px solid #ff731f;color:#fff;background-color:#ff8942;}\
		#js-page-container b{border:1px solid #f25b00;color:#fff;background-color:#ff6b12;}';
	page.setCSS(cssHtml);

    var html = read_title = comment_head = comment_list = end = '';
    read_title = '<div class="read_title"><span>发表评论</span></div>';
    comment_head = '<div class="comment">';
    comment_head +=     '<form id="comment">';
    comment_head +=     '<div class="post_user">';
    comment_head +=         '<div class="post_user_count">';
    comment_head +=             '<a href="'+HTTP_COMMENT+'/'+origin+'/'+objectId+'" target="_blank">';
    if(data.length == 1)
    {
        comment_head +=                 '已有<span id="totalComment" data-rel="0">0</span>条评论';
    }
    else
    {
        comment_head +=                 '已有<span id="totalComment" data-rel="'+data[0].total+'">'+data[0].total+'</span>条评论';
    }

    comment_head +=             '</a>';
    comment_head +=         '</div>';
    comment_head +=         '<div class="post_user_cont"><textarea name="content" id="content" cols="" rows="" placeholder="请输入评论内容"></textarea></div>';
    comment_head +=         '<div class="cmnt_user_cont">';
    comment_head +=             '<ul>' +
                                        '<li class="user_login">用户名：<input name="nickname" id="nickname" type="text" /></li>' +
                                        '<li class="user_login">验证码：<input name="verify" value="" id="verifyCode" data-id="verifyCode"/><img src="'+verifyURI+'verify_handler/index/100/30/4/18" style="cursor:pointer;" data-id="verify"/> </li>' +
                                        '<li class="cmnt_login" id="publish">发表评论</li>' +
                                        '<input type="hidden" name="articleId" value="'+objectId+'"/> '+
                                '</ul>' +
                                '<div class="clear"></div>' +
                            '</div>' +
                        '</div>' +
                        '</form>'+
                    ' <h3 id="flag"><span id="refresh">刷新</span>最新评论</h3>';
    if((data.length-1) > 0)
    {
        var bad = '不支持', good = '支持';
        for(var i=0; i<(data.length-1); i++)
        {

            if(data[i].bad > 0)
            {
                bad = '不支持('+data[i].bad+')';
            }
            if(data[i].good > 0)
            {
                good = '支持('+data[i].good+')';
            }

            comment_list += '<div class="comment_list list'+data[i].id+'" data-id="'+data[i].id+'">';
            if(data[i].province == '')
            {
                comment_list +=             '<h4>'+data[i].nickname+'</h4>';
            }
            else
            {
                comment_list +=             '<h4>'+data[i].nickname+'['+data[i].province+data[i].city+']</h4>';
            }

            comment_list += '<p>'+data[i].content+'</p>';
            comment_list += '<div><span class="reply_date">'+delSec(data[i].created)+'</span><span class="reply_icon" data-support="1">'+bad+'</span><span class="reply_icon" data-support="2">'+good+'</span><span class="reply_icon reply">回复</span></div>';
            comment_list += '<div class="clear"></div>';

            for(var j=0; j<data[i].replylist.length; j++)
            {
                if(j<3)
                {
                    comment_list += "<div class='clear'></div>";
                    comment_list += '<div style="padding-left: 50px; margin:10px 0 30px 0;">';
                    comment_list += '<dl>';
                    comment_list += '<dt></dt>';
                    comment_list += '<dd style="width: 82%">';

                    if(data[i].province == '')
                    {
                        comment_list +=             '<h4>'+data[i].replylist[j].nickname+'</h4>';
                    }
                    else
                    {
                        comment_list +=             '<h4>'+data[i].replylist[j].nickname+'['+data[i].replylist[j].province+data[i].replylist[j].city+']</h4>';
                    }

                    comment_list += '<p>'+data[i].replylist[j].content+'</p>';
                    comment_list += '<div><span class="reply_date">'+data[i].replylist[j].created+'</span></div>';
                    comment_list +=         '</dd>';
                    comment_list +=     '</dl>';
                    comment_list += '</div>';
                }

            }

            comment_list += '<div class="reply_box none">';
            comment_list += '<form class="reply'+data[i].id+'">';
            comment_list +=     '<div class="post_user_cont"><textarea name="content" cols="" rows="" placeholder="请输入评论内容"></textarea></div>';
            comment_list +=         '<div class="cmnt_user_cont">';
            comment_list +=             '<ul>';
            comment_list +=                 '<li class="user_login">用户名：<input name="nickname" data-id="nickname" type="text" /></li>';
            comment_list +=                 '<li class="cmnt_login" data-id="'+data[i].id+'" data-rel="reply_submit">发表评论</li>';
            comment_list +=                 '<li class="user_login">验证码：<input name="verify" value="" data-id="verifyCode"/>';
            comment_list +=                     '<img src="'+verifyURI+'verify_handler/index/100/30/4/18" style="cursor:pointer;" data-id="verify"/>';
            comment_list +=                 '</li>';
            comment_list +=                 '<input type="hidden" name="articleId" value="'+objectId+'"/> ';
            comment_list +=             '</ul>';
            comment_list +=             '<div class="clear">';
            comment_list +=          '</div>';
            comment_list +=      '</div><input type="hidden" name="replyId" value="'+data[i].id+'"/>';
            comment_list += '</form></div>';
            comment_list += '</div>';
            comment_list += '<div class="clear"></div>';




        }
    }

    end = '</div>';
    html = read_title + comment_head + comment_list + end;
    return html;
}



/**
 * 评论成功，追加一条评论
 */
function commentSuccess(data,objectId)
{
    var comment_list = '', bad = '不支持', good = '支持';

    if(data.bad > 0)
    {
        bad = '不支持('+data.bad+')';
    }
    if(data.good > 0)
    {
        good = '不支持('+data.good+')';
    }


    comment_list += '<div class="comment_list list'+data.id+'" data-id="'+data.id+'">';
    if(data.province == '')
    {
        comment_list +=             '<h4>'+$("#nickname").val()+'</h4>';
    }
    else
    {
        comment_list +=             '<h4>'+$("#nickname").val()+'['+data.province+data.city+']</h4>';
    }


    comment_list += '<p>'+data.content+'</p>';
    comment_list += '<div><span class="reply_date">'+data.created+'</span><span class="reply_icon" data-support="1">'+bad+'</span><span class="reply_icon" data-support="2">'+good+'</span><span class="reply_icon reply">回复</span></div>';
    comment_list += '<div class="clear"></div>';
    comment_list += '<form class="reply'+data.id+'">';
    comment_list += '<div class="reply_box none">';
    comment_list +=     '<div class="post_user_cont"><textarea name="content" cols="" rows="" placeholder="请输入评论内容"></textarea></div>';
    comment_list +=         '<div class="cmnt_user_cont">';
    comment_list +=             '<ul>' +
        '<li class="user_login">用户名：<input name="nickname" data-id="nickname" type="text" /></li>' +
        '<li class="user_login">验证码：<input name="verify" value="" data-id="verifyCode"/><img src="'+verifyURI+'verify_handler/index/100/30/4/18" style="cursor:pointer;" data-id="verify"/> </li>' +
        '<li class="cmnt_login" data-id="'+data.id+'" data-rel="reply_submit">发表评论</li>' +
        '<input type="hidden" name="articleId" value="'+objectId+'"/> '+
        '</ul>' +
        '<div class="clear"></div>' +
        '</div><input type="hidden" name="replyId" value="'+data.id+'"/>'+
        '</div></form>';
    comment_list += '</div>';
    comment_list += '<div class="clear"></div>';

    return comment_list;
}

function commentReply()
{
    live('.reply', 'click', function(){
        var $commentList=$(this).parents('.comment_list'), $replyBox=$commentList.find('.reply_box');
		if ( $replyBox.is(':hidden') )
		{
			$replyBox.show().height(0).animate({'height':'165px'}, 500);
		}
		else
		{
			$replyBox.animate({'height':'0px'}, 500, function(){
				$replyBox.hide();
			});
		}
        $commentList.siblings().find('.reply_box').slideUp();
    });
}

/*对评论内容进行回复，追加到该评论下方*/
function comentReplySuccess(data)
{
    var html = '';
    html = "<div class='clear'></div>";
    html += '<div style="padding-left: 50px; margin:10px 0 30px 0;">';
    html += '<dl>';
    html += '<dt></dt>';
    html += '<dd style="width: 82%">';
    html += '<h4>'+$('.reply'+data.replyId).find('[name="nickname"]').val()+'['+data.province+data.city+']</h4>';
    html += '<p>'+$('.reply'+data.replyId).find('[name="content"]').val()+'</p>';
    html += '<div><span class="reply_date">'+data.created+'</span></div>';
    html +=         '</dd>';
    html +=     '</dl>';
    html += '</div>';

    return html;
}


/*获取每一条评论的回复内容*/
function replyList(replyListUri)
{
    var html = '';
    $.post(replyListUri,function(data){

        for(var i=0; i<data.replylist.length; i++)
        {
            html = "<div class='clear'></div>";
            html += '<div style="padding-left: 50px; margin:10px 0 30px 0;">';
            html += '<dl>';
            html += '<dt></dt>';
            html += '<dd style="width: 82%">';
            html += '<h4>'+data.replylist[i].nickname+'['+data.replylist[i].province+data.replylist[i].city+']</h4>';
            html += '<p>'+data.replylist[i].content+'</p>';
            html += '<div><span class="reply_date">'+data.replylist[i].created+'</span></div>';
            html +=         '</dd>';
            html +=     '</dl>';
            html += '</div>';


            $('.reply'+data.replylist[i].reply_id).parent('.reply_box').before(html);
            html = '';
        }

    },'json');
}

//格式化日期
function delSec(time)
{
    var timeArr = time.split(' '), timeYMD = timeArr[0].split('-'), timeHms = timeArr[1].split(':');
    return timeYMD[1]+'月'+timeYMD[2]+'日'+' '+timeHms[0]+':'+timeHms[1];
}

/*获取验证码*/
live('[data-id="verify"]', 'click', function(){
    $(this).siblings('[data-id="verifyCode"]').focus();
});

/*获取光标时，更换验证码*/
live('[data-id="verifyCode"]', 'focus', function(){
    if($(this).val()=='')
    {
        $(this).siblings('img').attr('src',verifyURI+'verify_handler/index/100/30/4/18?r='+new Date().getTime());
    }
});

