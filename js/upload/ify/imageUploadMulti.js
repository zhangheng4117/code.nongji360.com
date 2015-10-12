/**
 * @purpose 多张图片自动上传
 * @param options json 选项
 * @author zhangheng
 * @created 2015-07-20 17:45
 */
function imageUploadMulti(options)
{
	if ( 'object'!=typeof(options) ) options = {};
	if ( !options.width ) options.width = 100;
	if ( !options.height ) options.height = 40;
	if ( !options.hiddenName ) options.hiddenName = 'thumb';
	if ( undefined==options.shortcut ) options.shortcut = true;
	var settings = {
		'swf':'/flash/uploadify.swf',
		'uploader':HTTP_IMG+'/upload.php?xtype='+options.type,
		'dataType':'json',							//上传成功返回数据的格式
		'buttonText':options.buttonText || '上传图片',	//按钮文本
		'width':options.width,
		'height':options.height,
		'queueSizeLimit':options.queueSizeLimit || 999,				//单次最多允许上传文件数
		'fileSizeLimit':options.size || 1024,						//单文件限制大小
		'fileTypeExts':'*.jpg;*.png;*.gif;*.jpeg',
		'fileTypeDesc':'图像文件',
		'auto':true,								//选择完文件是否自动上传
		'queueID':options.queueID || 'queueList',						//队列容器ID值
		'queueAutoHide':false,
		'itemTemplate':options.itemTemplate ? options.itemTemplate.replace('${hiddenName}', options.hiddenName+'[]') : '<div id="${fileID}" class="multi-queue-item" data-rel="multi-queue-item">\
				<div class="multi-image">\
					<img src='+HTTP_CODE+'/images/404_100.gif'+' data-rel="thumb" /><input type="hidden" name="'+options.hiddenName+'[]" data-rel="urlHidden"'+(options.hiddenUnique ? ' data-unique="'+options.hiddenUnique+'"' : '')+' />\
					<div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div>\
				</div>\
			</div>',						//队列HTML模版
		/**
		 * @purpose 上传成功事件
		 * @param file json 选择的文件信息
		 * @param data json 执行上传文件返回的信息
		 */
		'onUploadSuccess':function(file, data){
			var $queueItem = $('#' + file.id);
			if ( 'SUCCESS'!=data.state )
			{
				$queueItem.remove();
				jAlert(data.state);
				return false;
			}

			var $url = $queueItem.find('[data-rel="url"]');
			$url.attr('src', data.url);
			$queueItem.find('[data-rel="urlHidden"]').val(data.url);
			var $thumb = $queueItem.find('[data-rel="thumb"]');
			$thumb.attr('src', data.thumb);
			$queueItem.find('[data-rel="thumbHidden"]').val(data.thumb);
			$queueItem.find('[data-rel="original"]').val(data.title || data.original);

			if ( options.shortcut )
			{
				$url.load(function(){
					shortcutRemove($queueItem);
				});
			}
			else
			{
				$queueItem.find('[data-rel="delete-item"]').bind('click', function(){
					$(this).closest('[data-rel="multi-queue-item"]').remove();
				});
			}

			if ( 'function'==typeof(options.onUploadSuccess) )
			{
				options.onUploadSuccess(file, data, options);
			}

			return true;
		},
		'onSelect':function(file)
		{
			var data = [], i;
			for ( i in file )
			{
				data.push(i + '=' + file[i]);
			}
		}
	};

	var $imageUpload = $(options.selector ? options.selector : '#imageUpload').uploadify(settings);
}


function shortcutRemove(selector)
{
	$(selector).shortcut({'bgColor':'#ccc', 'opacity':0.6, 'fontColor':'#000'},[
		{
			'text':'删除',
			'style':'width:50px;font-size:14px;text-align:center;display:block;',
			'fn':function(self){
				var $item = self.closest('[data-rel="multi-queue-item"]');
				if ( 0==$item.siblings('[data-rel="multi-queue-item"]').size() )
				{
					$item.parent().hide();
				}
				$('[nj_shortcut_index="'+self.attr("nj_shortcut_index")+'"]').remove();
				$item.remove();
			}
		}
	]);
}