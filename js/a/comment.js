/**
 * @purpose 评论
 * @author zhangheng
 * @created 2017-11-17 14:53
 */

(function(){
	var BASEURI = window.BASEURI || '/',
		$body = $('body'),
		$css = $('<style type="text/css">\
		.comment-content{border:1px solid #e5e5e5;border-bottom:0;width:100%;margin-top:20px;}\
		.cmnt-box{background-color:#fcfcfc;padding:14px 16px;box-sizing:border-box;}\
		.cmnt-box h3{margin-bottom:8px;}\
		.cmnt-box h3 span{background:url('+HTTP_CODE+'/images/title_img.png) no-repeat;height:27px;display:block;}\
		.c-user-input textarea{border:1px solid #cccccc;border-radius:3px;width:100%;box-sizing:border-box;padding:8px 10px;font-size:16px;min-height:120px;outline:none;}\
		.c-user-up{margin-top:6px;}\
		.c-user-up .left{font-size:16px;color:#acacac;}\
		.c-user-up .left a{font-size:16px;color:#acacac;line-height:37px;}\
		.c-user-up .left a:hover{color:#333;}\
		.c-user-up .right a{background-color:#e1e1e1;border-radius:3px;font-size:16px;color:#747474;padding:8px 36px;display:block;}\
		.c-user-up .right a:hover{background-color:#fa6e00;color:#fff;}\
		.cmnt-con{background-color:#fff;border-bottom:1px solid #e5e5e5;}\
		.cmnt-list{border-top:1px solid #e5e5e5;padding:15px;}\
		.c-face{border:1px solid #dadada;width:50px;float:left;height:50px;border-radius:50%;background:url('+HTTP_CODE+'/images/photo_img.png) no-repeat;}\
		.c-face{overflow:hidden;line-height: 48px;vertical-align: middle;}\
		.c-face img{max-width:100%; max-height:100%; vertical-align:middle;}\
		.info-d-con{margin-left:65px;}\
		.info-d-con h3{font-size:14px;font-weight:normal;color:#acacac;}\
		.info-d-con h3 em{font-style:normal;color:#fa6e00;}\
		.info-d-con p{text-align: justify;display:block;margin-bottom:8px;color:#333;}\
		.operation .left{color:#333;}\
		.operation .right a{height:14px;line-height:14px;display:inline-block;overflow:hidden;padding-left:18px;color:#333;}\
		.operation .right a:hover{color:#fa6e00;background-position:left top;}\
		.operation .right .pos-icon1{min-width:55px;border-right:1px solid #e7e7e7;}\
		.operation .pos-icon1{background:url('+HTTP_CODE+'/images/pos_icon1.png) no-repeat left bottom;}\
		.operation .pos-icon1 em{Font-style:normal;margin-left:4px;}\
		.operation .pos-icon2{background:url('+HTTP_CODE+'/images/pos_icon2.png) no-repeat left bottom;margin-left:20px;}\
		.hf-more{display:block;}\
		.hf-more a{color:#bababa;}\
		.hf-more a:hover{text-decoration:underline; color:#fa6e00;}\
		</style>').insertBefore($body),
		$commentBody = $('<div class="comment-content">\
			<div class="cmnt-box">\
				<h3><span></span></h3>\
				<form id="comment">\
				<div class="c-user-input">\
					<textarea name="content" id="content" placeholder="请输入评论内容"></textarea>\
				</div>\
				<div class="c-user-up">\
					<div class="left">\
						<a id="loginCommentBtn" href="javascript:">登录</a> |\
						<a href="'+HTTP_USER+'/reg/signup'+(window.CRYPT_URL ? '?uri='+window.CRYPT_URL : '')+'" target="_blank">注册</a>\
					</div>\
					<div class="right">\
						<a id="submitCommentBtn" href="javascript:">发布</a>\
					</div>\
					<div class="clear"></div>\
				</div>\
				<input type="hidden" value="'+origin+'" name="origin">\
				<input type="hidden" value="'+origin_id+'" name="origin_id">\
				</form>\
			</div>\
			<div id="commentList" class="cmnt-con"></div>\
		</div>'),
		$loginCommentBtn = $commentBody.find('#loginCommentBtn'),
		$commentForm = $commentBody.find('form#comment'),
		$commentList = $commentBody.find('#commentList'),
		$submitCommentBtn = $commentBody.find('#submitCommentBtn'),
		$commentContainer = $('#commentContainer');
	if ( 0==$commentContainer.size() )
	{
		$commentContainer = $('<div id="commentContainer"></div>').appendTo($body);
	}
	$commentBody.appendTo($commentContainer);

	function assignHtml(data)
	{
		if ( STATUS_SUCCESS!=data.status )
		{
			return '';
		}
		var html = '', i = 0, comments = data.comments, comment, avatar = HTTP_CODE+"/images/photo_img.png";
		for ( ; i<data.comments.length; i++ )
		{
			comment = comments[i];
			if ( ''!=comment.avatar )
			{
				avatar = comment.avatar;
			}
			html += '<div class="cmnt-list" data-rel="commentOne">\
				<div class="c-face"><img src="'+avatar+'"/></div>\
				<div class="info-d-con">\
					<h3><em>'+comment.nickname+'</em></h3>\
					<p>'+comment.content+'</p>\
					<div class="operation" data-rel="operation">\
						<div class="left">'+fn.timeLong(comment.created)+'</div>\
						<div class="right">\
							<a href="javascript:" class="pos-icon1'+('Y'==comment.laud ? ' active' : '')+'" data-id="'+comment.id+'" data-rel="laud">赞<em>'+comment.laud_number+'</em></a>\
							<a href="javascript:" class="pos-icon2" data-rel="reply">回复</a>\
						</div>\
						<div class="clear"></div>\
					</div>\
					'+(comment.reply_number>0 ? '<div class="hf-more"><a href="'+HTTP_COMMENT+'/reply/'+origin+'/'+origin_id+'/'+comment.id+' "target="_blank">查看全部回复</a></div>' : '')+'\
				</div>\
				<div class="reply_box none">\
					<form data-rel="replyForm_'+comment.id+'">\
					<div class="post_user_cont">\
						<textarea name="content" placeholder="请输入评论内容"></textarea>\
					</div>\
					<div class="cmnt_user_cont">\
						<ul>\
							<li class="cmnt_login" data-id="'+comment.id+'" data-rel="reply_submit">发表评论</li>\
							<input type="hidden" name="origin" value="'+origin+'"/>\
							<input type="hidden" name="origin_id" value="'+origin_id+'"/>\
						</ul>\
						<div class="clear"></div>\
					</div>\
					<input type="hidden" name="reply_id" value="'+comment.id+'"/>\
					</form>\
				</div>\
			</div>\
			<div class="clear"></div>';
		}
		return html;
	}
	var page = new Page($commentList);
	page.url = BASEURI + 'comment';
	page.setData({"origin":origin, "origin_id":origin_id});
	page.request(assignHtml, undefined);

	/*发布评论*/
	$submitCommentBtn.click(function(){
		if($("#content").val() == '')
		{
			inform('请输入评论内容',function(){
				$("#content").focus();
			});
			return false;
		}
		$.post(BASEURI+"comment/create", $commentForm.serialize(), function(data){
			if(STATUS_SUCCESS == data.status)
			{
				inform('发表成功', function(){
					$commentList.prepend(addCommentHtml(data));
					$commentForm.find('#content').val('');
				});
			}
			else
			{
				ajaxCallback(data, undefined);
			}
		}, 'json');
	});

	/**
	 * @purpose 追加一条评论HTML
	 */
	function addCommentHtml(data)
	{
		var commentHtml, comment = data.comment, avatar = HTTP_CODE+"/images/photo_img.png";
		if('' != data.user.detail.avatar)
		{
			avatar = data.user.detail.avatar;
		}
		commentHtml = '<div class="cmnt-list" data-rel="commentOne">\
				<div class="c-face"><img src="'+avatar+'"/></div>\
				<div class="info-d-con">\
					<h3><em>'+comment.nickname+'</em></h3>\
					<p>'+$commentForm.find('#content').val()+'</p>\
					<div class="operation" data-rel="operation">\
						<div class="left">'+fn.timeLong(comment.created)+'</div>\
						<div class="right">\
							<a href="javascript:" class="pos-icon1" data-id="'+comment.id+'" data-rel="laud">赞<em>0</em></a>\
							<a href="javascript:" class="pos-icon2" data-rel="reply">回复</a>\
						</div>\
						<div class="clear"></div>\
					</div>\
				</div>\
				<div class="reply_box none">\
					<form data-rel="replyForm_'+comment.id+'">\
					<div class="post_user_cont">\
						<textarea name="content" cols="" rows="" placeholder="请输入评论内容"></textarea>\
					</div>\
					<div class="cmnt_user_cont">\
						<ul>\
						<li class="cmnt_login" data-id="'+comment.id+'" data-rel="reply_submit">发表评论</li>\
							<input type="hidden" name="origin" value="'+origin+'"/>\
							<input type="hidden" name="origin_id" value="'+origin_id+'"/>\
						</ul>\
					<div class="clear"></div>\
					</div>\
					<input type="hidden" name="reply_id" value="'+comment.id+'"/>\
					</form>\
				</div>\
			</div>\
			<div class="clear"></div>';
		return commentHtml;
	}


	/**
	 * @purpose 点赞
	 */
	$commentList.on('click', '[data-rel="laud"]', function(){
		var $this=$(this),id = $this.data('id'),number = $this.find('em').text();
		$.post(BASEURI+"comment/laud", {'comment_id': id}, function(data){
			if ( data.status == STATUS_SUCCESS )
			{
				if ( 'Y'==data.switch )
				{
					inform(data.message,function () {
						$this.addClass('active');
						number = parseInt(number)+1;
						$this.find('em').html(number);
					});
				}
				else
				{
					inform(data.message,function () {
						$this.removeClass('active');
						number = parseInt(number)-1;
						$this.find('em').html(number);
					});
				}
			}
			else
			{
				ajaxCallback(data, undefined);
			}
		}, 'json');
	});

	/**
	 * @purpose 回复
	 */
	$commentList.on('click', '[data-rel="reply"]', function(){
		var $commentOne = $(this).closest('[data-rel="commentOne"]'),
			$replyBox = $commentOne.find('.reply_box');
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

	/**
	 * @purpose 点击回复评论
	 */
	$commentList.on('click', '[data-rel="reply_submit"]', function(){
		var $this = $(this), $form = $this.closest('form');
		if ( $form.find('[name="content"]').val()=='' )
		{
			inform('请输入评论内容',function(){
				$form.find('[name="content"]').focus();
			});
			return false;
		}

		$.post(BASEURI+"comment/create", $form.serialize(), function(data){
			var comment = data.comment;
			if ( STATUS_SUCCESS==data.status )
			{
				inform('发表成功',function(){
					$form.parent('.reply_box').slideUp();
					$form.find('[name="content"]').val('');
					if($this.closest('[data-rel="commentOne"]')
						.find('[data-rel="operation"]').html() == '')
					{
						$this.closest('[data-rel="commentOne"]')
							.find('[data-rel="operation"]')
							.after('<div class="hf-more">\
								<a href="'+HTTP_COMMENT+'/reply/'+origin+'/'+origin_id+'/'+data.comment.reply_id+' "target="_blank">查看全部回复</a>\
								</div>');
					}
				});
			}
			else
			{
				ajaxCallback(data, undefined);
			}
		}, 'json');
	});

	/**
	 * @purpose 登录
	 * @author zhangheng
	 * @created 2017-11-23 18:20
	 */
	$loginCommentBtn.click(function(){
		if ( 'function'===typeof(fnLoginDialog) )
		{
			fnLoginDialog(function(){
				$commentForm.find('#content').focus();
			});
		}
		else
		{
			window.open(HTTP_AUTH+'/signin');
		}
	});
})();