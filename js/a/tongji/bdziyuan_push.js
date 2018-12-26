/**
 * @purpose 页面自动推送到百度
 * @author zhangheng
 * @created 2018-04-10 15:02
 */
(function(){
	var domain = document.domain;
	if ( domain.indexOf('.nongji360.com')<0 )
	{
		return false;
	}
	var bp = document.createElement('script');
	var curProtocol = window.location.protocol.split(':')[0];
	if (curProtocol === 'https') {
		bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
	}
	else {
		bp.src = 'http://push.zhanzhang.baidu.com/push.js';
	}
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(bp, s);
})();