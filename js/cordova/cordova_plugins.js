if ( 'undefined' != typeof cordova )
{
	cordova.define('cordova/plugin_list', function(require, exports, module) {
		module.exports = [
			{
				"id":"phonegap-plugin-barcodescanner.BarcodeScanner",
				"file":"plugins/barcodescanner.js",
				"pluginId":"phonegap-plugin-barcodescanner",
				"clobbers":[
					"cordova.plugins.barcodeScanner"
				]
			},
			{
				"id":"org.apache.cordova.bang",
				"file":"plugins/bang.js",
				"pluginId":"org.apache.cordova.bang",
				"clobbers":[
					"Bang"
				]
			}
		];
		// TOP OF METADATA
		module.exports.metadata =
		{
			"phonegap-plugin-barcodescanner":"6.0.2",
			"org.apache.cordova.bang":"0.0.1"
		};
		// BOTTOM OF METADATA
	});
}