/**
 * @purpose 逐级展开层级菜单
 * @author zhangheng
 * @created 2015-06-09 18:17
 */


(function($){
	$.fn.extend({
		'trickle':function(variable, option){
			if ( undefined!=this.attr('data-rel-tickle') ) return this;
			var selector = $(this), rel, $document = $(document);
			if ( undefined==variable || !$.isArray(variable) || 0===variable.length ) return selector;

			option = option || {};
			option.autoShow = true===option.autoShow;
			option.onOpen = 'function'==typeof(option.onOpen) ? option.onOpen : function(){};
			option.onClose = 'function'==typeof(option.onClose) ? option.onClose : function(){};
			option.onStart = 'function'==typeof(option.onStart) ? option.onStart : function(){};
			option.onEnd = 'function'==typeof(option.onEnd) ? option.onEnd : function(){};
			option.onComplete = 'function'==typeof(option.onComplete) ? option.onComplete : function(){};
			if ( undefined==option.css )
			{
				option.css = '<style type="text/css">'+
					'.trickle-ul{width:100%;background:#fff;border-top:solid #ccc 1px;display:none;position:absolute;left:0;top:'+(selector.offset().top+selector.outerHeight())+'px;}'+
					'.trickle-ul li{height:50px;line-height:50px;padding:0 10px;border-bottom:solid #ccc 1px;}'+
					'.trickle-ul li b{float:right;min-width:50px;text-align:center;}'+
					'</style>';
			}
			else
			{
				option.css = '<style type="text/css">'+option.css+'</style>'
			}

			rel = fn.random(10000, 99999);
			while ( $("[data-rel-tickle='"+rel+"']").size()>0 )
			{
				rel = fn.random(10000, 99999);
			}

			selector.attr('data-rel-tickle', rel);
			var hiddenName = selector.attr('id') || selector.attr('name'),
				$hidden = selector.next('input[name="'+hiddenName+'"]');
			if ( 0===$hidden.size() )
			{
				$hidden = $('<input type="hidden" name="'+hiddenName+'" />').insertAfter(selector);
			}

			var i = 0, sHtml = option.css+'<ul id="tickle-data-'+rel+'" class="trickle-ul none">';
			for ( ; i<variable.length; i++ )
			{
				sHtml += '<li data-value="['+variable[i].i+']" data-name="'+variable[i].n+'" data-child="'+!(undefined==variable[i].c || 0==variable[i].c.length)+'" data-index="['+i+']">'+
					variable[i].n+
					(true===option.sure ? '<b data-yes="true">选择</b>' : '')+
					(true===option.next && variable[i].c ? '<b>下一级</b>' : '')+
					'</li>';
			}
			sHtml += '</ul>';

			$('body').append(sHtml);
			var $tickle = $('#tickle-data-'+rel).data('level', 1);

			selector.bind('click', function(){
				$(this).data('scrollTop', $document.scrollTop());
				$('[id^=tickle-data-]:not(#'+$tickle.attr('id')+')').slideUp();

				if ( $tickle.is(':visible') )
				{
					$tickle.slideUp(function(){
						option.onClose(null, selector);
					});
				}
				else
				{
					$tickle.slideDown(function(){
						option.onOpen(selector);
					});
				}
			});
			var handleEvent = function(event)
			{
				var $this = $(this);

				option.onStart($this, selector);

				if ( true===$this.data('child') && true!==$(event.target).data('yes') )
				{
					var i=0, index = $this.data('index'), sIndex = index.join(','),
						value = $this.data('value'), sValue = value.join(','),
						name = $this.data('name'), children = variable, sHtml = '';
					for ( ; i<index.length; i++ )
					{
						children = children[index[i]].c;
					}

					if ( index.length>0 )
					{
						sHtml += '<li data-back="true" data-child="true" data-value="['+value.remove(-1).join(',')+']" data-name="'+(name.substr(0, name.lastIndexOf(',')))+'" data-index="['+index.remove(-1).join(',')+']">&lt;&lt; 返回</li>';
						sIndex += ',';
						sValue += ',';
						name += ',';
					}
					for ( i=0; i<children.length; i++ )
					{
						sHtml += '<li data-value="['+sValue+children[i].i+']" data-name="'+name+children[i].n+'" data-child="'+!(undefined==children[i].c || 0==children[i].c.length)+'" data-index="['+sIndex+i+']">'+
							children[i].n+
							(true===option.sure ? '<b data-yes="true">选择</b>' : '')+
							(true===option.next && children[i].c ? '<b>下一级</b>' : '')+
							'</li>';
					}
					$tickle.html(sHtml);
				}
				else
				{
					var thisValue = $this.data('value').join(',');
					selector.data('value', thisValue);
					$hidden.val(thisValue);
					if ( option.autoShow )
					{
						selector.html($this.html());
					}

					$tickle.slideUp(function(){
						option.onClose($this, selector);
					});
					option.onComplete($this, selector);
				}
				window.scrollTo(0, selector.data('scrollTop'));

				if ( true!==$this.data('back') )
				{
					option.onEnd($this, selector);
				}
			};
			if ( 'function'==typeof($.fn.live) )
			{
				$tickle.find('li').live('click', handleEvent);
			}
			else
			{
				$('#tickle-data-'+rel).on('click', 'li', handleEvent);
			}
		}
	});
})(jQuery);