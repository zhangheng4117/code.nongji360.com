/**
 * @purpose 上传多张图片
 * @param options object 选项
 * @author zhangheng
 * @created 2017-12-21 10:50
 */

function videoUpload(options)
{
	if ( !WebUploader.Uploader.support() )
	{
		inform('您的浏览器不支持上传视频，请升级高版本浏览器或Flash插件', undefined, undefined);
		return false;
	}

	if ( 'object'!=typeof(options) ) options = {};
	if ( !options.selector ) options.selector = '#videoUpload';
	if ( !options.width ) options.width = "auto";
	if ( !options.height ) options.height = "auto";
	if ( !options.hidden ) options.hidden = 'video';
	if ( !options.thumb ) options.thumb = 'thumb';
	if ( !options.duration ) options.duration = 'duration';
	if ( !options.thumbWidth ) options.thumbWidth = 140;
	if ( !options.thumbHeight ) options.thumbHeight = 140;
	if ( !options.formData ) options.formData = {};
	var $imageUpload = $(options.selector).addClass('webuploader-container'),
		$closestForm = $imageUpload.closest('form'),
		$hidden = $closestForm.find('[name="'+options.hidden+'"]'),
		$thumb = $closestForm.find('[name="'+options.thumb+'"]'),
		$duration = $closestForm.find('[name="'+options.duration+'"]'),
		buttonText = buttonText = options.buttonText ||
			'<div style="'+("auto"!=options.width ? 'width:'+options.width+'px;' : '')+
			("auto"!=options.height ? 'height:'+options.height+'px;line-height:'+options.height+'px;' : '')+'">' +
			'上传视频</div>',
		initImageHtml = '', initThumbSrc = '', initHiddenValue = '';
	if ( "auto"!=options.width && "auto"!=options.height )
	{
		$imageUpload.css({"width":options.width,"height":options.height});
	}
	options.formData = $.extend(options.formData, {
		"timestamp":$closestForm.find('#timestamp').val(),
		"token":$closestForm.find('#token').val(),
		"rand":new Date().getTime()+Math.random()
	});
	if ( $hidden.size()>0 )
	{
		initHiddenValue = $hidden.val();
	}
	if ( !!options.container )
	{
		if ( 'string'==typeof(options.container) ) options.container = $(options.container);
		if ( 0==options.container.children().size() )
		{
			options.container.html('<div class="video-one" data-rel="video-one">' +
				'<div class="video-image" data-rel="image"></div>' +
				'<a href="javascript:" class="video-delete" data-rel="delete">删除</a>'+
				'<div class="video-progress" data-rel="progress">' +
				'<p class="video-progress-bar" data-rel="progressBar"></p></div>' +
				'</div>');
		}
		initImageHtml = options.container.find('[data-rel="image"]').html();
	}
	if ( !!options.cancelButton )
	{
		if ( 'string'==typeof(options.cancelButton) ) options.cancelButton = $(options.cancelButton);
	}
	if ( !!options.thumbSelector )
	{
		initThumbSrc = $(options.thumbSelector).attr('src');
	}

	var uploader = WebUploader.create({
		pick:{id:options.selector, innerHTML:buttonText, multiple:true},
		fileVal:options.fileVal || 'Filedata', paste:!!options.paste ? options.paste : undefined,
		accept:{
			title:'视频文件',
			extensions:options.fileTypeExts || 'mp4,wmv,avi,mov,mpeg,mpg,3gp,mkv,flv',
			mimeTypes:undefined==options.mimeTypes ?
				'video/mp4,video/x-ms-wmv,video/x-msvideo,video/quicktime,video/mpeg,video/3gpp' :
				(false===options.mimeTypes ? '' : options.mimeTypes)
		},
		runtimeOrder:options.runtimeOrder || 'html5,flash',
		swf:'/images/uploader.swf',//swf文件路径
		auto:undefined==options.auto ? true : options.auto, disableGlobalDnd:true, chunked:true,
		server:!!options.server ? options.server : HTTP_VIDEO_FILE+'/uploadVideo.php?type='+options.type,
		formData:options.formData,
		fileSingleSizeLimit:options.size || 50 * 1024 * 1024    // 50M
	});

	uploader.onFileQueued = function(file)
	{
		if ( !!options.container )
		{
			options.container.find('[data-rel="video-one"]').addClass('video-queued');
		}
	};

	uploader.onFileDequeued = function(file)
	{
		if ( !!options.container )
		{
			options.container.find('[data-rel="video-one"]').removeClass('video-queued');
		}
		uploader.refresh();
	};

	uploader.onUploadStart = function(file)
	{
		if ( !!options.cancelButton )
		{
			options.cancelButton.unbind('click').click(function(){
				uploader.stop(true);
				uploader.cancelFile(file);
			});
		}
		if ( !!options.container )
		{
			var $progress = options.container.find('[data-rel="progress"]'),
				$delete = options.container.find('[data-rel="delete"]'),
				$image = options.container.find('[data-rel="image"]');
			if ( $progress.size()>0 )
			{
				$progress.show();
			}
			if ( $delete.size()>0 )
			{
				$delete.unbind('click').click(function(){
					if ( 'ready'==uploader.state || 'uploading'==uploader.state || 'paused'==uploader.state )
					{
						uploader.stop(true);
						uploader.cancelFile(file);
					}
					options.container.find('[data-rel="video-one"]').removeClass('video-queued');
					if ( $progress.size()>0 )
					{
						$progress.hide();
					}
					if ( $hidden.size()>0 )
					{
						$hidden.val(initHiddenValue);
					}
					if ( $image.size()>0 )
					{
						$image.html(initImageHtml);
					}
					if ( $thumb.size()>0 )
					{
						$thumb.val('');
					}
					if ( !!options.thumbSelector )
					{
						$(options.thumbSelector).attr('src', initThumbSrc);
					}
				});
			}
		}

		if ( 'function' == typeof options.onUploadStart )
		{
			options.onUploadStart(file);
		}
	};

	uploader.onUploadProgress = function(file, percentage)
	{
		if ( !!options.container )
		{
			var per = (percentage * 100).toFixed(2),
				$progress = options.container.find('[data-rel="progress"]'),
				$progressBar = options.container.find('[data-rel="progressBar"]');
			per = per<100 ? per+'%' : '保存中';
			if ( $progressBar.size()>0 )
			{
				$progressBar.width($progress.width()*percentage).html(per);
			}
			else if ( $progress.size()>0 )
			{
				$progress.html(per);
			}
		}

		if ( 'function' == typeof options.onUploadProgress )
		{
			options.onUploadProgress(file, percentage);
		}
	};

	uploader.onUploadSuccess = function(file, data)
	{
		if ( STATUS_SUCCESS!=data.status )
		{
			uploader.removeFile(file);
			return false;
		}

		if ( !!options.container )
		{
			var $progress = options.container.find('[data-rel="progress"]'),
				$image = options.container.find('[data-rel="image"]');
			if ( $progress.size()>0 )
			{
				$progress.hide();
			}
			if ( !!data.frames && !!data.frames[0] )
			{
				if ( $image.size()>0 )
				{
					$image.html('<img src="'+data.frames[0]+'"' +
						' style="'+("auto"!=options.thumbWidth ? 'max-width:'+options.thumbWidth+'px;' : '')+
						("auto"!=options.thumbHeight ? 'max-height:'+options.thumbHeight+'px;' : '')+
						'" />');
				}
				if ( $thumb.size()>0 )
				{
					$thumb.val(data.frames[0]);
				}
				if ( !!options.thumbSelector )
				{
					$(options.thumbSelector).attr('src', data.frames[0]);
				}
			}
		}
		if ( $hidden.size()>0 )
		{
			$hidden.val(data.url);
		}
		if ( $duration.size()>0 )
		{
			$duration.val(data.duration || 0);
		}

		if ( 'function' == typeof options.onUploadSuccess )
		{
			options.onUploadSuccess(file, data);
		}
	};

	uploader.onError = function(code)
	{
		var text;
		switch ( code )
		{
			case 'F_EXCEED_SIZE':
			case 'Q_EXCEED_SIZE_LIMIT':
				text = '文件大小超出限制：'+(this.options.fileSingleSizeLimit/1024/1024).toFixed(2)+'M';
				break;
			case 'F_DUPLICATE':
				text = '重复上传同一个文件';
				break;
			case 'Q_TYPE_DENIED':
				text = !!this.options.fileTypeExts ?
					'只允许上传'+this.options.fileTypeExts+'格式的文件' : '扩展名错误';
				break;
			default:
				text = '上传失败，请重试' + code;
				break;
		}
		inform(text, undefined, undefined);
	};

	return uploader;
}