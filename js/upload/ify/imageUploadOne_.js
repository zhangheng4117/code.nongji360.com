/**
 * @purpose 单个文件上传
 * @param options object 选项
 * @author zhangheng
 * @created 2015-08-11 17:30
 */
function imageUploadOne(options)
{
	if ( 'object'!=typeof(options) ) options = {};
	var $imageUpload = $(options.selector ? options.selector : '#imageUpload');
	if ( !options.width ) options.width = 100;
	if ( !options.height ) options.height = 100;
	if ( !options.hiddenName ) options.hiddenName = 'thumb';
	var $hidden = $imageUpload.closest('form')
		.find('[name="'+options.hiddenName+'"]'+(options.hiddenUnique ? '[data-unique="'+options.hiddenUnique+'"]' : ''));
	options.image = options.image || $hidden.val() || HTTP_CODE+'/images/404_100.gif';
	var buttonText = options.buttonText || '<table style="width:100%;border-collapse:separate;border-spacing:0;"><tr><td style="height:'+options.height+'px;"><img src="{@article}" style="max-width:'+options.width+'px;max-height:'+options.height+'px;vertical-align:middle;" /></td></tr></table>';
	var settings = {
		'swf':'/flash/uploadify.swf',
		'uploader':!!options.uploader ? options.uploader : HTTP_IMG+'/upload.php?xtype='+options.type,
		'dataType':'json',							//上传成功返回数据的格式
		'buttonText':buttonText.replace('{@article}', options.image),	//按钮文本
		'width':options.width,
		'height':options.height,
		'queueSizeLimit':1,				//单次最多允许上传文件数
		'fileSizeLimit':options.size || 1024,						//单文件限制大小
		'fileTypeExts':options.fileTypeExts || '*.jpg;*.png;*.gif;*.jpeg;*.bmp',
		'fileTypeDesc':'文件',
		'auto':true,								//选择完文件是否自动上传
		'queueID':options.queueID || 'queueList',						//队列容器ID值
		'itemTemplate':'<div id="${fileID}" class="uploadify-queue-item" data-rel="uploadify-file-item">\
				<div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div>\
			</div>',						//队列HTML模版
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

			var thumbUrl = data.thumb || data.url;

			if ( undefined!=options.thumbSelector )
			{
				$(options.thumbSelector).attr('src', thumbUrl);
			}

			$hidden.val(data.url);
			var image = new Image();
			image.src = thumbUrl;
			image.onload = function(){
				$imageUpload.uploadify('settings', 'buttonText', buttonText.replace('{@article}', image.src));
				if ( 'function'==typeof(options.onUploadSuccess) )
				{
					options.onUploadSuccess(file, data, options);
				}
			};

			return true;
		}
	};

	$imageUpload.uploadify(settings);
}