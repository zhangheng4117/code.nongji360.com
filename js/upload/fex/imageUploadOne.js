/**
 * @purpose 上传单张图片
 * @param options object 选项
 * @author zhangheng
 * @created 2017-12-20 11:07
 */

function imageUploadOne(options)
{
	if ( !WebUploader.Uploader.support() )
	{
		inform('您的浏览器不支持上传图片，请升级高版本浏览器或Flash插件', undefined, undefined);
		return false;
	}

	if ( 'object'!=typeof(options) ) options = {};
	if ( !options.selector ) options.selector = '#imageUpload';
	if ( !options.width ) options.width = 100;
	if ( !options.height ) options.height = 100;
	if ( !options.hidden ) options.hidden = 'thumb';
	if ( !options.formData ) options.formData = {};
	var $imageUpload = $(options.selector).css({"width":options.width,"height":options.height})
			.addClass('webuploader-container'),
		$closestForm = $imageUpload.closest('form'),
		$hidden = $closestForm
			.find('[name="'+options.hidden+'"]'+(options.hiddenUnique?'[data-unique="'+options.hiddenUnique+'"]':'')),
		buttonText = options.buttonText ||
			'<table style="width:100%;border-collapse:separate;border-spacing:0;">' +
			'<tr><td style="height:'+options.height+'px;">' +
			'<img src="{@imageUrl}"' +
			' style="max-width:'+options.width+'px;max-height:'+options.height+'px;vertical-align:middle;" />' +
			'</td></tr></table>';
	if ( $hidden.size()<1 )
	{
		$hidden = $('<input type="hidden" id="'+options.hidden+'" name="'+options.hidden+'" />')
			.insertAfter($imageUpload);
	}
	options.image = options.image || $hidden.val() || HTTP_CODE+'/images/404_100.gif';
	options.formData = $.extend(options.formData, {
		"timestamp":$closestForm.find('#timestamp').val(),
		"token":$closestForm.find('#token').val()
	});

	var uploader = WebUploader.create({
		pick:{id:options.selector, innerHTML:buttonText.replace('{@imageUrl}', options.image), multiple:false},
		fileVal:options.fileVal || 'Filedata', paste:!!options.paste ? options.paste : undefined,
		accept:{
			title:'图像文件',
			extensions:options.fileTypeExts || 'jpg,png,gif,jpeg,bmp',
			mimeTypes:undefined==options.mimeTypes ? 'image/*' :
				(false===options.mimeTypes ? '*' : options.mimeTypes)
		},
		runtimeOrder:options.runtimeOrder || 'html5,flash',
		swf:'/images/uploader.swf',//swf文件路径
		auto:true, disableGlobalDnd:true, chunked:false,
		server:!!options.server ? options.server : HTTP_IMG+'/upload.php?xtype='+options.type,
		formData:options.formData,
		fileSingleSizeLimit:options.size || 1024 * 1024    // 1M
	});

	uploader.onUploadSuccess = function(file, data)
	{
		if ( STATUS_SUCCESS!=data.status ) return false;
		var thumbUrl = data.thumb || data.url,
			$img = $imageUpload.find('.webuploader-pick img');
		if ( $img.size()>0 ) $img.attr('src', thumbUrl);
		if ( !!options.thumbSelector )
		{
			$(options.thumbSelector).attr('src', thumbUrl);
		}
		if ( $hidden.size()>0 ) $hidden.val(data.url);

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
				text = '扩展名错误';
				break;
			default:
				text = '上传失败，请重试' + code;
				break;
		}
		inform(text, undefined, undefined);
	};

	return uploader;
}