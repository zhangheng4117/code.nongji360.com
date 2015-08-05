/**
 * @purpose 单个文件上传
 * @param options json 选项
 * @author zhangheng
 * @created 2015-07-21 17:04
 */
function fileUploadOne(options)
{
	if ( 'object'!=typeof(options) ) options = {};
	if ( !options.width ) options.width = 100;
	if ( !options.height ) options.height = 40;
	if ( !options.hiddenName ) options.hiddenName = 'path';
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
		'queueID':options.queueID || 'queueList',						//队列容器ID值
		'queueAutoHide':false,
		'itemTemplate':'<div id="${fileID}" class="uploadify-queue-item" data-rel="uploadify-file-item">\
				<div class="uploadify-progress">\
					<div class="uploadify-progress-bar"></div>\
				</div>\
			</div>',						//队列HTML模版
		'onSelect':function(file){
			$('#' + options.queueID).find('[data-rel="uploadify-file-item"]:not(#'+file.id+')').remove();
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

			var $queueItem = $('#' + file.id).html('');
			var $file = $('<div class="uploadify-file-item" data-rel="uploadify-file-item">'+
				file.name+'<span class="uploadify-delete" data-rel="delete">删除</span>' +
				'<input type="hidden" name="'+options.hiddenName+'" value="'+data.url+'" data-rel="hidden" />'+
				'</div>').appendTo($queueItem);
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

	var $fileUpload = $(options.selector ? options.selector : '#fileUpload').uploadify(settings);
}