/**
 * Created by zhangheng on 2015/10/18.
 */

(function($){
	$.shake = function(handler, options)
	{
		if ( window.DeviceMotionEvent )
		{
			if ( 'object'!=typeof(options) )
			{
				options = {};
			}
			var SHAKE_THRESHOLD = options.threshold || 5000;
			var lastUpdate = 0;
			var x, y, z, lastX, lastY, lastZ;

			if ( 'function'!=typeof(options.algorithmic) )
			{
				options.algorithmic = function(acceleration, diffTime)
				{
					x = acceleration.x;
					y = acceleration.y;
					z = acceleration.z;

					var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

					return speed>=SHAKE_THRESHOLD;
				}
			}

			function deviceMotionHandler(event)
			{
				var acceleration = event.accelerationIncludingGravity;
				var curTime = new Date().getTime();

				if ( (curTime-lastUpdate)>100 )
				{
					var diffTime = curTime - lastUpdate;
					lastUpdate = curTime;

					if ( options.algorithmic(acceleration, diffTime) )
					{
						handler(event);
					}

					lastX = x;
					lastY = y;
					lastZ = z;
				}
			}
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		}
	}
})(jQuery);