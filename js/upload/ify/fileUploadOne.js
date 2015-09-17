/**
 * @purpose 单个文件上传
 * @param options json 选项
 * @author zhangheng
 * @created 2015-07-21 17:04
 */
function fileUploadOne(options)
{
	if ( 'object'!=typeof(options) ) options = {};
	var $fileUpload = $(options.selector ? options.selector : '#fileUpload');
	if ( !options.width ) options.width = 100;
	if ( !options.height ) options.height = 40;
	if ( !options.hiddenName ) options.hiddenName = 'path';
	if ( !options.queueID ) options.queueID = 'queueList';
	var $hidden = $fileUpload.closest('form')
		.find('[name="'+options.hiddenName+'"]'+(options.hiddenUnique ? '[data-unique="'+options.hiddenUnique+'"]' : ''));
	var settings = {
		'swf':'/flash/uploadify.swf',
		'uploader':HTTP_IMG+'/upload.php?xtype='+options.type,
		'dataType':'json',							//上传成功返回数据的格式
		'buttonText':options.buttonText || '上传文件',	//按钮文本
		'width':options.width,
		'height':options.height,
		'queueSizeLimit':1,				//单次最多允许上传文件数
		'fileSizeLimit':options.size || 1024,						//单文件限制大小
		'fileTypeExts':options.fileTypeExts || '*.jpg;*.png;*.gif;*.jpeg;*.doc;*.docx;*.xls;*.xlsx;*.rar;*.zip',
		'fileTypeDesc':'文件',
		'auto':true,								//选择完文件是否自动上传
		'queueID':options.queueID,						//队列容器ID值
		'queueAutoHide':false,
		'itemTemplate':options.itemTemplate || '<div id="${fileID}" class="uploadify-queue-item" data-rel="uploadify-file-item">\
				<div class="fileName">${fileName} (${fileSize})</div>\
				<div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div>\
			</div>',						//队列HTML模版
		'onSelect':function(file){
			var $queue = $('#' + options.queueID);
			$queue.html($queue.find('#'+file.id));
		},
		/**
		 * @purpose 上传成功事件
		 * @param file json 选择的文件信息
		 * @param data json 执行上传文件返回的信息
		 */
		'onUploadSuccess':function(file, data){
			if ( 'SUCCESS'!=data.state )
			{
				jAlert(data.state);
				return false;
			}

			var fileHtml = '';
			if ( undefined===options.successTemplate )
			{
				fileHtml = '<div><span class="fileName">'+ file.name+'</span>' +
					'<span class="uploadify-delete" data-rel="delete">删除</span>' +
					($hidden.size()>0 ? '' : '<input type="hidden" name="'+options.hiddenName+'" value="'+data.url+'" data-rel="hidden" />') +
					'</div>';
			}
			else
			{
				fileHtml = options.successTemplate.replace(/\$\{fileName\}/ig, file.name)
					.replace(/\$\{fileSize\}/ig, file.size)
					.replace(/\$\{hiddenName\}/ig, options.hiddenName)
					.replace(/\$\{url\}/ig, data.url).replace(/\$\{thumb\}/ig, data.thumb);
			}

			var $queueItem = $('#' + file.id).html('');
			var $file = $(fileHtml).appendTo($queueItem);
			if ( 0==$hidden.size() )
			{
				$hidden = $file.find('[name="'+options.hiddenName+'"]');
				if ( 0==$hidden.size() )
				{
					$hidden = $('<input type="hidden" name="'+options.hiddenName+'" data-rel="hidden" />').appendTo($file);
				}
			}
			$hidden.val(data.url);

			$file.find('[data-rel="delete"]').bind('click', function(){
				$file.remove();
				if ( 0==$queueItem.sibling('[data-rel="uploadify-file-item"]').size() )
				{
					$queueItem.parent().hide();
				}
			});

			if ( 'function'==typeof(options.onUploadSuccess) )
			{
				options.onUploadSuccess(file, data, options);
			}

			return true;
		}
	};

	$fileUpload.uploadify(settings);
}