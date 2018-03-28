/**
 * @purpose 上传多张图片
 * @param options object 选项
 * @author zhangheng
 * @created 2017-12-21 10:50
 */

var fileIcons = {
	"doc":"doc.png", "docx":"doc.png", "gif":"gif.png", "jpg":"jpg.png",
	"pdf":"pdf.png", "png":"png.png", "ppt":"ppt.png", "pptx":"ppt.png",
	"rar":"rar.png", "tif":"tif.png", "txt":"txt.png", "wps":"wps.png",
	"xls":"xls.png", "xlsx":"xls.png", "zip":"zip.png"
};

function fileUploadMulti(options)
{
	if ( !WebUploader.Uploader.support() )
	{
		inform('您的浏览器不支持上传文件，请升级高版本浏览器或Flash插件', undefined, undefined);
		return false;
	}

	if ( 'object'!=typeof(options) ) options = {};
	if ( !options.selector ) options.selector = '#fileUpload';
	if ( !options.width ) options.width = "auto";
	if ( !options.height ) options.height = "auto";
	if ( !options.formData ) options.formData = {};
	if ( !!options.queue )
	{
		if ( 'string'==typeof(options.queue) ) options.queue = $(options.queue);
	}
	var $fileUpload = $(options.selector).addClass('webuploader-container'),
		$closestForm = $fileUpload.closest('form'),
		fileCount = 0,//当前队列中的文件数量
		fileSize = 0,//当前队列中的文件总大小
		percentages = {},//百分比
		buttonText = options.buttonText ||
			'<div style="'+("auto"!=options.width ? 'width:'+options.width+'px;' : '')+
				("auto"!=options.height ? 'height:'+options.height+'px;line-height:'+options.height+'px;' : '')+'">' +
				'上传文件</div>';
	if ( "auto"!=options.width && "auto"!=options.height )
	{
		$fileUpload.css({"width":options.width,"height":options.height});
	}
	options.formData = $.extend(options.formData, {
		"timestamp":$closestForm.find('#timestamp').val(),
		"token":$closestForm.find('#token').val()
	});
	if ( !!options.queue && !options.itemTemplate )
	{
		options.itemTemplate = '<div id="{@fileID}" data-rel="queue-one" class="queue-one">' +
			'<div class="queue-file" data-rel="file">' +
			'<div class="queue-file-icon" data-rel="file-icon"></div>' +
			'<div class="queue-file-name" data-rel="file-name"></div>' +
			'<div class="clear"></div></div>' +
			'<input type="hidden" name="files[]" data-rel="url" />' +
			'<input type="hidden" name="names[]" data-rel="name" />' +
			'<a href="javascript:" class="queue-delete" data-rel="delete">删除</a>'+
			'<div class="queue-progress" data-rel="progress">' +
			'<p class="queue-progress-bar" data-rel="progressBar"></p></div>' +
			'</div>';
	}

	var uploader = WebUploader.create({
		pick:{id:options.selector, innerHTML:buttonText, multiple:true},
		fileVal:options.fileVal || 'Filedata',
		paste:!!options.paste ? options.paste : undefined,//用来复制的DOM对象,document.body为整个body都可以复制文件上传
		accept:{
			title:'文件',
			extensions:options.fileTypeExts || 'doc,docx,xls,xlsx,ppt,pptx,txt,pdf,jpg,jpeg,gif,png,rar,zip',
			mimeTypes:undefined==options.mimeTypes ? '*' : options.mimeTypes
		},
		runtimeOrder:options.runtimeOrder || 'html5,flash',
		swf:'/images/uploader.swf',//swf文件路径
		auto:undefined==options.auto ? true : options.auto, disableGlobalDnd:true, chunked:false,
		server:!!options.server ? options.server : HTTP_IMG+'/upload.php?xtype='+options.type,
		formData:options.formData,
		fileSingleSizeLimit:options.size || 5 * 1024 * 1024    // 5M
	});

	uploader.onBeforeFileQueued = function()
	{
		if ( undefined!=options.maxFile && fileCount>=options.maxFile )
		{
			inform('最多允许上传'+options.maxFile+'个文件哦', undefined, undefined);
			return false;
		}
		return true;
	};

	uploader.onFileQueued = function(file)
	{
		fileCount++;
		fileSize += file.size;

		if ( undefined!=options.queue )
		{
			options.queue.show();
			addFile(file);
		}
		percentages[file.id] = [file.size, 0, ''];
		uploader.refresh();
	};

	uploader.onFileDequeued = function(file)
	{
		if ( fileCount<=0 )
		{
			return;
		}

		fileCount--;
		fileSize -= file.size;

		delete percentages[file.id];
		if ( undefined!=options.queue )
		{
			$('#'+file.id).off().find('[data-rel="delete"]').off().end().remove();
			if ( options.queue.children().size()<=0 )
			{
				options.queue.hide();
			}
		}

		uploader.refresh();
	};

	uploader.onUploadStart = function(file)
	{
		if ( undefined!=options.queue )
		{
			var $queue = options.queue.find('#'+file.id),
				$progress = $queue.find('[data-rel="progress"]');
			if ( $progress.size()>0 )
			{
				$progress.show();
			}
		}

		if ( 'function' == typeof options.onUploadStart )
		{
			options.onUploadStart(file);
		}
	};

	uploader.onUploadProgress = function(file, percentage)
	{
		if ( undefined!=options.queue )
		{
			var $queue = options.queue.find('#'+file.id),
				$progress = $queue.find('[data-rel="progress"]'), $progressBar, per;
			if ( $progress.size()>0 )
			{
				$progressBar = $progress.find('[data-rel="progressBar"]');
				per = (percentage * 100).toFixed(2);
				if ( $progressBar.size()>0 )
				{
					$progressBar.width($progress.width()*percentage).html(per+'%');
				}
				else if  ( $progress.size()>0 )
				{
					$progress.html(per+'%');
				}
			}
		}
		percentages[file.id][1] = percentage;

		if ( 'function' == typeof options.onUploadProgress )
		{
			options.onUploadProgress(file, percentage);
		}
	};

	uploader.onUploadSuccess = function(file, data)
	{
		if ( STATUS_SUCCESS!=data.status )
		{
			if ( 'function' == typeof options.onUploadSuccess )
			{
				options.onUploadSuccess(file, data);
			}
			uploader.removeFile(file);
			return false;
		}

		if ( undefined!=options.queue )
		{
			var $queue = options.queue.find('#'+file.id),
				$progress = $queue.find('[data-rel="progress"]'),
				$hidden = $queue.find('input[data-rel="url"]');
			if ( $hidden.size()>0 )
			{
				$hidden.val(data.url);
			}
			if ( $progress.size()>0 )
			{
				$progress.hide();
			}
		}
		percentages[file.id][2] = data.url;
		uploader.refresh();

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
				text = '扩展名错误，请上传以下扩展名的文件：<br />'+this.options.accept[0].extensions;
				//text = JSON.stringify(this.options);
				break;
			default:
				text = '上传失败，请重试' + code;
				break;
		}
		inform(text, undefined, undefined);
	};


	/**
	 * @purpose 当有文件添加进来时执行，负责view的创建
	 * @param file object
	 * @author zhangheng
	 * @created 2017-12-22 14:43
	 */
	function addFile(file)
	{
		var $queue = $(options.itemTemplate.replace('{@fileID}', file.id)),
			$file = $queue.find('[data-rel="file"]'),
			$fileIcon = $queue.find('[data-rel="file-icon"]'),
			$fileName = $queue.find('[data-rel="file-name"]'),
			$progress = $queue.find('[data-rel="progress"]'),
			$progressBar = $queue.find('[data-rel="progressBar"]'),
			$original = $queue.find('input[data-rel="name"]'),
			point = file.name.lastIndexOf('.'), original = '', ext = '',
			showError = function(code)
			{
				var text;
				switch( code )
				{
					case 'exceed_size':
						text = '文件大小超出';
						break;

					case 'interrupt':
						text = '上传暂停';
						break;
					default:
						text = '上传失败，请重试';
						break;
				}

				$progressBar.size()>0 ? $progressBar.html(text) : $progress.html(text);
			};
		if ( point>-1 )
		{
			original = file.name.substr(0, point);
			ext = file.name.substr(point+1);
		}
		else
		{
			original = file.name;
		}

		if ( 'invalid'===file.getStatus() )
		{
			showError(file.statusText);
		}
		else
		{
			if ( $fileIcon.size()>0 && ext!='' && undefined!=fileIcons[ext] )
			{
				$fileIcon.html('<img src="'+HTTP_IMG+'/a/icon/'+fileIcons[ext]+'" />');
			}
			if ( $fileName.size()>0 )
			{
				$fileName.html(file.name);
			}
			if ( $original.size()>0 )
			{
				$original.val(original);
			}
		}

		file.on('statuschange', function(cur, prev){
			if ( 'progress'===prev )
			{
				//$progressBar.size()>0 ? $progressBar.html('0%') : $progress.html('0%');
			}

			if ( 'error'===cur || 'invalid'===cur )
			{
				showError(file.statusText);
				percentages[file.id][1] = 1;
			}
			else if ( 'interrupt'===cur )
			{
				showError( 'interrupt' );
			}
			else if ( 'queued'===cur )
			{
				percentages[file.id][1] = 0;
			}
			else if ( 'progress'===cur )
			{
				if ( $progress.size()>0 ) $progress.show();
			}
			else if ( 'complete'===cur )
			{
				if ( $progress.size()>0 ) $progress.hide();
			}
		});

		$queue.on('click', '[data-rel="delete"]', function(){
			uploader.removeFile(file);
		});

		$queue.appendTo(options.queue);
	}

	if ( undefined!=options.queue )
	{
		options.queue.find('[data-rel="delete"]').bind('click', function(){
			$(this).off().closest('[data-rel="queue-one"]').off().remove();
			if ( options.queue.children().size()<=0 )
			{
				options.queue.hide();
			}
		});
	}

	return uploader;
}