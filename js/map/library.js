/**
 * @purpose 库函数
 * @author zhangheng
 * @created 2018/8/31 12:41
 */

function getCenterPoint(coordinates)
{
	var total = coordinates.length;
	var X = 0, Y = 0, Z = 0;
	var lat, lng, x, y, z;

	for ( var i=0; i<total; i++ )
	{
		lng = coordinates[i].lng * Math.PI / 180;
		lat = coordinates[i].lat * Math.PI / 180;

		x = Math.cos(lat) * Math.cos(lng);
		y = Math.cos(lat) * Math.sin(lng);
		z = Math.sin(lat);

		X += x;
		Y += y;
		Z += z;
	}

	X = X / total;
	Y = Y / total;
	Z = Z / total;

	var Lon = Math.atan2(Y, X);
	var Hyp = Math.sqrt(X * X + Y * Y);
	var Lat = Math.atan2(Z, Hyp);

	return {"lng":(Lon * 180 / Math.PI).toFixed(15), "lat":(Lat * 180 / Math.PI).toFixed(15)};
}